from typing import Optional
import datetime

from sqlalchemy.orm import Session, joinedload

from . import model


def get_first_user(db: Session):
    return db.query(model.User).first()


def get_first_user_with_reservations(db: Session):
    return db.query(
        model.User).options(
        joinedload(
            model.User.reservations)).first()


def fetch_user_reservations(db: Session, user_id: int):
    return db.query(
        model.Reservation).options(
        joinedload(
            model.Reservation.gateway_sessions)).options(
                joinedload(
                    model.Reservation.playground)).filter(
                        model.Reservation.user_id == user_id).order_by(
                            model.Reservation.start_at.desc()).all()


def fetch_user_active_reservation(
        db: Session,
        user_id: int,
        time: datetime.datetime):
    return db.query(model.Reservation) \
        .options(
        joinedload(
            model.Reservation.gateway_sessions)
        .joinedload(
            model.GatewaySession.gateway)) \
        .options(
        joinedload(
            model.Reservation.playground)) \
        .filter(
        model.Reservation.user_id == user_id,
        model.Reservation.start_at <= time,
        model.Reservation.end_at >= time).first()


def create_session(db: Session, user_id: int, token: str):
    session = model.UserSession(user_id=user_id, token=token)
    db.add(session)
    db.commit()


def fetch_user_by_session_token(db: Session,
                                session_key: str) -> Optional[model.User]:
    session = db.query(
        model.UserSession).options(
        joinedload(
            model.UserSession.user)).filter(
                model.UserSession.token == session_key).first()
    if session is None:
        return None
    return session.user


def create_user(
        db: Session,
        email: str,
        encrypted_password: str,
        name: Optional[str] = None):
    user = model.User(
        email=email,
        encrypted_password=encrypted_password,
        name=name)
    db.add(user)
    db.commit()


def create_reservation(
        db: Session,
        user_id: int,
        playground_id: int,
        date: datetime.date,
        time_range: model.TimeRange,
        start_at: datetime.datetime,
        end_at: datetime.datetime):
    r = model.Reservation(
        user_id=user_id,
        playground_id=playground_id,
        date=date,
        start_at=start_at,
        end_at=end_at,
        time_range=time_range)
    db.add(r)
    db.commit()


def fetch_user_with_sessions(db: Session,
                             email: str,
                             encrypted_password: str) -> Optional[model.User]:
    return db.query(
        model.User).options(
        joinedload(
            model.User.sessions)).filter(
                model.User.email == email,
        model.User.encrypted_password == encrypted_password).first()


def fetch_date_reservation(
        db: Session,
        playground_id: int,
        date: datetime.date):
    return db.query(
        model.Reservation).filter(
        model.Reservation.playground_id == playground_id,
        model.Reservation.date == date).all()


def fetch_reservations_by_date_range(
        db: Session,
        playground_id: int,
        start_date: datetime.date,
        end_date: datetime.date):
    return db.query(
        model.Reservation).filter(
        model.Reservation.playground_id == playground_id,
        model.Reservation.date >= start_date,
        model.Reservation.date <= end_date).all()


def fetch_reservations_by_time(
        db: Session,
        playground_id: int,
        date: datetime.date,
        time_range: model.TimeRange):
    return db.query(
        model.Reservation).filter(
        model.Reservation.playground_id == playground_id,
        model.Reservation.date == date,
        model.Reservation.time_range == time_range).all()


def fetch_all_user_reservations(
        db: Session,
        user: model.User,
        from_at: datetime.date,
        until_at: datetime.date):
    return db.query(model.Reservation).filter(
        model.Reservation.user_id == user.id,
        from_at <= model.Reservation.date,
        model.Reservation.date <= until_at,
    ).all()


# GATEWAY
def fetch_gateway_session_by_token(
        db: Session,
        token: str) -> Optional[model.GatewaySession]:
    return db.query(
        model.GatewaySession).options(
        joinedload(
            model.GatewaySession.gateway)).filter(
                model.GatewaySession.token == token).first()
