from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field


class RolUsuario(str, Enum):
    ADMIN = "admin"
    CAJERO = "cajero"
    # TODO: agregar roles según el proyecto
    # SUPERVISOR = "supervisor"


class UsuarioBase(SQLModel):
    email: str = Field(unique=True, index=True, max_length=255)
    nombre: str = Field(max_length=100)
    rol: RolUsuario = Field(default=RolUsuario.CAJERO)
    activo: bool = Field(default=True)


class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str


class UsuarioCreate(SQLModel):
    email: str
    nombre: str
    password: str
    rol: RolUsuario = RolUsuario.CAJERO


class UsuarioRead(SQLModel):
    id: int
    email: str
    nombre: str
    rol: RolUsuario
    activo: bool

    class Config:
        from_attributes = True