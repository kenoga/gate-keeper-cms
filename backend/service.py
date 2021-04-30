from typing import Optional, Any, NoReturn, Tuple, List
from datetime import date, datetime
import logging
from fastapi import HTTPException
from . import crud
from . import model
from . import util
from . import schema

from collections import defaultdict

from sqlalchemy.orm import Session


logger = logging.getLogger(__name__)


def get_date_calendar(db: Session, playground_id: int, date: date):
    reservations = crud.fetch_date_reservation(db, playground_id, date)
    # 現状はRESERVEDのみが有効なもの
    reservations = [r for r in reservations if r.status ==
                    model.ReservationStatus.RESERVED]
    d = {}
    for r in reservations:
        d[r.time_range.name] = r.user_id
    return d


def get_calendar(
        db: Session,
        playground_id: int,
        start_date: date,
        end_date: date):
    reservations = crud.fetch_reservations_by_date_range(
        db, playground_id, start_date, end_date)
    reservations = [r for r in reservations if r.status ==
                    model.ReservationStatus.RESERVED]

    d = defaultdict(dict)
    for r in reservations:
        d[r.date][r.time_range.name] = r.user_id
    return d


def get_calendar_with_user(
        db: Session,
        playground_id: int,
        start_date: date,
        end_date: date):
    reservations = crud.fetch_reservations_by_date_range(
        db, playground_id, start_date, end_date)
    reservations = [r for r in reservations if r.status ==
                    model.ReservationStatus.RESERVED]

    d = defaultdict(dict)
    for r in reservations:
        d[r.date][r.time_range.name] = r.user
    return d


def auth(db: Session, session_key: Optional[Any]) -> model.User:
    if session_key is None:
        util.unauthorized()
    user = crud.fetch_user_by_session_token(db, session_key)
    if user is None:
        util.unauthorized()
    return user


def auth_admin(db: Session, session_key: Optional[Any]) -> model.User:
    user = auth(db, session_key)
    if not user.admin:
        util.unauthorized()
    return user


def validate_gateway_session(
        db: Session,
        gateway_session_key: str,
        user: model.User) -> model.UserSession:
    if not gateway_session_key:
        util.unauthorized()
    session = crud.fetch_gateway_session_by_token(db, gateway_session_key)
    if session is None or session.user_id != user.id:
        util.unauthorized()
    return session


# RESERVATION
def resolve_time_range(
        date: date, time_range: str) -> Tuple[datetime, datetime]:
    #  TODO: impl
    time_range = model.TimeRange[time_range]
    return time_range.to_datetimes(date)


def check_reservation_duplicate(
        db: Session,
        playground_id: int,
        date: date,
        time_range: model.TimeRange):
    if len(
        crud.fetch_reservations_by_time(
            db,
            playground_id,
            date,
            time_range)):
        raise HTTPException(status_code=404, detail="Already reserved.")


def check_user_reservation_limit(
        db: Session,
        user: model.User,
        today: date):

    all_count, simul_count = get_users_reservation_count(db, user, today)

    if all_count >= user.plan.monthly_limit:
        raise HTTPException(
            403,
            "月の利用可能数が上限に達しているため予約できません。 (limit: %d, count: %d)" %
            (user.plan.monthly_limit, all_count))

    if simul_count >= user.plan.simul_limit:
        raise HTTPException(
            403,
            "同時予約可能数が上限に達しているため予約できません。 (limit: %d, count: %d)" %
            (user.plan.simul_limit, simul_count))


def get_users_reservation_count(
        db: Session,
        user: model.User,
        today: date):
    month_start_day = date(today.year, today.month, 1)
    month_end_day = date(today.year,
                         today.month,
                         util.month_last_day(today.year, today.month))
    all_count = calculate_reservation_counts(crud.fetch_all_user_reservations(
        db, user, month_start_day, month_end_day
    ))
    simul_count = calculate_reservation_counts(
        crud.fetch_all_user_reservations(
            db, user, today, month_end_day))
    return all_count, simul_count


def calculate_reservation_counts(reservations: List[model.Reservation]):
    def calculate(reservation):
        if reservation.time_range == model.TimeRange.NIGHT:
            return 2
        return 1

    return sum([calculate(reservation) for reservation in reservations])


def get_user_reservations(
        db: Session,
        user: model.User) -> List[schema.ReservationResponse]:
    reservations = crud.fetch_user_reservations(db, user.id)
    return [build_reservation_response(r) for r in reservations]


def get_user_active_reservation(
        db: Session,
        user: model.User) -> schema.ReservationResponse:
    reservation = crud.fetch_user_active_reservation(db, user.id, util.now())
    if reservation is None:
        return None
    return build_reservation_response(reservation)


def build_reservation_response(
        r: model.Reservation) -> schema.ReservationResponse:
    r_dict = r.__dict__
    r_dict["gateway_sessions"] = {
        gateway_session.gateway.type: gateway_session
        for gateway_session in r_dict["gateway_sessions"]}
    logger.info("r_dict" + str(r_dict))
    return schema.ReservationResponse(**r_dict)


# KEY
def unlock_gateway(db: Session, gateway_session: model.GatewaySession):
    logger.info("Gateway unlocked!! (gateway_id: %d)" %
                gateway_session.gateway_id)
    # TODO


def lock_gateway(db: Session, gateway_session: model.GatewaySession):
    logger.info("Gateway locked!! (gateway_id: %d)" %
                gateway_session.gateway_id)
    # TODO


def get_gateway_status(gateway_session: model.GatewaySession):
    # TODO: wip
    if gateway_session.gateway.type == model.GatewayType.ENTRANCE:
        return model.DoorStatus.UNLOCKED
    else:
        return model.DoorStatus.UNLOCKED
