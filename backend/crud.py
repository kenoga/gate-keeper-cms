from sqlalchemy.orm import Session

from . import model


def get_first_user(db: Session):
    return db.query(model.User).first()

