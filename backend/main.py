import logging
import datetime, calendar
from typing import Optional

from fastapi import FastAPI, Cookie, Response
from fastapi.logger import logger

from pydantic import BaseModel

from .schema import *
from .import crud
from . import model
from . import service
from .util import validate_session_key, unauthorized, hash_str, randomstr 
from .database import SessionLocal

app = FastAPI()

logger = logging.getLogger(__name__)


@app.get("/health")
async def root():
    return {"message": "Hello World"}



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
    validate_session_key(session_key)
    response.delete_cookie("session_key")
    return success()

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
    

@app.post("/api/calendar/test")
def test(date: datetime.date):
    db = SessionLocal()
    r = model.Reservation(user_id=1, playground_id=1, date=date)
    db.add(r)
    db.commit()
    return success()


@app.get("/api/user/{user_id}/reservations")
def user_reservations(user_id: int):
    return { "reservations": crud.get_users_reservations(SessionLocal(), user_id) }