from fastapi import FastAPI
from .database import Base
from .crud import get_first_user

from .database import SessionLocal, engine

app = FastAPI()

@app.get("/")
async def root():
    
    return {"message": "Hello World"}

@app.get("/test/{id}")
def test(id: int = None):
    return { "message": "test", "id": id }

@app.get("/db")
def db():
    session = SessionLocal()
    user = get_first_user(session)
    return { "user": user } 
    