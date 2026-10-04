# ⭐ Store Rating Platform

A full-stack **role-based store rating platform** where users can discover stores and submit ratings from **1 to 5 stars**, administrators can manage users and stores, and store owners can monitor ratings and see who rated their store.

Built with **React, Express.js, PostgreSQL, JWT authentication, and Zod validation**.

---

## 🚀 Features

### 👨‍💼 Administrator

- 📊 Dashboard with total users, stores, and ratings
- 👤 Create users with different roles
- 🏪 Add and manage stores
- 🔎 Search and filter users and stores
- ↕️ Sort data by supported fields
- 👀 View detailed user information
- ⭐ View store ratings associated with store owners

### 👤 Normal User

- 📝 Sign up and log in
- 🔍 Search stores by name or address
- ⭐ Submit a rating from 1–5
- ✏️ Modify an existing rating
- 📊 View overall store rating
- 👤 View their own rating
- 🔐 Change password
- 🚪 Secure logout

### 🏪 Store Owner

- 🔐 Secure login
- 📊 View average store rating
- ⭐ View rating statistics
- 👥 See users who rated their store
- 🔐 Change password
- 🚪 Secure logout

### 🌐 Public

- Landing page for signed-out visitors
- Common authentication flow for all roles
- Role-based redirection after login

---

## 🛠️ Tech Stack

### Frontend

- **React**
- **Vite**
- JavaScript
- Responsive UI

### Backend

- **Node.js**
- **Express.js**
- RESTful APIs
- JWT Authentication
- bcrypt Password Hashing
- Zod Validation

### Database

- **PostgreSQL**
- `pg` Node.js PostgreSQL client
- Relational data modeling
- Foreign keys and unique constraints

### Development

- npm
- Nodemon
- Git & GitHub

---

## 🏗️ Architecture

```text
┌─────────────────────────────┐
│          React UI           │
│        Vite Frontend        │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│       Express.js API        │
│                             │
│  Authentication Middleware  │
│  Role-Based Authorization   │
│  Zod Validation             │
│  Business Logic             │
└──────────────┬──────────────┘
               │
               │ pg
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│                             │
│ Users │ Stores │ Ratings    │
└─────────────────────────────┘
```

---

## 🔐 Authentication & Authorization

The application uses **JWT-based authentication**.

Each authenticated request is associated with a user and role.

Supported roles:

```text
ADMIN
USER
OWNER
```

Server-side middleware ensures that users can only access endpoints authorized for their role.

For example:

```text
ADMIN  → Admin Dashboard
USER   → Store Listing & Ratings
OWNER  → Store Analytics
```

Passwords are securely hashed using **bcrypt** and are never stored as plain text.

---

## ⭐ Rating System

Users can rate a store from **1 to 5 stars**.

Each user can have only **one rating per store**.

The database enforces this using:

```sql
UNIQUE (user_id, store_id)
```

If a user submits another rating for the same store, the existing rating is updated instead of creating a duplicate.

Example:

```text
User A → Store X → ⭐⭐⭐⭐⭐
```

If User A changes the rating:

```text
User A → Store X → ⭐⭐⭐⭐
```

The original rating is updated.

---

## ✅ Validation Rules

Validation is implemented on both the **frontend and backend**.

| Field | Rule |
|---|---|
| Name | 20–60 characters |
| Address | Maximum 400 characters |
| Password | 8–16 characters |
| Password | At least 1 uppercase letter |
| Password | At least 1 special character |
| Email | Valid email format |
| Rating | Integer between 1–5 |
| Store Name | 1–100 characters |

> The 20–60 character name rule applies to users. Store names use a separate 1–100 character rule.

Backend validation is handled using **Zod**.

---

## 🔎 Search, Filtering & Sorting

List endpoints support:

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
GET /api/admin/users?name=rahul&role=USER&sortBy=name&order=asc
```

Database queries use parameterized values and whitelisted sort fields to reduce the risk of SQL injection.

---

## 📡 API Endpoints

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
| GET | `/api/admin/users` | Admin |
| POST | `/api/admin/users` | Admin |
| GET | `/api/admin/users/:id` | Admin |
| GET | `/api/admin/stores` | Admin |
| POST | `/api/admin/stores` | Admin |
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

---

## 📁 Project Structure

```text
store-rating-platform/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── db/
│   │   └── server.js
│   │
│   ├── scripts/
│   │   ├── initDb.js
│   │   └── seed.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

> Folder names may vary slightly depending on the current implementation.

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure you have installed:

- **Node.js 18+**
- **PostgreSQL**
- **npm**
- **Git**

---

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

---

# 🗄️ Backend Setup

Open a terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 2. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

On Windows PowerShell, you can also simply create a `.env` file manually.

Configure:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/store_ratings
JWT_SECRET=your_secure_jwt_secret
PORT=4000
```

> Never commit your `.env` file to GitHub.

---

## 3. Create the Database

Create a PostgreSQL database:

```bash
createdb store_ratings
```

Or create it through **pgAdmin** / PostgreSQL tools.

---

## 4. Initialize & Seed the Database

Run:

```bash
npm run db:setup
```

This will:

1. Create the required tables
2. Configure database constraints
3. Insert sample data

---

## 5. Start the Backend

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:4000
```

---

# 💻 Frontend Setup

Open a **second terminal**:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

The frontend proxies API requests to the backend.

---

# 🔑 Demo Accounts

The seed script provides the following demo accounts:

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@example.com` | `Admin@1234` |
| Store Owner | `owner@example.com` | `Owner@1234` |
| Normal User | `user@example.com` | `User@1234` |

⚠️ **These credentials are for development/demo purposes only. Change or remove them before deploying the application publicly.**

---

# 🔒 Security Considerations

The project includes several security measures:

- JWT-based authentication
- bcrypt password hashing
- Role-based authorization
- Zod request validation
- Parameterized SQL queries
- Whitelisted sorting fields
- Protected API routes
- Environment variables for secrets
- Unique database constraints

For production deployment, additional measures should be considered, including:

- HTTPS
- Secure cookie configuration
- Rate limiting
- CORS restrictions
- Strong production secrets
- Refresh-token strategy
- Security headers
- Centralized error handling
- Database connection pooling

---

# 🧪 Example User Flow

### Normal User

```text
Sign Up
   ↓
Login
   ↓
Browse Stores
   ↓
Search / Sort
   ↓
Open Store
   ↓
Submit Rating ⭐
   ↓
Modify Rating if needed
```

### Store Owner

```text
Login
   ↓
Owner Dashboard
   ↓
View Average Rating
   ↓
View Rating Distribution
   ↓
View Users Who Rated
```

### Administrator

```text
Login
   ↓
Admin Dashboard
   ↓
View Statistics
   ↓
Manage Users
   ↓
Manage Stores
   ↓
View User Details
```

---

# 📌 Design Decisions

### One Rating Per User & Store

The `ratings` table uses:

```sql
UNIQUE (user_id, store_id)
```

This prevents duplicate ratings.

### Server-Side Authorization

Role restrictions are enforced on the backend rather than relying only on frontend route protection.

### Parameterized Queries

User-provided filter values are parameterized before being sent to PostgreSQL.

### Whitelisted Sorting

Only approved database columns can be used for sorting, preventing arbitrary SQL fragments from being injected through `sortBy`.

### Signup Restrictions

Public signup always creates a **normal user**.

Only administrators can create:

- Administrators
- Store Owners

This prevents users from granting themselves elevated privileges.

---

# 📈 Future Improvements

Potential enhancements for future versions:

- 📊 Advanced rating analytics
- 📧 Email notifications
- 🔔 In-app notifications
- 🌙 Dark mode
- 📱 Improved mobile experience
- 🖼️ Store images and profiles
- 📍 Location-based store discovery
- ⭐ Rating distribution charts
- 🧾 Export reports as CSV/PDF
- 🔄 Refresh-token authentication
- 🚀 Production deployment with CI/CD

---

# 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Full-stack web development
- REST API design
- JWT authentication
- Role-Based Access Control (RBAC)
- PostgreSQL relational database design
- SQL queries and constraints
- React application development
- API integration
- Input validation
- Password security
- Search, filtering and sorting
- Git and GitHub workflow

---

## 👨‍💻 Author

**Aryan Raj**

B.Tech — Computer Science & Engineering (AI & ML)

Built as a full-stack role-based store rating platform using **React + Express + PostgreSQL**.

---

## ⭐ If You Like This Project

If this project helped you or you found it useful, consider giving the repository a ⭐ on GitHub.
