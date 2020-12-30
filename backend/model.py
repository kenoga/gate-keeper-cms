from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DATETIME 
from .database import Base


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    encrypted_password = Column(String)
    updated_at = Column(DATETIME)
    created_at = Column(DATETIME)