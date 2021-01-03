import logging
from typing import Optional

from fastapi import FastAPI, Cookie
from fastapi.logger import logger

from pydantic import BaseModel

from .database import Base
from .crud import *
from .schema import *
from .util import validate_session_key, unauthorized


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


@app.post("/api/user", response_model=SuccessResponse)
def post_user(param: LoginRequest) -> SuccessResponse:
    create_user(SessionLocal(), param.email, hash(param.password), "")
    return success() 


@app.post("/api/login", response_model=SuccessResponse)
def login(param: LoginRequest, session_key: Optional[str] = Cookie(None)) -> SuccessResponse:
    logger.info("session_key: " + str(session_key))
    user = fetch_user(SessionLocal(), param.email, hash(param.password))
    logger.info(hash(param.password))
    logger.info(str(param))
    if user is None:
        unauthorized()
    return success() 


@app.post("/api/logout")
def logout():
    validate_session_key(session_key)
    return success()
