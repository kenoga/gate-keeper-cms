from pydantic import BaseModel


class LoginRequest(BaseModel):
    user_id: int
    password: str 

