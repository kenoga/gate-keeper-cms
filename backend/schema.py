
from pydantic import BaseModel
import datetime
import enum

class LoginRequest(BaseModel):
    email: str
    password: str


class SuccessResponse(BaseModel):
    message: str


def success() -> SuccessResponse:
    return SuccessResponse(message="success!")


class ReserveRequest(BaseModel):
    playground_id: int
    date: datetime.date
    time_range_id: int

class GatewayAction(enum.Enum):
    LOCK = "lock"
    UNLOCK = "unlock"     

class PutGatewayRequest(BaseModel):
    gateway_session_key: str