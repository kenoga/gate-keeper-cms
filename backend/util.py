from typing import Optional, Any, NoReturn
from fastapi import HTTPException
import hashlib

def validate_session_key(key: Optional[Any]) -> NoReturn:
    if key is None:
        raise HTTPException(status_code=400, detail="Invalid request.")

def hash(value: str) -> str:
    return hashlib.sha256(str).hexdigest()

def unauthorized() -> NoReturn:
    raise HTTPException(status_code=503, detail="Unauthorized.")