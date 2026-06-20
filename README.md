# Inventory & Order Management System

## Overview

The Inventory & Order Management System is a full-stack web application designed to help businesses efficiently manage products, customers, inventory, and orders. The application provides a simple and intuitive interface for maintaining product catalogs, tracking customer information, and processing orders while automatically managing inventory levels.

The backend exposes a RESTful API built with FastAPI, the frontend is developed using React, and all application data is stored in PostgreSQL. The entire application is containerized using Docker and orchestrated with Docker Compose, enabling consistent local development and easy deployment.

---

## High-Level Architecture

```mermaid
flowchart TD

    U[👤 End User]

    F[React Frontend<br/>Vite + Axios]

    B[FastAPI Backend<br/>REST APIs]

    BL[Business Logic<br/>• SKU Validation<br/>• Email Validation<br/>• Inventory Validation<br/>• Stock Management<br/>• Order Total Calculation]

    DB[(PostgreSQL)]

    U --> F
    F -->|HTTP / JSON| B
    B --> BL
    BL --> DB
```
---

# System Components

### Frontend (React)

The frontend provides a responsive user interface that enables users to:

- Manage products
- Manage customers
- Create and track orders
- View inventory status
- Monitor dashboard statistics

---

### Backend (FastAPI)

The backend exposes REST APIs responsible for:

- CRUD operations for products
- CRUD operations for customers
- Order creation and management
- Inventory validation
- Automatic stock updates
- Order total calculation
- Request validation and error handling

---

### Database (PostgreSQL)

The PostgreSQL database stores all persistent application data including:

- Products
- Customers
- Orders
- Order Items

The database enforces unique constraints such as Product SKU and Customer Email.

---

## Business Workflow

```mermaid
flowchart LR

A[Create Order]

B[Validate Customer]

C[Validate Product]

D{Stock Available?}

E[Calculate Total]

F[Reduce Stock]

G[Save Order]

H[Return Success]

I[Return Error]

A --> B
B --> C
C --> D

D -->|Yes| E
D -->|No| I

E --> F
F --> G
G --> H
```
---

## Deployment Architecture

```mermaid
flowchart TD

    User[👤 User]

    Frontend[Vercel<br/>React Frontend]

    Backend[Render<br/>FastAPI Backend]

    Database[(Neon PostgreSQL)]

    User --> Frontend
    Frontend --> Backend
    Backend --> Database
```
---

## Component Architecture

```mermaid
flowchart LR

subgraph Frontend
A[Dashboard]
B[Products]
C[Customers]
D[Orders]
end

subgraph Backend
E[Product API]
F[Customer API]
G[Order API]
H[Dashboard API]
end

subgraph Database
I[(Products)]
J[(Customers)]
K[(Orders)]
L[(Order Items)]
end

A --> H
B --> E
C --> F
D --> G

E --> I
F --> J
G --> K
G --> L
```

## Database Schema

```mermaid
erDiagram

PRODUCT {
    int id PK
    string name
    string sku
    decimal price
    int stock
}

CUSTOMER {
    int id PK
    string full_name
    string email
}

ORDER {
    int id PK
    int customer_id FK
    decimal total_amount
    datetime created_at
}

ORDER_ITEM {
    int id PK
    int order_id FK
    int product_id FK
    int quantity
    decimal unit_price
}

CUSTOMER ||--o{ ORDER : places
ORDER ||--|{ ORDER_ITEM : contains
PRODUCT ||--o{ ORDER_ITEM : references
```

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + Vite |
| Backend | FastAPI |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| API Validation | Pydantic |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Version Control | Git |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |
| Database Hosting | Neon PostgreSQL |
