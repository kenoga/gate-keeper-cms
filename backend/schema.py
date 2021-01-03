from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class SuccessResponse(BaseModel):
    message: str


def success() -> SuccessResponse:
    return SuccessResponse(message="success!")
