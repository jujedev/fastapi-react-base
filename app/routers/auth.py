from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from sqlmodel import select
from slowapi import Limiter
from slowapi.util import get_remote_address

from core.dependencies import CurrentUser, SessionDep
from core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from models.usuario import (
    ChangePasswordRequest,
    RolUsuario,
    Usuario,
    UsuarioCreate,
    UsuarioRead,
)

router = APIRouter(prefix="/auth", tags=["auth"])
limiter = Limiter(key_func=get_remote_address)


# ── Schemas ───────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    accessToken: str
    refreshToken: str
    usuario: UsuarioRead


class AccessTokenResponse(BaseModel):
    accessToken: str
    refreshToken: str


class RefreshRequest(BaseModel):
    refreshToken: str


# ── Login ─────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(
    request: Request,
    data: LoginRequest,
    session: SessionDep = None,
):
    usuario = session.exec(
        select(Usuario).where(Usuario.email == data.email)
    ).first()

    if not usuario or not verify_password(data.password, usuario.password_hash):
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


# ── Refresh (con token rotation) ──────────────────────────

@router.post("/refresh", response_model=AccessTokenResponse)
def refresh_token(
    data: RefreshRequest,
    session: SessionDep = None,
):
    payload = decode_refresh_token(data.refreshToken)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
        )

    usuario = session.get(Usuario, int(payload["sub"]))
    if not usuario or not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado o inactivo",
        )

    # Token rotation — se emiten ambos tokens nuevos,
    # el refresh anterior queda descartado en el cliente
    return AccessTokenResponse(
        accessToken=create_access_token(usuario.id, usuario.email, usuario.rol),
        refreshToken=create_refresh_token(usuario.id),
    )


# ── Me ────────────────────────────────────────────────────

@router.get("/me", response_model=UsuarioRead)
def get_me(current_user: CurrentUser):
    return current_user


# ── Setup (primer admin) ──────────────────────────────────

@router.post("/setup", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def setup_first_admin(
    data: UsuarioCreate,
    session: SessionDep = None,
):
    """
    Crea el primer usuario administrador.
    Se bloquea automáticamente si ya existe algún usuario.
    """
    existing = session.exec(select(Usuario)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="El sistema ya tiene usuarios. Usá el panel de administración.",
        )

    admin = Usuario(
        nombre=data.nombre,
        email=data.email,
        password_hash=hash_password(data.password),
        rol=RolUsuario.ADMIN,
        activo=True,
    )
    session.add(admin)
    session.commit()
    session.refresh(admin)
    return admin


# ── Change password ───────────────────────────────────────

@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: CurrentUser,
    session: SessionDep = None,
):
    if not verify_password(data.password_actual, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta",
        )

    current_user.password_hash = hash_password(data.password_nuevo)
    session.add(current_user)
    session.commit()
    return {"detail": "Contraseña actualizada correctamente"}