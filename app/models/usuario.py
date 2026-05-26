from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class RolUsuario(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"
    # Agrega más roles según tu dominio


class UsuarioBase(SQLModel):
    nombre: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    rol: RolUsuario = Field(default=RolUsuario.USER)
    activo: bool = Field(default=True)


class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str


# ── Schemas ───────────────────────────────────────────────

class UsuarioCreate(SQLModel):
    nombre: str
    email: str
    password: str
    rol: RolUsuario = RolUsuario.USER


class UsuarioRead(UsuarioBase):
    id: int


class UsuarioUpdate(SQLModel):
    nombre: Optional[str] = None
    email: Optional[str] = None
    rol: Optional[RolUsuario] = None
    activo: Optional[bool] = None


class ChangePasswordRequest(SQLModel):
    password_actual: str
    password_nuevo: str