from typing import Optional, Any, NoReturn
from fastapi import HTTPException
import hashlib
import random, string
from .crud import fetch_user_by_session_token

from sqlalchemy.orm import Session


def auth(db: Session, session_key: Optional[Any]) -> NoReturn:
    if session_key is None:
        unauthorized()
    user = fetch_user_by_session_token(db, session_key)
    if user is None:
        unauthorized()
    return user

def hash_str(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

def unauthorized() -> NoReturn:
    raise HTTPException(status_code=401, detail="Unauthorized.")

def randomstr(n):
   return ''.join(random.choices(string.ascii_letters + string.digits, k=n))