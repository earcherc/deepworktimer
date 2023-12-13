from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class RegistrationRequest(BaseModel):
    username: str
    email: str
    password: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str
