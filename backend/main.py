from .database import SessionLocal
from .util import unauthorized, hash_str, randomstr
from .service import auth
from . import service
from .import crud
import logging
import datetime
import calendar
from typing import Optional

from fastapi import FastAPI, Cookie, Response, Depends
from fastapi.logger import logger

from sqlalchemy.orm import Session

from .schema import SuccessResponse, LoginRequest, success, GatewayRequest, \
    GatewayAction, GatewayStatusResponse, \
    ReservationResponse, ReserveRequest, MyReservationsResponse, \
    DateCalendarResponse, MonthCalendarResponse

app = FastAPI()

logger = logging.getLogger(__name__)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
async def root():
    return {"message": "Hello World"}


"""
User related API
"""


@app.post("/api/user", response_model=SuccessResponse)
def post_user(param: LoginRequest,
              db: Session = Depends(get_db)) -> SuccessResponse:
    crud.create_user(db, param.email, hash_str(param.password), "")
    return success()


@app.post("/api/login", response_model=SuccessResponse)
def login(param: LoginRequest,
          response: Response,
          db: Session = Depends(get_db)) -> SuccessResponse:
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
    return success()


@app.post("/api/logout", response_model=SuccessResponse)
def logout(response: Response,
           session_key: Optional[str] = Cookie(None),
           db: Session = Depends(get_db)) -> SuccessResponse:
    user = auth(db, session_key)
    response.delete_cookie("session_key")
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


@app.get("/api/user/{user_id}/reservations",
         response_model=MyReservationsResponse)
def user_reservations(user_id: int,
                      session_key: Optional[str] = Cookie(None),
                      db: Session = Depends(get_db)):
    # TODO: sorting
    try:
        user = auth(db, session_key)
        return MyReservationsResponse(
            reservations=service.get_user_reservations(
                db, user))
    finally:
        db.close()


@app.get("/api/user/{user_id}/reservations/active",
         response_model=ReservationResponse)
def user_active_reservation(user_id: int,
                            session_key: Optional[str] = Cookie(None),
                            db: Session = Depends(get_db)):
    user = auth(db, session_key)
    if user.id != user_id:
        unauthorized()
    return service.get_user_active_reservation(db, user)


@app.post("/api/reserve")
def reserve(request: ReserveRequest,
            session_key: Optional[str] = Cookie(None),
            db: Session = Depends(get_db)):
    user = auth(db, session_key)
    start_at, end_at = service.resolve_time_range(
        request.date, request.time_range)
    service.check_reservation_duplicate(
        db, request.playground_id, request.date, request.time_range)

    crud.create_reservation(
        db,
        user.id,
        request.playground_id,
        request.date,
        request.time_range,
        start_at,
        end_at)
    return success()


"""
Key API
"""
# TODO: 鍵操作APIの定義


@app.put("/api/gateway/{action}", response_model=SuccessResponse)
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

    return success()


@app.get("/api/gateway", response_model=SuccessResponse)
def get_gateway_status(request: GatewayRequest,
                       session_key: Optional[str] = Cookie(None),
                       db: Session = Depends(get_db)):
    user = auth(db, session_key)
    gateway_session = service.validate_gateway_session(
        db, request.gateway_session_key, user)

    return GatewayStatusResponse(
        gateway_id=gateway_session.id,
        status=get_gateway_status(gateway_session))
