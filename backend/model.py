from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Date, ForeignKey, Enum
from sqlalchemy.sql.functions import current_timestamp
from sqlalchemy.orm import relationship
from .database import Base
import enum


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    encrypted_password = Column(String)
    updated_at = Column(DateTime, nullable=False, server_default=current_timestamp())
    created_at = Column(DateTime, nullable=False, server_default=current_timestamp())

    sessions = relationship("UserSession", back_populates="user")
    reservations = relationship("Reservation", back_populates="user")

class UserSession(Base):
    __tablename__ = "user_session"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    token = Column(String)
    updated_at = Column(DateTime, nullable=False, server_default=current_timestamp())
    created_at = Column(DateTime, nullable=False, server_default=current_timestamp())

    user = relationship("User", back_populates="sessions")

class Playground(Base):
    __tablename__ = "playground"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    updated_at = Column(DateTime, nullable=False, server_default=current_timestamp())
    created_at = Column(DateTime, nullable=False, server_default=current_timestamp())

class ReservationStatus(enum.Enum):
    RESERVED = "RESERVED"
    CANCELED = "CANCELED"
    

class Reservation(Base):
    __tablename__ = "reservation"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    playground_id = Column(Integer, ForeignKey("playground.id"))
    date = Column(Date)
    status = Column(Enum(ReservationStatus), nullable=False)
    time_range_id = Column(Integer, ForeignKey("time_range.id"))

    updated_at = Column(DateTime, nullable=False, server_default=current_timestamp())
    created_at = Column(DateTime, nullable=False, server_default=current_timestamp())

    user = relationship("User", back_populates="reservations") 
    playground = relationship("Playground") 
    time_range = relationship("TimeRange")



class TimeRange(Base):
    __tablename__ = "time_range"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    start_hour = Column(Integer, nullable=False)
    end_hour = Column(Integer, nullable=False)
    


    
