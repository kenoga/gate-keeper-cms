import logging

from fastapi import FastAPI, Cookie
from fastapi.logger import logger

from pydantic import BaseModel

from .database import Base
from .crud import *
from .schema import *

from .database import SessionLocal, engine


app = FastAPI()

logger = logging.getLogger(__name__)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/test/{id}")
def test(id: int = None):
    return {"message": "test", "id": id}


@app.get("/db")
def db():
    session = SessionLocal()
    user = get_first_user(session)
    return {"user": user, "reservations": get_users_reservations(session, 1)}


@app.get("/db2")
def db2():
    session = SessionLocal()
    user = get_first_user_with_reservations(session)
    return {"user_with_reservations": user}


@app.get("/session/{user_id}")
def session(user_id: int):
    session = SessionLocal()
    create_session(session, user_id, 'test_token')
    return


@app.post("/api/login")
def login(param: LoginRequest, session_key: str = Cookie(None)):
    logger.info("session_key: " + str(session_key))
    return {"param": param}


@app.post("/api/logout")
def logout():
    pass
