from typing import Optional
import datetime 

from sqlalchemy.orm import Session, joinedload

from . import model


def get_first_user(db: Session):
    return db.query(model.User).first()

def get_first_user_with_reservations(db: Session):
    return db.query(model.User).options(joinedload(model.User.reservations)).first()

def get_users_reservations(db: Session, user_id: int):
    return db.query(model.Reservation).options(joinedload(model.Reservation.time_range)).filter(model.Reservation.user_id==user_id).all()


def create_session(db: Session, user_id: int, token: str):
    session = model.UserSession(user_id = user_id, token = token)
    db.add(session)
    db.commit()

def fetch_user_by_session_token(db: Session, session_key: str) -> Optional[model.User]:
    session = db.query(model.UserSession).options(joinedload(model.UserSession.user)).filter(model.UserSession.token==session_key).first()
    if session is None:
        return None
    return session.user


def create_user(db: Session, email: str, encrypted_password: str, name: Optional[str] = None):
    user = model.User(email=email,encrypted_password=encrypted_password, name=name)
    db.add(user)
    db.commit()
    
def fetch_user_with_sessions(db: Session, email: str, encrypted_password: str) -> Optional[model.User]:
    return db.query(model.User).options(joinedload(model.User.sessions)).filter(model.User.email==email, model.User.encrypted_password==encrypted_password).first()

def fetch_date_reservation(db: Session, playground_id: int, date: datetime.date):
    return db.query(model.Reservation).options(joinedload(model.Reservation.time_range)).filter(model.Reservation.playground_id==playground_id, model.Reservation.date==date).all()

    
def fetch_reservations_by_date_range(db: Session, playground_id: int, start_date: datetime.date, end_date: datetime.date):
    return db.query(model.Reservation).options(joinedload(model.Reservation.time_range)).filter(model.Reservation.playground_id==playground_id, model.Reservation.date >= start_date, model.Reservation.date <= end_date).all()