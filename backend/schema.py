
from typing import List, Dict
from pydantic import BaseModel
import datetime
import enum

from . import model


class SignUpRequest(BaseModel):
    email: str
    name: str
    plan_id: int


class SignUpResponse(BaseModel):
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class PutProfileRequest(BaseModel):
    email: str
    password: str


class SuccessResponse(BaseModel):
    message: str


class UpdatePlanRequest(BaseModel):
    user_id: int
    plan_id: int


class LoginResponse(BaseModel):
    admin: bool


def success() -> SuccessResponse:
    return SuccessResponse(message="success!")


class ReserveRequest(BaseModel):
    playground_id: int
    date: datetime.date
    time_range: str


class AdminReserveRequest(BaseModel):
    playground_id: int
    date: datetime.date
    time_range: str
    user_id: int


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


class PlanResponse(BaseModel):
    id: int
    name: str
    monthly_limit: int
    simul_limit: int

    class Config:
        orm_mode = True


class ProfileResponse(BaseModel):
    name: str
    email: str
    plan: PlanResponse


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    plan: PlanResponse

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


class UserListResponse(BaseModel):
    user_list: List[UserResponse]

    class Config:
        orm_mode = True
