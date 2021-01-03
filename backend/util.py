from typing import Optional, Any, NoReturn
from fastapi import HTTPException
import hashlib
import random, string


def validate_session_key(key: Optional[Any]) -> NoReturn:
    if key is None:
        unauthorized()

def hash_str(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()

def unauthorized() -> NoReturn:
    raise HTTPException(status_code=401, detail="Unauthorized.")

def randomstr(n):
   return ''.join(random.choices(string.ascii_letters + string.digits, k=n))