import datetime
import logging
from . import crud

from sqlalchemy.orm import Session
    

logger = logging.getLogger(__name__)

def get_date_calendar(db: Session, playground_id: int, date: datetime.date):
    reservations = crud.fetch_date_reservation(db, playground_id, date)
    # 現状はRESERVEDのみが有効なもの
    reservations = [r for r in reservations if r.status == 'RESERVED']
    logger.info(reservations)
    
    d = {}
    for r in reservations:
        d[r.time_range] = r.user_id
    return d
         