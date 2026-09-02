# AGB Tech Backend

REST API powering **AGB Tech**, a full-stack MERN e-commerce application.

The backend is built with **Node.js, Express and MongoDB**, providing the server-side functionality required for user accounts, product management, shopping carts, reviews and account-related email flows.

It forms the backend half of the wider **AGB Tech MERN application**, with the accompanying React frontend maintained separately in `AGB-Tech-Frontend`.

## Features

### Authentication

The API provides a complete authentication flow including:

* user registration
* login
* logout
* access-token refresh
* authenticated user retrieval
* email verification
* password reset

Passwords are hashed using **bcrypt** before storage.

Authentication uses **JSON Web Tokens (JWT)** with separate access and refresh tokens.

Access tokens are short-lived, while refresh tokens can be stored in secure HTTP-only cookies and exchanged for new access tokens.

### Authorisation

Protected routes use authentication middleware to verify JWTs before allowing access.

The application also implements **role-based authorisation**.

Administrative product operations require an authenticated user with the appropriate admin role, separating public product browsing from protected catalogue management.

## Product Catalogue

The product API supports catalogue management and discovery.

Functionality includes:

* retrieving products
* creating products
* updating products
* deleting products
* retrieving available brands
* retrieving available categories
* filtering by brand
* filtering by category
* product search

Product creation, modification and deletion are restricted to authorised administrators.

Public users can browse and search the catalogue without requiring authentication.

## Product Search

The API includes search functionality across product information including:

* title
* category
* description
* brand

This allows the frontend to provide a general catalogue search without requiring separate endpoints for each searchable field.

## Shopping Cart

Authenticated users have a persistent cart associated with their account.

The cart API supports:

* retrieving the current cart
* adding products
* changing item quantities
* removing products

Cart state is stored alongside the user's MongoDB document, allowing it to persist across sessions.

## Product Reviews

Users can interact with product reviews through dedicated API endpoints.

The review system supports:

* retrieving reviews for a product
* submitting a review
* editing an existing review
* deleting a review

Creating, editing and deleting reviews requires authentication.

Review ownership is checked before modification, with administrative permissions available for moderation.

User information can also be populated into review responses so that reviews can be associated with their authors.

## Email Workflows

**Nodemailer** is used for account-related email functionality.

The authentication API includes flows for:

* email verification
* password reset

Email requests are protected with rate-limiting middleware to reduce repeated or abusive requests.

The application also includes a separate contact endpoint for messages originating from the frontend.

## API Structure

The application separates routes, controllers, data models, middleware and configuration:

```text
AGB-Tech-Backend/
│
├── config/
│   ├── database configuration
│   ├── CORS configuration
│   ├── role definitions
│   └── email configuration
│
├── controllers/
│   ├── authControllers.js
│   ├── cartControllers.js
│   ├── contactControllers.js
│   ├── productsControllers.js
│   └── reviewsControllers.js
│
├── middleware/
│   ├── JWT verification
│   ├── role verification
│   ├── request helpers
│   ├── rate limiting
│   └── error handling
│
├── model/
│   ├── Cart.js
│   ├── Product.js
│   ├── Reviews.js
│   └── User.js
│
├── routes/
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── contactRoutes.js
│   ├── productRoutes.js
│   └── reviewsRoutes.js
│
├── index.js
├── package.json
└── vercel.json
```

This structure keeps HTTP routing separate from application logic and database schemas.

## Main API Routes

### Authentication

```text
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
GET    /auth/refresh
POST   /auth/email
PATCH  /auth/verifyEmail
PATCH  /auth/resetPwd
GET    /auth/user
```

### Products

```text
GET     /products
POST    /products
PATCH   /products
DELETE  /products

GET     /products/categories
GET     /products/categories/:category

GET     /products/brands
GET     /products/brands/:brand

GET     /products/search?q=...
```

Product `POST`, `PATCH` and `DELETE` operations require authenticated administrator access.

### Cart

```text
GET     /cart
POST    /cart
PATCH   /cart
DELETE  /cart
```

All cart operations require authentication.

### Reviews

```text
GET     /products/reviews/:productId
POST    /products/reviews
PATCH   /products/reviews
DELETE  /products/reviews
```

Review creation and modification require authentication.

## Data Model

The MongoDB database stores several related entities.

### Users

User records contain information including:

* name
* email
* hashed password
* account role
* verification status
* shopping cart
* timestamps

### Products

Product documents represent items available through the AGB Tech catalogue and can be queried by properties such as category and brand.

### Reviews

Reviews are associated with products and users, allowing product feedback to retain its author relationship.

### Cart

Cart entries associate products with quantities and are embedded within the user's account data.

## Security

The backend implements several common API security mechanisms:

* **bcrypt** password hashing
* **JWT** access and refresh tokens
* **HTTP-only refresh-token cookies**
* authentication middleware
* role-based route protection
* CORS configuration
* request rate limiting
* environment variables for secrets and configuration
* centralised error-handling middleware

## Tech Stack

* **JavaScript**
* **Node.js**
* **Express**
* **MongoDB**
* **Mongoose**
* **JSON Web Tokens**
* **bcrypt**
* **Nodemailer**
* **express-rate-limit**
* **CORS**
* **dotenv**

## MERN Architecture

AGB Tech is split into separate frontend and backend repositories.

```text
React frontend
      ↓
   REST API
      ↓
Node.js + Express
      ↓
   Mongoose
      ↓
   MongoDB
```

The frontend is built with React, while this repository handles persistence, authentication and server-side application logic.

## Running Locally

Install dependencies:

```bash
npm install
```

Create an environment file containing the required database, authentication and email configuration.

Then start the development server:

```bash
npm run dev
```

or run the production entry point:

```bash
npm start
```

The server uses port `3500` by default when no alternative `PORT` environment variable is supplied.

## What This Project Explores

AGB Tech demonstrates several fundamental full-stack and backend engineering concepts:

* REST API design
* client/server architecture
* asynchronous Node.js development
* MongoDB data modelling
* authentication and authorisation
* password hashing
* token-based session management
* role-based access control
* protected routes
* CRUD operations
* persistent shopping carts
* relational-style references in a document database
* middleware design
* email workflows
* rate limiting
* frontend/backend integration
* deployment of a standalone API
