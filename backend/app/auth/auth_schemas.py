from enum import Enum

from pydantic import BaseModel, EmailStr


class SocialProvider(str, Enum):
    GITHUB = "GITHUB"
    GOOGLE = "GOOGLE"
    FACEBOOK = "FACEBOOK"
    TWITTER = "TWITTER"
    LINKEDIN = "LINKEDIN"
    APPLE = "APPLE"
    MICROSOFT = "MICROSOFT"


class LoginRequest(BaseModel):
    username: str
    password: str


class SocialLoginRequest(BaseModel):
    access_token: str
    provider: SocialProvider


class RegistrationRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class EmailVerificationRequest(BaseModel):
    token: str


class ResendVerificationEmailRequest(BaseModel):
    email: EmailStr
