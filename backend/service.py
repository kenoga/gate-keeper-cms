import datetime
import logging
from . import crud
from . import model

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