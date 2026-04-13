# 🚀 TaskFlow

## 1. Overview

TaskFlow is a full-stack task management application that allows users to manage projects and tasks efficiently. Users can create projects, add tasks, assign priorities, and track progress through different statuses.

### Tech Stack

* **Frontend:** React + TypeScript + Vite
* **Backend:** Django + Django REST Framework (DRF)
* **Database:** PostgreSQL
* **DevOps:** Docker & Docker Compose

---

## 2. Architecture Decisions

### Monorepo Structure

The project uses a **monorepo structure**:

```
backend/   → Django API
frontend/  → React app
```

This simplifies development, deployment, and onboarding.

---

### Dockerized Setup

Docker Compose is used to orchestrate:

* PostgreSQL database
* Django backend
* React frontend

👉 This ensures consistent environments across machines.

---

### Backend Design

* Django REST Framework for API development
* JWT-based authentication for stateless sessions
* PostgreSQL for relational data integrity

---

### Frontend Design

* React with TypeScript for type safety
* Vite for fast builds and development
* Axios for API communication

---

### Tradeoffs

* ❌ No advanced state management (Redux/Zustand)
  → Kept simple using React state/hooks

* ❌ No role-based access control
  → Focused on core task functionality

* ❌ Limited validation & error handling
  → Prioritized core feature delivery

* ❌ No CI/CD pipeline
  → Out of scope for initial implementation

---

## 3. Running Locally

> Assumes only Docker is installed

```bash
git clone https://github.com/<your-username>/taskflow-rajesh-kumar.git
cd taskflow-rajesh-kumar

cp .env.example .env

docker compose up -d
```

### 🌐 Access the app

* Application → http://localhost:3000

---

## 4. Running Migrations

Migrations run automatically on container startup.

If needed manually:

```bash
docker compose exec backend python manage.py migrate
```

---

## 5. Test Credentials

Use the following credentials to log in:

```
Email:    test@example.com
Password: 123456
```

---

## 6. API Reference

### 🔐 Auth

#### POST /auth/login/

Request:

```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "access": "jwt_token",
  "refresh": "refresh_token"
}
```

---

### 📁 Projects

#### GET /projects/

Returns all projects for the user.

---

#### POST /projects/

```json
{
  "name": "My Project"
}
```

---

### ✅ Tasks

#### GET /tasks/

Returns all tasks.

---

#### POST /tasks/

```json
{
  "title": "New Task",
  "status": "todo",
  "priority": "medium",
  "project": 1
}
```

---

#### PATCH /tasks/{id}/

```json
{
  "status": "done"
}
```

---

#### DELETE /tasks/{id}/

Deletes a task.

---

## 7. What I'd Do With More Time

If given more time, I would improve the project in the following ways:

### 🔧 Backend

* Add role-based access control (RBAC)
* Improve validation and error handling
* Add pagination and filtering at API level
* Write unit and integration tests

---

### 🎨 Frontend

* Add global state management (Zustand/Redux)
* Improve UI/UX with better design system
* Add loading states and error boundaries

---

### 🚀 DevOps

* Add CI/CD pipeline (GitHub Actions)
* Use environment-specific configs (dev/prod)
* Deploy to cloud (AWS / Vercel / Render)

---

### 📊 Features

* Real-time updates (WebSockets)
* Notifications system
* Search and advanced filtering

---

## 👨‍💻 Author

Rajesh Kumar
