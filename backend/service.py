from typing import Optional, Any, NoReturn, Tuple, List
import datetime
import logging
from . import crud
from . import model
from . import util
from . import schema

from collections import defaultdict

from sqlalchemy.orm import Session
    

logger = logging.getLogger(__name__)

def get_date_calendar(db: Session, playground_id: int, date: datetime.date):
    reservations = crud.fetch_date_reservation(db, playground_id, date)
    # 現状はRESERVEDのみが有効なもの
    reservations = [r for r in reservations if r.status == model.ReservationStatus.RESERVED]
    d = {}
    for r in reservations:
        d[r.time_range.name] = r.user_id
    return d
         
def get_calendar(db: Session, playground_id: int, start_date: datetime.date, end_date: datetime.date):
    reservations = crud.fetch_reservations_by_date_range(db, playground_id, start_date, end_date)
    reservations = [r for r in reservations if r.status == model.ReservationStatus.RESERVED]
    
    d = defaultdict(dict)
    for r in reservations:
        d[r.date][r.time_range.name] = r.user_id
    return d


def auth(db: Session, session_key: Optional[Any]) -> NoReturn:
    if session_key is None:
        util.unauthorized()
    user = crud.fetch_user_by_session_token(db, session_key)
    if user is None:
        util.unauthorized()
    return user

def validate_gateway_session(db: Session, gateway_session_key: str, user: model.User) -> model.UserSession:
    if not gateway_session_key:
        util.unauthorized()
    session = crud.fetch_gateway_session_by_token(db, gateway_session_key)
    if session is None or session.user_id != user.id:
        util.unauthorized()
    return session

    
    
# RESERVATION
def resolve_time_range(date: datetime.date, time_range: model.TimeRange) -> Tuple[datetime.datetime, datetime.datetime]:
    #  TODO: impl
    return datetime.datetime.now(), datetime.datetime.now()
    
def get_user_reservations(db: Session, user: model.User) -> List[schema.ReservationResponse]: 
    return crud.fetch_user_reservations(db, user.id)

def get_user_active_reservation(db: Session, user: model.User) -> schema.ReservationResponse:
    return crud.fetch_user_active_reservation(db, user.id, util.now())
    
# KEY
def unlock_gateway(db: Session, gateway_session: model.GatewaySession):
    logger.info("Gateway unlocked!! (gateway_id: %d)" % gateway_session.gateway_id)
    pass

def lock_gateway(db: Session, gateway_session: model.GatewaySession):
    logger.info("Gateway locked!! (gateway_id: %d)" % gateway_session.gateway_id)
    # 紐づく
    pass

def get_gateway_status(gateway_session: model.GatewaySession):
    # TODO: wip
    if gateway_session.gateway.type == model.GatewayType.ENTRANCE:
        return model.EntranceStatus.AVAILABLE
    else:
        return model.DoorStatus.LOCKED 
    