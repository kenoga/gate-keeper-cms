from typing import Optional, Any, NoReturn
from fastapi import HTTPException
import hashlib
import random
import string
import calendar
from datetime import datetime, timezone, timedelta, date

from sqlalchemy.orm import Session


def hash_str(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()


def unauthorized() -> NoReturn:
    raise HTTPException(status_code=401, detail="Unauthorized.")


def randomstr(n):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))


def month_last_day(year: int, month: int):
    return calendar.monthrange(year, month)[1]


JST = timezone(timedelta(hours=+9), 'JST')


def now():
    return datetime.now(JST)


def today():
    return now().date()
