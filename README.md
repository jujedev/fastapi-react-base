# 🚀 fastapi-react-base

Template base reutilizable con autenticación JWT completa, lista para extender con lógica de negocio.

---

## 🛠️ Stack

| Capa          | Tecnología                       |
| ------------- | -------------------------------- |
| Backend       | Python 3.11 + FastAPI            |
| ORM           | SQLModel (SQLAlchemy + Pydantic) |
| Base de datos | PostgreSQL 16                    |
| Migraciones   | Alembic                          |
| Autenticación | JWT (access + refresh token)     |
| Rate limiting | SlowAPI                          |
| Frontend      | React + Vite + Material UI       |
| Servidor web  | Nginx                            |
| Contenedores  | Docker + Docker Compose          |

---

## 📁 Estructura

```
fastapi-react-base/
├── app/
│   ├── core/
│   │   ├── config.py           # Settings con Pydantic BaseSettings
│   │   ├── database.py         # Sesión SQLModel / PostgreSQL
│   │   ├── dependencies.py     # get_session, get_current_user, require_admin
│   │   └── security.py         # JWT, hashing de passwords
│   ├── models/
│   │   └── usuario.py          # Usuario con roles ADMIN / USER
│   ├── routers/
│   │   └── auth.py             # login, refresh, me, setup, change-password
│   ├── alembic/                # Migraciones
│   ├── main.py                 # CORS, rate limiter, lifespan, routers
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Axios + interceptores JWT automáticos
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   └── auth/
│   │   │       └── Login.jsx
│   │   ├── routes/
│   │   │   ├── MainRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── menu-items/
│   │   │   └── index.js        # Estructura de menú lateral vacía
│   │   ├── Layout.jsx          # Drawer + AppBar + notificaciones
│   │   └── App.jsx
│   ├── .env.development.example
│   └── package.json
├── docker/
│   ├── backend/Dockerfile
│   ├── frontend/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   ├── docker-compose.yml      # Producción
│   └── docker-compose.dev.yml  # Solo DB en Docker
├── docker-compose.yml          # Raíz — apunta al de docker/
└── deploy.sh
```

---

## ⚙️ Setup local

### Backend

```bash
cd app
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
.\.venv\Scripts\activate         # Windows

pip install -r requirements.txt

cp .env.example .env
# Editar .env con tus valores

# Correr migraciones
alembic upgrade head

uvicorn main:app --reload
```

API: `http://localhost:8000`  
Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
cp .env.development.example .env.development
npm run dev
```

Frontend: `http://localhost:3000`

### Solo la DB en Docker (recomendado)

```bash
docker compose -f docker/docker-compose.dev.yml up -d
```

---

## 🔑 Variables de entorno

### Backend (`app/.env`)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=app_db

JWT_SECRET_KEY=cambia_esta_clave_secreta_larga
JWT_REFRESH_SECRET_KEY=otra_clave_secreta_larga
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

APP_NAME=Mi App
DEBUG=True
```

### Frontend (`frontend/.env.development`)

```env
VITE_API_URL=http://localhost:8000
VITE_APP_BASE_NAME=/
```

---

## 🚀 Deploy con Docker

```bash
cp app/.env.example app/.env
# Editar app/.env con valores de producción

docker compose up -d --build
docker compose logs -f
```

---

## 🔒 Autenticación

- **Access token** — 60 min, enviado en cada request como `Bearer`
- **Refresh token** — 7 días, renueva el access token automáticamente
- El interceptor de Axios maneja el refresh transparentemente

### Endpoints disponibles

| Método | Ruta                        | Descripción                        |
| ------ | --------------------------- | ---------------------------------- |
| POST   | `/auth/login`               | Login con usuario y contraseña     |
| POST   | `/auth/refresh`             | Renovar access token               |
| GET    | `/auth/me`                  | Datos del usuario autenticado      |
| POST   | `/auth/setup`               | Crear primer admin (solo si DB vacía) |
| PUT    | `/auth/change-password`     | Cambiar contraseña propia          |

---

## 👥 Roles

| Rol     | Descripción                    |
| ------- | ------------------------------ |
| `ADMIN` | Acceso total                   |
| `USER`  | Acceso estándar                |

Extendible en `models/usuario.py` → enum `RolUsuario`.

---

## 📌 Cómo extender el template

1. Agregar modelos en `app/models/`
2. Agregar routers en `app/routers/` e incluirlos en `main.py`
3. Crear migración: `alembic revision --autogenerate -m "descripcion"`
4. Agregar páginas en `frontend/src/pages/`
5. Agregar items al menú en `frontend/src/menu-items/index.js`
