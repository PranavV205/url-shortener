# URL Shortener

I’m building this project to explore how a simple system like a URL shortener can be designed and implemented from scratch. The goal isn’t just to make something that works, but to think about backend architecture, system design and real deployment while building it.

This repository is a monorepo containing both the backend and frontend.

## Tech Stack

**Backend**

* Node.js
* Express
* PostgreSQL

**Frontend**

* Next.js
* Tailwind CSS

**Infrastructure**

* VPS for backend + database
* Vercel for frontend deployment

## Project Structure

```
url-shortener
│
├── backend
│   ├── src
│   └── package.json
│
├── frontend
│   ├── src
│   └── package.json
│
└── README.md
```

## Why I'm Building This

A URL shortener seems simple, but it touches several interesting backend concepts:

* designing a clean API
* authentication
* database schema design
* fast lookup for redirects
* deployment and infrastructure
* thinking about scalability

This project is mainly a learning exercise in backend architecture.

## Planned Features (V1)

The first version will focus on the core functionality.

### Authentication

* User signup
* User login
* JWT-based authentication

### URL Management

* Create short URLs
* View all URLs created by the user
* Delete URLs

### Redirects

* Public endpoint for redirecting short URLs to their original destination

### Basic API Routes

```
POST   /signup
POST   /login
POST   /urls
GET    /:shortCode
GET    /urls
DELETE /urls/:id
```

## Running Locally

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Future Ideas

After the first version works, I’d like to experiment with additional features such as:

* click analytics
* custom aliases
* expiration for links
* rate limiting
* caching for faster redirects
* better short-code generation strategies

## Status

Currently in development.
