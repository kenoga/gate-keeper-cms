from .database import SessionLocal
from .util import unauthorized, hash_str, randomstr, today
from .service import auth
from . import service
from .import crud
import logging
import datetime
import calendar
from typing import Optional, List

from fastapi import FastAPI, Cookie, Response, Depends, HTTPException
from fastapi.logger import logger

from sqlalchemy.orm import Session

from .schema import SuccessResponse, LoginRequest, success, GatewayRequest, \
    GatewayAction, GatewayStatusResponse, \
    ReservationResponse, ReserveRequest, MyReservationsResponse, \
    DateCalendarResponse, MonthCalendarResponse, ReservationCountResponse, \
    SignUpRequest, AdminMonthCalendarResponse, LoginResponse, ProfileResponse, PutProfileRequest, \
    UserListResponse, PlanResponse, UpdatePlanRequest, SignUpResponse, AdminReserveRequest

app = FastAPI()

logger = logging.getLogger(__name__)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/health")
async def root():
    return {"message": "Hello World"}


"""
User related API
"""


@app.post("/api/login", response_model=LoginResponse)
def login(param: LoginRequest,
          response: Response,
          db: Session = Depends(get_db)) -> LoginResponse:
    user = crud.fetch_user_with_sessions(
        db, param.email, hash_str(param.password))
    if user is None:
        unauthorized()
    if user.sessions:
        # attach the existed token
        logger.info("session token: " + user.sessions[0].token)
        response.set_cookie("session_key", user.sessions[0].token)
    else:
        # create and attach a new token
        token = randomstr(64)
        crud.create_session(db, user.id, token)
        logger.info("new session token: " + token)
        response.set_cookie("session_key", token)
    if user.admin:
        return LoginResponse(admin=True)
    return LoginResponse(admin=False)


@app.post("/api/logout", response_model=SuccessResponse)
def logout(response: Response,
           session_key: Optional[str] = Cookie(None),
           db: Session = Depends(get_db)) -> SuccessResponse:
    auth(db, session_key)
    response.delete_cookie("session_key")
    return success()


@app.get("/api/user/profile", response_model=ProfileResponse)
def get_profile(session_key: Optional[str] = Cookie(None),
                db: Session = Depends(get_db)) -> ProfileResponse:
    user = auth(db, session_key)
    plan = user.plan
    return ProfileResponse(name=user.name,
                           email=user.email,
                           plan=plan)


@app.put("/api/user/profile", response_model=SuccessResponse)
def put_profile(param: PutProfileRequest,
                session_key: Optional[str] = Cookie(None),
                db: Session = Depends(get_db)) -> SuccessResponse:
    user = auth(db, session_key)
    user.email = param.email
    if param.password is not None and len(param.password) > 0:
        user.update_password(param.password)
    db.commit()

    return success()


"""
Calendar API
"""


@app.get("/api/calendar/{playground_id}/{date}",
         response_model=DateCalendarResponse)
def get_date_reservation(playground_id: int,
                         date: datetime.date,
                         db: Session = Depends(get_db)):
    result = service.get_date_calendar(db, playground_id, date)
    return DateCalendarResponse(
        playground_id=playground_id,
        date=date,
        reserved=result)


@app.get("/api/calendar/{playground_id}", response_model=MonthCalendarResponse)
def get_month_reservation(playground_id: int,
                          year: int,
                          month: int,
                          db: Session = Depends(get_db)):
    start = datetime.date(year, month, 1)
    end = datetime.date(year, month, calendar.monthrange(year, month)[1])
    result = service.get_calendar(db, playground_id, start, end)
    return MonthCalendarResponse(playground_id=playground_id, reserved=result)


"""
Reservation API
"""


@app.get("/api/user/reservations",
         response_model=MyReservationsResponse)
def user_reservations(session_key: Optional[str] = Cookie(None),
                      db: Session = Depends(get_db)):
    user = auth(db, session_key)
    return MyReservationsResponse(
        reservations=service.get_user_reservations(db, user))


@app.get("/api/user/reservations/active",
         response_model=ReservationResponse)
def user_active_reservation(session_key: Optional[str] = Cookie(None),
                            db: Session = Depends(get_db)):
    user = auth(db, session_key)
    result = service.get_user_active_reservation(db, user)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Active reservation not found")
    return result


@app.post("/api/reserve")
def reserve(request: ReserveRequest,
            session_key: Optional[str] = Cookie(None),
            db: Session = Depends(get_db)):
    user = auth(db, session_key)
    start_at, end_at = service.resolve_time_range(
        request.date, request.time_range)
    service.check_reservation_duplicate(
        db, request.playground_id, request.date, request.time_range)

    service.check_user_reservation_limit(
        db, user, today())

    crud.create_reservation(
        db,
        user.id,
        request.playground_id,
        request.date,
        request.time_range,
        start_at,
        end_at)
    return success()


@app.get("/api/user/reservations/count",
         response_model=ReservationCountResponse)
def user_reservation_count(session_key: Optional[str] = Cookie(None),
                           db: Session = Depends(get_db)):
    user = auth(db, session_key)
    all_count, simul_count = service.get_users_reservation_count(
        db, user, today()
    )
    return ReservationCountResponse(
        all_count=all_count,
        simul_count=simul_count,
        all_limit=user.plan.monthly_limit,
        simul_limit=user.plan.simul_limit)


"""
Key API
"""
# TODO: 鍵操作APIの定義


@app.put("/api/gateway/{action}", response_model=GatewayStatusResponse)
def put_gateway(request: GatewayRequest,
                action: GatewayAction,
                session_key: Optional[str] = Cookie(None),
                db: Session = Depends(get_db)):
    user = auth(db, session_key)
    gateway_session = service.validate_gateway_session(
        db, request.gateway_session_key, user)

    if action == GatewayAction.LOCK:
        service.lock_gateway(db, gateway_session)
    else:
        service.unlock_gateway(db, gateway_session)

    return GatewayStatusResponse(
        gateway_id=gateway_session.id,
        status=service.get_gateway_status(gateway_session)
    )


@app.get("/api/gateway", response_model=GatewayStatusResponse)
def get_gateway_status(request: GatewayRequest,
                       session_key: Optional[str] = Cookie(None),
                       db: Session = Depends(get_db)):
    user = auth(db, session_key)
    gateway_session = service.validate_gateway_session(
        db, request.gateway_session_key, user)

    return GatewayStatusResponse(
        gateway_id=gateway_session.id,
        status=service.get_gateway_status(gateway_session))


# Admin API
@app.get("/api/admin/user", response_model=UserListResponse)
def post_user(session_key: Optional[str] = Cookie(None),
              db: Session = Depends(get_db)) -> UserListResponse:
    service.auth_admin(db, session_key)
    users = crud.get_users(db)
    return UserListResponse(user_list=users)


@app.get("/api/admin/plan", response_model=List[PlanResponse])
def post_user(session_key: Optional[str] = Cookie(None),
              db: Session = Depends(get_db)) -> List[PlanResponse]:
    service.auth_admin(db, session_key)
    return crud.get_plans(db)


@app.post("/api/admin/user", response_model=SignUpResponse)
def post_user(param: SignUpRequest,
              session_key: Optional[str] = Cookie(None),
              db: Session = Depends(get_db)) -> SignUpResponse:
    service.auth_admin(db, session_key)
    password = randomstr(16)
    crud.create_user(
        db,
        param.email,
        hash_str(password),
        param.name,
        param.plan_id)
    return SignUpResponse(password=password)


@app.put("/api/admin/user/plan", response_model=SuccessResponse)
def put_user_plan(param: UpdatePlanRequest,
                  session_key: Optional[str] = Cookie(None),
                  db: Session = Depends(get_db)):
    service.auth_admin(db, session_key)
    user = crud.get_user(db, int(param.user_id))
    if user:
        user.plan_id = param.plan_id
    else:
        raise HTTPException(
            status_code=404,
            detail="User not found.")
    db.commit()
    return success()


@app.get("/api/admin/calendar/{playground_id}",
         response_model=AdminMonthCalendarResponse)
def get_admin_month_reservation(playground_id: int,
                                year: int,
                                month: int,
                                session_key: Optional[str] = Cookie(None),
                                db: Session = Depends(get_db)):
    service.auth_admin(db, session_key)
    start = datetime.date(year - 1, month, 1)
    end = datetime.date(year + 1, month, calendar.monthrange(year, month)[1])
    result = service.get_calendar_with_user(db, playground_id, start, end)
    return AdminMonthCalendarResponse(
        playground_id=playground_id,
        reserved=result)


@app.post("/api/admin/reserve")
def reserve(request: AdminReserveRequest,
            session_key: Optional[str] = Cookie(None),
            db: Session = Depends(get_db)):
    service.auth_admin(db, session_key)
    start_at, end_at = service.resolve_time_range(
        request.date, request.time_range)
    service.check_reservation_duplicate(
        db, request.playground_id, request.date, request.time_range)

    user = crud.get_user_by_id(db, request.user_id)

    service.check_user_reservation_limit(
        db, user, today())

    crud.create_reservation(
        db,
        user.id,
        request.playground_id,
        request.date,
        request.time_range,
        start_at,
        end_at)
    return success()
