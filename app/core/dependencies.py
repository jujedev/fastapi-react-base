from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from .database import get_session
from .security import decode_access_token
from models.usuario import Usuario, RolUsuario

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Tipos reutilizables
SessionDep = Annotated[Session, Depends(get_session)]


def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: SessionDep = None,
) -> Usuario:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    usuario = session.get(Usuario, int(user_id))
    if usuario is None or not usuario.activo:
        raise credentials_exception

    return usuario


CurrentUser = Annotated[Usuario, Depends(get_current_user)]


# ── Control de roles ──────────────────────────────────────

def require_rol(*roles: RolUsuario):
    """
    Factory de dependencia para restringir acceso por rol.

    Uso en un router:
        @router.delete("/{id}")
        def eliminar(id: int, _=Depends(require_rol(RolUsuario.ADMIN))):
            ...

        @router.get("/reporte")
        def reporte(_=Depends(require_rol(RolUsuario.ADMIN, RolUsuario.USER))):
            ...
    """
    def checker(current_user: CurrentUser) -> Usuario:
        if current_user.rol not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Roles requeridos: {[r.value for r in roles]}",
            )
        return current_user
    return checker