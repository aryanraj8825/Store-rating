# Storefront Ratings

Role-based store rating platform. Users rate stores from 1 to 5; admins manage users and stores; store owners see who rated their store.

**Stack:** Express.js, PostgreSQL (`pg`), React (Vite), JWT auth, zod validation.

## Setup

Requires Node 18+ and PostgreSQL.

```bash
createdb store_ratings

# Backend
cd backend
cp .env.example .env        # edit DATABASE_URL and JWT_SECRET
npm install
npm run db:setup            # creates tables and sample data
npm run dev                 # http://localhost:4000

# Frontend (second terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :4000)
```

## Sample logins (from the seed script)

| Role | Email | Password |
|---|---|---|
| Administrator | admin@example.com | Admin@1234 |
| Store owner | owner@example.com | Owner@1234 |
| Normal user | user@example.com | User@1234 |

Change or remove these before any real deployment.

## Features by role

- **Administrator:** dashboard with total users, stores and ratings; add users (any role) and stores; filterable, sortable lists of users and stores; user detail page (owners show their store rating).
- **Normal user:** sign up, log in, change password, search stores by name/address, sort, submit and modify a 1-5 rating, see overall and own rating.
- **Store owner:** log in, change password, see average rating and the list of users who rated their store.

All roles share one login page and can log out from the sidebar. Signed-out visitors see a public landing page at `/`.

## Validation (frontend and backend)

- Name: 20-60 characters
- Address: max 400 characters
- Password: 8-16 characters, at least one uppercase letter and one special character
- Email: standard format
- Rating: integer 1-5

Validation rules apply to users. Store names allow 1-100 characters since the brief's 20-60 rule is written for user names; change `storeSchema` in `backend/src/validators.js` if you want it applied to stores too.

## API summary

| Method | Path | Role |
|---|---|---|
| POST | /api/auth/signup, /api/auth/login | public |
| GET | /api/auth/me | any |
| PUT | /api/auth/password | any |
| GET | /api/admin/dashboard | admin |
| GET, POST | /api/admin/users | admin |
| GET | /api/admin/users/:id | admin |
| GET, POST | /api/admin/stores | admin |
| GET | /api/admin/owners | admin |
| GET | /api/stores | user |
| PUT | /api/stores/:id/rating | user |
| GET | /api/owner/dashboard | owner |

List endpoints accept filter query params (`name`, `email`, `address`, `role`) plus `sortBy` and `order=asc|desc`.

## Design notes

- One `ratings` row per user and store (`UNIQUE (user_id, store_id)`); editing a rating updates that row via upsert.
- Passwords are hashed with bcrypt; JWTs carry the user id and role; every route is role-checked on the server.
- Sort columns are whitelisted and filter values are parameterized, so listings are safe from SQL injection.
- The signup endpoint always creates a normal user; only admins can create admins and owners.
