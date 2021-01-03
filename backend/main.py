import logging
from typing import Optional

from fastapi import FastAPI, Cookie, Response
from fastapi.logger import logger

from pydantic import BaseModel

from .database import Base
from .crud import *
from .schema import *
from .util import validate_session_key, unauthorized, hash_str, randomstr 


from .database import SessionLocal, engine


app = FastAPI()

logger = logging.getLogger(__name__)


@app.get("/health")
async def root():
    return {"message": "Hello World"}


@app.get("/session/{user_id}")
def session(user_id: int):
    session = SessionLocal()
    create_session(session, user_id, 'test_token')
    return


@app.post("/api/user", response_model=SuccessResponse)
def post_user(param: LoginRequest) -> SuccessResponse:
    create_user(SessionLocal(), param.email, hash_str(param.password), "")
    return success() 


@app.post("/api/login", response_model=SuccessResponse)
def login(param: LoginRequest, response: Response) -> SuccessResponse:
    db = SessionLocal()
    user = fetch_user_with_sessions(db, param.email, hash_str(param.password))
    if user is None:
        unauthorized()
    if user.sessions:
        # attach the existed token
        logger.info("session token: " + user.sessions[0].token)
        response.set_cookie("session_key", user.sessions[0].token)
    else:
        # create and attach a new token
        token = randomstr(64)
        create_session(db, user.id, token)
        logger.info("new session token: " + token)
        response.set_cookie("session_key", token) 
    return success() 


@app.post("/api/logout", response_model=SuccessResponse)
def logout(response: Response, session_key: Optional[str] = Cookie(None)) -> SuccessResponse:
    validate_session_key(session_key)
    response.delete_cookie("session_key")
    return success()
