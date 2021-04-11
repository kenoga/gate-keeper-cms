
from typing import List, Dict
from pydantic import BaseModel
import datetime
import enum

from . import model


class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileResponse(BaseModel):
    name: str
    email: str
    plan_name: str


class PutProfileRequest(BaseModel):
    email: str
    password: str


class SuccessResponse(BaseModel):
    message: str


class LoginResponse(BaseModel):
    admin: bool


def success() -> SuccessResponse:
    return SuccessResponse(message="success!")


class ReserveRequest(BaseModel):
    playground_id: int
    date: datetime.date
    time_range: str


class GatewayAction(enum.Enum):
    LOCK = "lock"
    UNLOCK = "unlock"


class GatewayRequest(BaseModel):
    gateway_session_key: str


class GatewaySessionResponse(BaseModel):
    gateway_id: int
    user_id: int
    reservation_id: int
    start_at: datetime.datetime
    end_at: datetime.datetime
    token: str

    class Config:
        orm_mode = True


class DateCalendarResponse(BaseModel):
    playground_id: int
    date: datetime.date
    reserved: Dict[model.TimeRange, int]


class MonthCalendarResponse(BaseModel):
    playground_id: int
    reserved: Dict[datetime.date, Dict[model.TimeRange, int]]


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True


class AdminMonthCalendarResponse(BaseModel):
    playground_id: int
    reserved: Dict[datetime.date, Dict[model.TimeRange, UserResponse]]


class PlaygroundResponse(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        orm_mode = True


class ReservationResponse(BaseModel):
    id: int
    user_id: int
    playground: PlaygroundResponse
    date: datetime.date
    start_at: datetime.datetime = None
    end_at: datetime.datetime = None
    time_range: model.TimeRange
    gateway_sessions: Dict[model.GatewayType, GatewaySessionResponse]

    class Config:
        orm_mode = True


class ReservationCountResponse(BaseModel):
    all_count: int
    simul_count: int
    all_limit: int
    simul_limit: int


class MyReservationsResponse(BaseModel):
    reservations: List[ReservationResponse]

    class Config:
        orm_mode = True


class GatewayStatusResponse(BaseModel):
    gateway_id: int
    status: model.DoorStatus
