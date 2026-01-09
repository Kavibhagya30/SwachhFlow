from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse

# Credentials from user request
DB_USER = "postgres"
DB_PASS = "KaVi@2007&"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "swachhflow"

# URL encode the password to handle special characters like '@' and '&'
encoded_pass = urllib.parse.quote_plus(DB_PASS)

DATABASE_URL = f"postgresql://{DB_USER}:{encoded_pass}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
