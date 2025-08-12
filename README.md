# Admin Panel Project

Full-stack admin panel with **NestJS** (API), **React** (frontend) and **PostgreSQL**. Includes JWT auth (access + refresh), role-based authorization and Swagger docs.

## Assumptions

- Each user has a single role.
- Roles: **Admin**, **Editor**, **User**.
- Data types: **Users**, **Courses**, **Contents**.
- A Course can have multiple Contents.

### Permissions

**Admin**

| Table    | Read | Write | Update | Delete |
| -------- | ---- | ----- | ------ | ------ |
| Users    | ✓    | ✓     | ✓      | ✓      |
| Courses  | ✓    | ✓     | ✓      | ✓      |
| Contents | ✓    | ✓     | ✓      | ✓      |

**Editor**

| Table    | Read   | Write | Update | Delete |
| -------- | ------ | ----- | ------ | ------ |
| Users    | itself |       | itself |        |
| Courses  | ✓      | ✓     | ✓      |        |
| Contents | ✓      | ✓     | ✓      |        |

**User**

| Table    | Read   | Write | Update | Delete |
| -------- | ------ | ----- | ------ | ------ |
| Users    | itself |       | itself |        |
| Courses  | ✓      |       |        |        |
| Contents | ✓      |       |        |        |

---

## Tech Stack

- **Backend:** NestJS (TypeScript)
- **Frontend:** React
- **Database:** PostgreSQL
- **Testing:** Jest (unit), Postman (e2e)

---

## Features

- Swagger Documentation
- JWT auth (access + refresh)
- Role-based authorization
- Data filtering
- Fully responsive UI

---

## Quick Start (Docker)

1. **Copy environment variables**
```bash
cp .env.example .env
# Edit .env with your local values (DB and JWT)
```

2. **Run all services**
```bash
docker compose up --build -d
```

3. **URLs**
- Frontend: `http://localhost:3000`
- API base: `http://localhost:3000/api` *(or 5000 if backend runs separately)*
- Swagger: `http://localhost:3000/api/docs`

To stop and clean:
```bash
docker compose down --volumes --remove-orphans
```

---

## Environment Variables

Only commit `.env.example` (never the real `.env` with credentials).

`.env.example`:
```dotenv
# Environment
NODE_ENV=development

# Database configuration variables for the PostgreSQL container
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

# API database connection configuration
DATABASE_TYPE="postgres"
DATABASE_HOST="database"   # Docker service name
DATABASE_PORT=5432
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=

# JWT
JWT_SECRET=""
JWT_REFRESH_SECRET=""
```

> Ensure `.env` is in `.gitignore`.

---

## Authentication

On first run, the app seeds an admin user:

- **username:** `admin`
- **password:** `admin123`

> ⚠️ **Security:** Change these credentials immediately outside development.

---

## Running locally (without Docker)

### Backend

1. Install dependencies:
```bash
cd backend
yarn
```

2. Configure DB in `backend/.env`.

3. Start backend:
```bash
yarn start:dev
```

- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/api/docs`

### Frontend

```bash
cd frontend
yarn
yarn start
```

- Frontend: `http://localhost:3000`

---

## Testing

**Unit tests (backend)**
```bash
cd backend
yarn test
```

**e2e API tests**
1. Start backend locally:
```bash
cd backend
yarn
yarn start
```
2. Run tests:
```bash
yarn test:e2e
```
> Tests login with **admin/admin123** and create users `test` and `test2`. If you change these credentials or already have these users, tests will fail.

---

## Project Structure

- `backend/` – NestJS API (modules, controllers, services, guards).
- `frontend/` – React app (pages, components, hooks).
- `docker-compose.yml` – Services: database, backend, frontend.
- `.env.example` – Template for environment variables.

---

## Contributing

- Use **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, …).
- PRs into `master`/`main` only with green tests and passing build.
- Tag releases as `vX.Y.Z` and generate changelog (optional).

