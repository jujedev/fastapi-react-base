from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─── Passwords ───────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── Tokens ──────────────────────────────────────────────────────────────────

def _create_token(data: dict, secret: str, expires_delta: timedelta) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + expires_delta
    return jwt.encode(payload, secret, algorithm=settings.JWT_ALGORITHM)


def create_access_token(user_id: int, email: str, rol: str) -> str:
    return _create_token(
        data={"sub": str(user_id), "email": email, "rol": rol},
        secret=settings.JWT_SECRET_KEY,
        expires_delta=timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(user_id: int) -> str:
    return _create_token(
        data={"sub": str(user_id), "type": "refresh"},
        secret=settings.JWT_REFRESH_SECRET_KEY,
        expires_delta=timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None


def decode_refresh_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, settings.JWT_REFRESH_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None