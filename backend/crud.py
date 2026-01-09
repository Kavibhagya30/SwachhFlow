from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def get_gvps(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.GVP).offset(skip).limit(limit).all()

def get_gvp(db: Session, gvp_id: int):
    return db.query(models.GVP).filter(models.GVP.gvp_id == gvp_id).first()

def create_gvp(db: Session, gvp: schemas.GVPCreate):
    db_gvp = models.GVP(**gvp.dict())
    db.add(db_gvp)
    db.commit()
    db.refresh(db_gvp)
    return db_gvp

def update_gvp_status(db: Session, gvp_id: int, status: str, critical_level: str = None):
    db_gvp = get_gvp(db, gvp_id)
    if db_gvp:
        db_gvp.status = status
        if critical_level:
            db_gvp.critical_level = critical_level
        db_gvp.last_updated = datetime.now()
        db.commit()
        db.refresh(db_gvp)
    return db_gvp

def create_alert(db: Session, alert: schemas.AlertCreate):
    db_alert = models.Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_driver_route(db: Session, mobile: str):
    # Find assignment for this driver
    assignment = db.query(models.TruckDriverAssignment).filter(
        models.TruckDriverAssignment.driver_mobile == mobile
    ).order_by(models.TruckDriverAssignment.assignment_time.desc()).first()
    
    if assignment:
        return assignment.route
    return None

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(**user.dict())
    db.add(db_user)
    db.commit()
    return db_user
