# ⭐ Storefront Ratings

A full-stack, role-based store rating platform where users can discover stores and rate them from **1 to 5 stars**, store owners can view ratings and the users who submitted them, and administrators can add and view users and stores.

**Built with:** React (Vite), Express.js, PostgreSQL, JWT Authentication, Zod, and bcryptjs.

<!--
Add screenshots here once you have them:

## 📸 Screenshots
![Landing page](docs/landing.png)
![Store listing](docs/stores.png)
![Admin dashboard](docs/admin-dashboard.png)
-->

---

## 📋 Overview

Storefront Ratings provides different capabilities based on the user's role:

```text
                         ┌──────────────────────┐
                         │  Storefront Ratings  │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
        👨‍💼 Administrator      👤 Normal User       🏪 Store Owner
              │                     │                     │
        Add users             Discover stores       View ratings
        Add stores            Submit ratings        View raters
        View statistics       Modify ratings        View average
```

---

## 🚀 Features

### 👨‍💼 Administrator

- Dashboard showing total users, stores, and submitted ratings
- Create users with different roles:
  - Administrator
  - Store Owner
  - Normal User
- Create stores and optionally assign a store owner
- View users in a filterable and sortable list
- View stores in a filterable and sortable list
- View detailed information about a user
- Store owners' details include their store rating information
- Change password
- Logout

### 👤 Normal User

- Create an account
- Log in
- Search stores by name and address
- Sort the store listing
- View each store's overall rating
- View their own rating
- Submit a rating from **1 to 5 stars**
- Modify an existing rating
- Change password
- Logout

### 🏪 Store Owner

- Log in
- View the average rating of their store
- View the total number of ratings
- View the users who rated their store
- Sort the list of users who submitted ratings
- Change password
- Logout

### 🌐 Public

- Public landing page for signed-out visitors
- Shared login page for all roles
- Automatic role-based redirection after login

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router, CSS |
| Backend | Node.js, Express.js, REST API |
| Authentication | JWT, bcryptjs |
| Security | Helmet, CORS, express-rate-limit |
| Validation | Zod |
| Database | PostgreSQL, `pg` connection pool |
| Development | npm, Nodemon, Git, GitHub |

---

## 🏗️ Application Architecture

```text
┌─────────────────────────────────┐
│          React Frontend         │
│             Vite                │
│                                 │
│  Pages • Components • Auth      │
└───────────────┬─────────────────┘
                │
                │ REST API
                │ JSON + JWT
                ▼
┌─────────────────────────────────┐
│         Express.js API          │
│                                 │
│ Authentication Middleware       │
│ Role-Based Authorization        │
│ Zod Validation                  │
│ Route Handlers                  │
│ SQL Queries                     │
└───────────────┬─────────────────┘
                │
                │ pg Connection Pool
                ▼
┌─────────────────────────────────┐
│          PostgreSQL             │
│                                 │
│   Users │ Stores │ Ratings      │
└─────────────────────────────────┘
```

---

## 🔐 Authentication & Authorization

The application uses **JWT bearer-token authentication**.

JWTs contain the authenticated user's:

- User ID
- Role

The backend verifies authentication and role permissions before allowing access to protected routes.

### Role Access

| Role | Access |
|---|---|
| `ADMIN` | Dashboard, add and view users and stores |
| `USER` | Store listing and ratings |
| `OWNER` | Store-owner dashboard |

### Password Security

Passwords are hashed using **bcryptjs** and are never stored as plain text.

Public signup always creates a **normal user**. Users cannot register themselves as administrators or store owners.

Only administrators can create accounts with elevated roles.

---

## ⭐ Rating System

A normal user can submit a rating between **1 and 5 stars** for a store.

Each user can have only **one rating per store**.

This is enforced at the database level using:

```sql
UNIQUE (user_id, store_id)
```

If a user rates the same store again, the existing rating is updated rather than creating a duplicate record.

```text
First rating:

User A ──────► Store X ──────► ⭐⭐⭐⭐⭐

Updated rating:

User A ──────► Store X ──────► ⭐⭐⭐⭐
```

This ensures that store averages are calculated using distinct user ratings.

---

## ✅ Validation

Validation is performed on both the frontend and backend.

The backend remains the final source of truth.

| Field | Validation |
|---|---|
| User Name | 20–60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters |
| Password | At least one uppercase letter |
| Password | At least one special character |
| Email | Valid email format |
| Rating | Integer from 1–5 |
| Store Name | 1–100 characters |

The **20–60 character rule applies to user names**. Store names use a separate 1–100 character rule.

---

## 🔎 Search, Filtering & Sorting

The application supports filtering and sorting for list endpoints.

### Filters

```text
name
email
address
role
```

### Sorting

```text
sortBy
order=asc
order=desc
```

Example:

```http
GET /api/admin/users?name=sharma&role=USER&sortBy=name&order=asc
```

Filter values are parameterized and sorting fields are restricted to an allowed whitelist.

This helps protect database queries against SQL injection.

---

## 📡 REST API

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |
| PUT | `/api/auth/password` | Authenticated |

### Administrator

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/dashboard` | Admin |
| GET, POST | `/api/admin/users` | Admin |
| GET | `/api/admin/users/:id` | Admin |
| GET, POST | `/api/admin/stores` | Admin |
| GET | `/api/admin/owners` | Admin |

### Stores & Ratings

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/stores` | User |
| PUT | `/api/stores/:id/rating` | User |

### Store Owner

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/owner/dashboard` | Owner |

### Health Check

```http
GET /api/health
```

---

## 📁 Project Structure

```text
store-rating-app/
│
├── backend/
│   ├── schema.sql
│
│   ├── scripts/
│   │   ├── initDb.js
│   │   └── seed.js
│
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config.js
│   │   ├── db.js
│   │   ├── listing.js
│   │   ├── validators.js
│   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validate.js
│   │   │   └── error.js
│   │
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── admin.js
│   │       ├── stores.js
│   │       └── owner.js
│
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api.js
│       ├── auth.jsx
│       ├── hooks.js
│       ├── validators.js
│
│       ├── components/
│       │   ├── Layout
│       │   ├── DataTable
│       │   ├── Stars
│       │   ├── AuthShell
│       │   └── ...
│
│       └── pages/
│           ├── Landing
│           ├── Login
│           ├── Signup
│           ├── Admin*
│           ├── UserStores
│           └── OwnerDashboard
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

- Node.js **18+**
- PostgreSQL
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Create PostgreSQL Database

Create the database:

```bash
createdb store_ratings
```

Alternatively, create `store_ratings` using **pgAdmin** or another PostgreSQL client.

### 3. Configure Backend

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create your `.env` file using `.env.example`.

Example:

```env
PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/store_ratings
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:5173
```

### 4. Initialize Database

Run:

```bash
npm run db:setup
```

This initializes the database schema and inserts the sample data.

> ### ⚠️ Important
>
> `db:setup` drops and recreates the tables, so it erases any existing data. Use it only with a fresh or disposable database.

If you only want to insert the sample data without resetting the database:

```bash
npm run db:seed
```

### 5. Start Backend

```bash
npm run dev
```

Backend:

```text
http://localhost:4000
```

### 6. Start Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

During development, Vite proxies `/api` requests to the Express backend.

---

## 🔑 Demo Accounts

The database seed script creates the following accounts:

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@example.com` | `Admin@1234` |
| Store Owner | `owner@example.com` | `Owner@1234` |
| Normal User | `user@example.com` | `User@1234` |

> ⚠️ These credentials are intended for development and demonstration only. Change or remove them before any public deployment.

The seeded store owner is associated with **Corner Cafe**. A store owner's dashboard stays empty until an administrator assigns a store to that owner.

---

## 🔒 Security

### Implemented

- JWT authentication
- Server-side role-based authorization
- bcryptjs password hashing
- Zod request validation
- Request body size limits
- Parameterized SQL queries
- Whitelisted sorting columns
- Helmet security headers
- Rate limiting on signup and login
- CORS restricted to the configured frontend origin
- Centralized error handling
- PostgreSQL connection pooling
- Database foreign-key constraints
- Unique constraints
- Check constraints
- Secrets stored through environment variables

### Production Considerations

Before deploying publicly:

- Use HTTPS
- Generate a strong, unique `JWT_SECRET`
- Consider moving authentication tokens to `httpOnly` cookies
- Consider implementing refresh tokens
- Add automated tests
- Configure production database credentials
- Configure production CORS origins

> The current frontend stores the JWT in `localStorage`. This is convenient for development but has greater XSS exposure than an `httpOnly` cookie-based approach. Logout clears the token in the browser but does not invalidate it on the server.

---

## 🧪 User Flows

### 👤 Normal User

```text
Sign Up
   ↓
Login
   ↓
Browse Stores
   ↓
Search / Sort
   ↓
View Store Rating
   ↓
Submit 1–5 Star Rating
   ↓
Modify Rating Later
```

### 🏪 Store Owner

```text
Login
   ↓
Owner Dashboard
   ↓
View Average Rating
   ↓
View Rating Count
   ↓
View Users Who Rated
```

### 👨‍💼 Administrator

```text
Login
   ↓
Admin Dashboard
   ↓
View Platform Statistics
   ↓
Add Users
   ↓
Add Stores
   ↓
Filter / Sort Data
   ↓
View User Details
```

---

## 📌 Key Design Decisions

### One Rating Per User & Store

A database-level unique constraint prevents duplicate ratings:

```sql
UNIQUE (user_id, store_id)
```

### Server-Side Authorization

Frontend route protection improves the user experience, but it is **not trusted for security**.

Every protected API endpoint verifies the user's role on the server.

### Safe Filtering & Sorting

Filter values are parameterized and sorting columns are selected from a predefined whitelist.

### Restricted Public Signup

Public signup always creates a normal user.

Only administrators can create administrator and store-owner accounts.

### Shared Validation

Frontend validation provides immediate feedback, while backend validation remains authoritative.

---

## 📈 Future Improvements

Potential improvements for future versions:

- Edit and delete users and stores
- Rating distribution charts
- More detailed store-owner analytics
- Store detail pages with images
- Email notifications
- In-app notifications
- Refresh-token authentication
- CSV/PDF report exports
- Automated testing
- CI/CD pipeline
- Dark mode
- Location-based store discovery

---

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Full-stack development using React and Express
- REST API development
- PostgreSQL relational database design
- JWT authentication
- Role-Based Access Control (RBAC)
- Password hashing and security
- Zod-based input validation
- SQL queries and database constraints
- Search, filtering and sorting
- Frontend/backend API integration
- Git and GitHub workflow

---

## 👨‍💻 Author

**Aryan Raj**

B.Tech — Computer Science & Engineering (AI & ML)

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.
