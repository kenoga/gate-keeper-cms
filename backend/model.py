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
    gateway_sessions = relationship("GatewaySession", back_populates="user")

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

    gateways = relationship("Gateway", back_populates="playground")

class ReservationStatus(enum.Enum):
    RESERVED = "RESERVED"
    CANCELED = "CANCELED"
    

class Reservation(Base):
    __tablename__ = "reservation"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    playground_id = Column(Integer, ForeignKey("playground.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(Enum(ReservationStatus), nullable=False, default=ReservationStatus.RESERVED)
    time_range_id = Column(Integer, ForeignKey("time_range.id"), nullable=False)

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

class GatewayType(enum.Enum):
    ENTRANCE = "ENTRANCE"
    DOOR = "DOOR"
    

class Gateway(Base):
    __tablename__ = "gateway"
    id = Column(Integer, primary_key=True, index=True)
    playground_id = Column(Integer, ForeignKey("playground.id"), nullable=False)
    type = Column(Enum(GatewayType), nullable=False)

    playground = relationship("Playground", back_populates="gateways")
    controllers = relationship("GatewayController", back_populates="gateway")
    session = relationship("GatewaySession", uselist=False, back_populates="gateway")
    
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
    start_at = Column(DateTime, nullable=False)
    end_at = Column(DateTime, nullable=False)
    status = Column(Enum(GatewaySessionStatus), nullable=False)
    token = Column(String, nullable=False) 

    updated_at = Column(DateTime, nullable=False, server_default=current_timestamp())
    created_at = Column(DateTime, nullable=False, server_default=current_timestamp())

    user = relationship("User", back_populates="gateway_sessions") 
    gateway = relationship("Gateway", back_populates="session")
    
    
     
    

    


    
