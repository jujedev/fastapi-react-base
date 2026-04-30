# 🧱 fastapi-react-base

Template base con autenticación JWT lista para usar.
Stack: FastAPI + SQLModel + PostgreSQL | React + Vite + Material UI (Mantis)

## Estructura

```
├── backend/
│   ├── core/
│   │   ├── config.py          # Settings + variables JWT
│   │   ├── database.py        # Engine + sesión
│   │   ├── security.py        # Hash passwords + JWT tokens
│   │   └── dependencies.py    # get_current_user, require_admin
│   ├── models/
│   │   └── usuario.py         # Modelo Usuario con roles
│   ├── api/
│   │   └── auth.py            # /login /refresh /me /register
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── api/client.js              # Axios + interceptores
        ├── contexts/AuthContext.jsx   # Estado global del usuario
        ├── routes/
        │   ├── ProtectedRoute.jsx
        │   └── LoginRoutes.jsx
        └── sections/auth/
            └── AuthLogin.jsx
```

## Inicio rápido

### 1. Clonar y configurar

```bash
# Copiar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.development

# Editar backend/.env con tus valores
APP_NAME="Nombre de tu app"
DATABASE_URL=postgresql://postgres:tu_pass@localhost:5432/nombre_db
JWT_SECRET_KEY=         # python -c "import secrets; print(secrets.token_hex(32))"
JWT_REFRESH_SECRET_KEY= # python -c "import secrets; print(secrets.token_hex(32))"
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

### 3. Frontend

```bash
cd frontend
yarn install
yarn dev
```

### 4. Crear el primer usuario admin

```
POST http://localhost:8000/auth/register
{
  "email": "admin@miapp.com",
  "nombre": "Administrador",
  "password": "tu-password",
  "rol": "admin"
}
```

⚠️ Una vez creado el primer admin, proteger `/auth/register` con `require_admin` en `backend/api/auth.py`.

## Checklist para un proyecto nuevo

- [ ] Cambiar `APP_NAME` en `.env`
- [ ] Cambiar `DATABASE_URL` con el nombre de la nueva DB
- [ ] Generar nuevos `JWT_SECRET_KEY` y `JWT_REFRESH_SECRET_KEY`
- [ ] Agregar modelos del proyecto en `backend/models/`
- [ ] Registrar modelos en `backend/core/database.py`
- [ ] Agregar routers en `backend/main.py`
- [ ] Cambiar `POST_LOGIN_ROUTE` en `AuthLogin.jsx` si la ruta inicial no es `/dashboard`
- [ ] Crear el primer usuario admin desde Swagger (`/docs`)
- [ ] Proteger `/auth/register` con `require_admin` antes de producción

## Endpoints de auth

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login con email y password |
| POST | `/auth/refresh` | No | Renovar access token |
| GET | `/auth/me` | Sí | Usuario actual |
| POST | `/auth/register` | No* | Crear usuario |

*Proteger con `require_admin` en producción

## Roles disponibles

| Rol | Descripción |
|-----|-------------|
| `admin` | Acceso total |
| `cajero` | Acceso básico |

Para agregar roles: editar `RolUsuario` en `backend/models/usuario.py`

## Dependencia crítica

```
bcrypt==4.0.1  ← NO actualizar, versiones superiores rompen passlib
```