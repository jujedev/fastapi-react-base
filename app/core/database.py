from sqlmodel import SQLModel, create_engine, Session
from app.core.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)


def create_db_and_tables():
    # Importar todos los modelos antes de crear tablas
    from app.models.usuario import Usuario  # noqa: F401
    # TODO: agregar los modelos del proyecto acá
    # from app.models.mi_modelo import MiModelo  # noqa: F401
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session