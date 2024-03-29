import enum
import datetime
from .database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import current_timestamp
from sqlalchemy import Boolean, Column, Integer, String, \
    DateTime, Date, ForeignKey, Enum

from .util import hash_str


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    encrypted_password = Column(String)
    plan_id = Column(Integer, ForeignKey("plan.id"), nullable=False)
    admin = Column(Boolean, nullable=False, default=False)
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())

    sessions = relationship("UserSession", back_populates="user")
    reservations = relationship("Reservation", back_populates="user")
    gateway_sessions = relationship("GatewaySession", back_populates="user")
    plan = relationship("Plan", back_populates="users")

    def update_password(self, password) -> None:
        self.encrypted_password = hash_str(password)


class UserSession(Base):
    __tablename__ = "user_session"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    token = Column(String)
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())

    user = relationship("User", back_populates="sessions")


class Playground(Base):
    __tablename__ = "playground"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())

    gateways = relationship("Gateway", back_populates="playground")


class ReservationStatus(enum.Enum):
    RESERVED = "RESERVED"
    CANCELED = "CANCELED"


class TimeRange(enum.Enum):
    DAY = "DAY"
    EVENING = "EVENING"
    NIGHT = "NIGHT"
    OTHER = "OTHER"

    def to_hour_range(self) -> tuple[int, int]:
        if self.value == "DAY":
            return (12, 17)
        elif self.value == "EVENING":
            return (18, 23)
        elif self.value == "NIGHT":
            return (24, 10)
        else:
            return (0, 0)

    def to_datetimes(self,
                     date: datetime.date) -> tuple[datetime.datetime,
                                                   datetime.datetime]:
        date = date if self.value != "NIGHT" \
            else date + datetime.timedelta(days=1)
        start_hour, end_hour = self.to_hour_range()
        start_hour, end_hour = start_hour % 24, end_hour % 23
        return datetime.datetime(
            year=date.year, month=date.month, day=date.day,
            hour=start_hour, minute=0, second=0
        ), datetime.datetime(
            year=date.year, month=date.month, day=date.day,
            hour=end_hour, minute=0, second=0
        )


class Reservation(Base):
    __tablename__ = "reservation"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    playground_id = Column(
        Integer,
        ForeignKey("playground.id"),
        nullable=False)
    date = Column(Date, nullable=False)
    status = Column(
        Enum(ReservationStatus),
        nullable=False,
        default=ReservationStatus.RESERVED)

    start_at = Column(DateTime, nullable=False)
    end_at = Column(DateTime, nullable=False)
    time_range = Column(
        Enum(TimeRange),
        nullable=True,
        default=TimeRange.OTHER)

    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())

    user = relationship("User", back_populates="reservations")
    playground = relationship("Playground")
    gateway_sessions = relationship(
        "GatewaySession",
        back_populates="reservation")


class GatewayType(enum.Enum):
    ENTRANCE = "ENTRANCE"
    DOOR = "DOOR"


# これはDBに保存されない。デバイスが持つ状態
class DoorStatus(enum.Enum):
    LOCKED = "LOCKED"
    UNLOCKED = "UNLOCKED"

# これはDBに保存されない。


class Gateway(Base):
    __tablename__ = "gateway"
    id = Column(Integer, primary_key=True, index=True)
    playground_id = Column(
        Integer,
        ForeignKey("playground.id"),
        nullable=False)
    type = Column(Enum(GatewayType), nullable=False)

    playground = relationship("Playground", back_populates="gateways")
    controllers = relationship("GatewayController", back_populates="gateway")
    session = relationship(
        "GatewaySession",
        uselist=False,
        back_populates="gateway")


class GatewayControllerType(enum.Enum):
    SWITCH_BOT = "SWITCH_BOT"
    SESAMI = "SESAMI"


class GatewayController(Base):
    __tablename__ = "gateway_controller"
    id = Column(Integer, primary_key=True, index=True)
    gateway_id = Column(Integer, ForeignKey("gateway.id"), nullable=False)
    type = Column(Enum(GatewayControllerType), nullable=False)
    key = Column(String, nullable=False)

    gateway = relationship("Gateway", back_populates="controllers")


class GatewaySessionStatus(enum.Enum):
    CREATED = "CREATED"
    CANCELED = "CANCELED"


class GatewaySession(Base):
    __tablename__ = "gateway_session"
    id = Column(Integer, primary_key=True, index=True)
    gateway_id = Column(Integer, ForeignKey("gateway.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    reservation_id = Column(Integer, ForeignKey("reservation.id"),
                            nullable=True)

    start_at = Column(DateTime, nullable=False)
    end_at = Column(DateTime, nullable=False)
    status = Column(Enum(GatewaySessionStatus), nullable=False)
    token = Column(String, nullable=False)

    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())
    created_at = Column(
        DateTime,
        nullable=False,
        server_default=current_timestamp())

    user = relationship("User", back_populates="gateway_sessions")
    gateway = relationship("Gateway", back_populates="session")
    reservation = relationship(
        "Reservation",
        back_populates="gateway_sessions")


class Plan(Base):
    __tablename__ = "plan"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    monthly_limit = Column(Integer, nullable=False)
    simul_limit = Column(Integer, nullable=False)

    users = relationship("User", back_populates="plan")
