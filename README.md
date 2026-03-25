# URL Shortener

A full-stack URL shortener built to explore backend architecture, system design, and real deployment. This monorepo contains both the backend API and the frontend dashboard.

## Tech Stack

**Backend**

* Node.js + Express 5
* TypeScript
* PostgreSQL + Drizzle ORM
* JWT authentication
* bcrypt password hashing

**Frontend**

* Next.js 16 (App Router)
* React 19
* Tailwind CSS 4
* shadcn/ui components

**Infrastructure**

* Docker (PostgreSQL via Docker Compose)
* VPS for backend + database
* Vercel for frontend deployment

## Project Structure

```
url-shortener/
├── backend/
│   └── src/
│       ├── server.ts              # Express app entry point
│       ├── db/
│       │   ├── index.ts           # Database connection
│       │   └── schema.ts          # Drizzle schema (users, urls)
│       ├── routes/
│       │   ├── auth.ts            # Signup & login
│       │   ├── url.ts             # CRUD for short URLs
│       │   └── redirect.ts        # Public redirect endpoint
│       ├── middleware/
│       │   ├── auth.ts            # JWT verification
│       │   └── error.ts           # Global error handler + async wrapper
│       ├── utils/
│       │   ├── env.ts             # Startup env validation
│       │   ├── jwt.ts             # Token sign & verify
│       │   ├── password.ts        # Hash & compare
│       │   └── validate.ts        # Input validation
│       └── types/
│           └── express.d.ts       # Extended Request type
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # Landing page
│       │   ├── login/page.tsx     # Login form
│       │   ├── signup/page.tsx    # Signup form
│       │   └── dashboard/page.tsx # URL management dashboard
│       ├── components/ui/         # shadcn/ui components
│       └── lib/
│           ├── api.ts             # Backend API client
│           └── auth-context.tsx   # Auth state (JWT in localStorage)
└── README.md
```

## API Routes

```
POST   /api/auth/signup     # Create account
POST   /api/auth/login      # Authenticate
POST   /api/urls             # Create short URL         (auth required)
GET    /api/urls             # List user's URLs          (auth required)
DELETE /api/urls/:id         # Delete a URL              (auth required)
GET    /:shortCode           # Redirect to original URL  (public)
```

## Features

### Authentication
* Signup and login with email/password
* JWT-based authentication (7-day expiry)
* bcrypt password hashing
* Timing-safe login to prevent user enumeration

### URL Management
* Create short URLs with 8-character nanoid codes
* Collision-resistant code generation with retry logic
* View all URLs with click counts
* Delete URLs with confirmation dialog
* Copy short URL to clipboard

### Redirects
* Public 302 redirect from short code to original URL
* Atomic click counter (no race conditions)

### Error Handling
* Global error handler for unhandled exceptions
* Async route wrapper to catch rejected promises
* Input validation on both frontend and backend
* Startup environment variable validation

### Database
* Users table with unique emails
* URLs table with foreign key to users (cascade delete)
* Unique constraint on short codes

## Running Locally

### Prerequisites

* Node.js 20+
* Docker

### 1. Start the database

```bash
cd backend
docker compose up -d
```

### 2. Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in: PORT, JWT_SECRET, CORS_ORIGIN, DATABASE_URL

# Frontend
cp frontend/.env.example frontend/.env
# Fill in: NEXT_PUBLIC_API_URL
```

### 3. Push the database schema

```bash
cd backend
npm install
npm run db:push
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:4000` and the frontend on `http://localhost:3000`.

## Why I Built This

A URL shortener seems simple, but it touches several interesting backend concepts:

* Designing a clean REST API
* Authentication and authorization
* Database schema design with foreign keys and constraints
* Atomic operations and concurrency handling
* Input validation and error handling
* Frontend-backend integration

This project is a learning exercise in full-stack architecture.

## Future Ideas

* Click analytics (referrer, geo, browser)
* Custom aliases for short URLs
* Link expiration
* Rate limiting
* Redis caching for fast redirects
* CI/CD pipeline

## Status

V1 complete. Core functionality is working.
