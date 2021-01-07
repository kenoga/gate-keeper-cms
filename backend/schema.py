
from typing import List
from pydantic import BaseModel
import datetime
import enum

from . import model

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
    time_range: str 

class GatewayAction(enum.Enum):
    LOCK = "lock"
    UNLOCK = "unlock"     

class PutGatewayRequest(BaseModel):
    gateway_session_key: str


class GatewaySessionResponse(BaseModel):
    gateway_id: int
    user_id: int
    reservation_id: int
    start_at: datetime.datetime
    end_at: datetime.datetime
    status: model.GatewaySessionStatus
    token: str

    class Config:
        orm_mode = True

class ReservationResponse(BaseModel):
    id: int
    user_id: int
    playground_id: int
    date: datetime.date
    start_at: datetime.datetime = None
    end_at: datetime.datetime = None
    time_range: model.TimeRange
    gateway_sessions: List[GatewaySessionResponse] = []

    class Config:
        orm_mode = True
    
    
class MyReservationsResponse(BaseModel):
    reservations: List[ReservationResponse]
    
    class Config:
        orm_mode = True

    