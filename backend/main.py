import logging
import datetime, calendar
from typing import Optional
import enum

from fastapi import FastAPI, Cookie, Response
from fastapi.logger import logger

from pydantic import BaseModel

from .schema import *
from .import crud
from . import model
from . import service
from .service import auth
from .util import unauthorized, hash_str, randomstr 
from .database import SessionLocal

app = FastAPI()

logger = logging.getLogger(__name__)


@app.get("/health")
async def root():
    return {"message": "Hello World"}

"""
User related API
"""
@app.post("/api/user", response_model=SuccessResponse)
def post_user(param: LoginRequest) -> SuccessResponse:
    crud.create_user(SessionLocal(), param.email, hash_str(param.password), "")
    return success() 

@app.post("/api/login", response_model=SuccessResponse)
def login(param: LoginRequest, response: Response) -> SuccessResponse:
    db = SessionLocal()
    user = crud.fetch_user_with_sessions(db, param.email, hash_str(param.password))
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
def logout(response: Response, session_key: Optional[str] = Cookie(None)) -> SuccessResponse:
    user = auth(SessionLocal(), session_key)
    response.delete_cookie("session_key")
    return success()


"""
Calendar API
"""
@app.get("/api/calendar/{playground_id}/{date}")
def get_date_reservation(playground_id: int, date: datetime.date):
    result = service.get_date_calendar(SessionLocal(), playground_id, date)
    return { "playground_id": playground_id, "date": date, "reserved": result }

@app.get("/api/calendar/{playground_id}")
def get_month_reservation(playground_id: int, year: int, month: int):
    start = datetime.date(year, month, 1)
    end = datetime.date(year, month, calendar.monthrange(year, month)[1])
    result = service.get_calendar(SessionLocal(), playground_id, start, end)
    return { "playground_id": playground_id, "reserved": result }


"""
Reservation API
"""
@app.get("/api/user/{user_id}/reservations", response_model=MyReservationsResponse)
def user_reservations(user_id: int, session_key: Optional[str] = Cookie(None)):
    # TODO: sorting
    db = SessionLocal()
    user = auth(db, session_key)
    return MyReservationsResponse(reservations=service.get_user_reservations(SessionLocal(), user))

    
@app.post("/api/reserve")
def reserve(request: ReserveRequest, session_key: Optional[str] = Cookie(None)):
    db = SessionLocal()
    user = auth(db, session_key)
    start_at, end_at = service.resolve_time_range(request.date, request.time_range)
    crud.create_reservation(db, user.id, request.playground_id, request.date, start_at, end_at)
    return success()


"""
Key API
"""
# TODO: 鍵操作APIの定義




@app.put("/api/gateway/{action}", response_model=SuccessResponse)
def put_gateway(request: PutGatewayRequest, action: GatewayAction, session_key: Optional[str] = Cookie(None)):
    db = SessionLocal()
    user = auth(db, session_key)
    gateway_session = service.validate_gateway_session(db, request.gateway_session_key, user)

    if action == GatewayAction.LOCK:
        service.lock_gateway(db, gateway_session)
    else:
        service.unlock_gateway(db, gateway_session)
    
    return success()