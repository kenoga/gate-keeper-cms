from sqlalchemy.orm import Session, joinedload

from . import model


def get_first_user(db: Session):
    return db.query(model.User).first()

def get_first_user_with_reservations(db: Session):
    return db.query(model.User).options(joinedload(model.User.reservations)).first()

def get_users_reservations(db: Session, user_id: int):
    return db.query(model.Reservation).filter(model.Reservation.user_id==user_id).all()


def create_session(db: Session, user_id: int, token: str):
    session = model.UserSession(user_id = user_id, token = token)
    db.add(session)
    db.commit() 