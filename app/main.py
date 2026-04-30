from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import create_db_and_tables
from app.api.auth import router as auth_router

# TODO: importar los routers del proyecto
# from app.api import mi_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description=f"API REST — {settings.APP_NAME}",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Rutas públicas ───────────────────────────────────────────────────────────
app.include_router(auth_router)

# ─── Rutas del negocio ────────────────────────────────────────────────────────
# TODO: agregar los routers del proyecto
# app.include_router(mi_router.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": settings.APP_NAME, "docs": "/docs"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}