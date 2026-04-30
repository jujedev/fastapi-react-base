from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel

from app.core.database import get_session
from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
)
from app.core.dependencies import get_current_user
from app.models.usuario import Usuario, UsuarioCreate, UsuarioRead

router = APIRouter(prefix="/auth", tags=["Auth"])


# ─── Schemas ─────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    accessToken: str        # camelCase — compatible con el frontend
    refreshToken: str
    usuario: UsuarioRead


class RefreshRequest(BaseModel):
    refreshToken: str


# ─── Endpoints ───────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, session: Session = Depends(get_session)):
    usuario = session.exec(
        select(Usuario).where(Usuario.email == data.email)
    ).first()

    if not usuario or not verify_password(data.password, usuario.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
        )

    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo. Contactá al administrador.",
        )

    return TokenResponse(
        accessToken=create_access_token(usuario.id, usuario.email, usuario.rol),
        refreshToken=create_refresh_token(usuario.id),
        usuario=UsuarioRead.model_validate(usuario),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, session: Session = Depends(get_session)):
    payload = decode_refresh_token(data.refreshToken)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
        )

    usuario = session.get(Usuario, int(payload["sub"]))
    if not usuario or not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        )

    return TokenResponse(
        accessToken=create_access_token(usuario.id, usuario.email, usuario.rol),
        refreshToken=create_refresh_token(usuario.id),
        usuario=UsuarioRead.model_validate(usuario),
    )


@router.get("/me", response_model=UsuarioRead)
def me(current_user: Usuario = Depends(get_current_user)):
    """Retorna el usuario autenticado actual."""
    return current_user


@router.post("/register", response_model=UsuarioRead, status_code=201)
def register(data: UsuarioCreate, session: Session = Depends(get_session)):
    """
    Registro de usuario.
    ⚠️ En producción proteger con require_admin una vez creado el primer admin.
    """
    existing = session.exec(
        select(Usuario).where(Usuario.email == data.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese email",
        )

    usuario = Usuario(
        email=data.email,
        nombre=data.nombre,
        rol=data.rol,
        hashed_password=hash_password(data.password),
    )
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario