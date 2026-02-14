# Sprout Digital Assessment

A full-stack application for Sprout Digital Assessment.

## 🚀 Live Demo

Check it out here: **https://sprout-digital-assessment.handraromel.site**

### Test Credentials

```
Email:    administrator@mail.id
Password: Superuser@12345
```

---

## 📋 Project Overview

This application helps you manage your accounting data efficiently with features like:

- **Chart of Accounts (Daftar Akun)** - Hierarchical account management with infinite scroll
- **General Journal (Jurnal Umum)** - Record and track journal entries
- **Invoicing (Penagihan)** - Create and manage invoices with payment tracking

---

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **HeadlessUI** - Accessible UI components
- **React Router** - Routing

### Backend

- **Express.js** with TypeScript
- **Prisma ORM** - Database abstraction
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Swagger** - API documentation

### Infrastructure

- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Oracle VPS** with Oracle Linux 8 - Production hosting

---

## 🏃 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** & **Docker Compose** (for Docker setup)
- **PostgreSQL** 14+ (if running locally without Docker)

### Option 1: Run Everything with Docker (Recommended)

Check the outer .env.example file, then:

```bash
cp .env.example .env
```

ENV file can be used as is, but can configure as desired.

Make sure to point localhost to development domain at etc/hosts (default is sda-dev.local):

```bash
127.0.0.1 sda-dev.local
```

```bash
# Clone the repository
git clone <repository-url>
cd sprout-digital-assessment

# Build and start all services
docker compose --profile dev up --build
```

The application will be available at:

- **Frontend**: http://sda-dev.local/
- **API**: http://sda-dev.local/api/
- **API Docs**: http://sda-dev.local/api-docs

---

### Option 2: Run Backend and Frontend with npm Only

This is useful if you already have PostgreSQL running locally.

```bash
# Setup API
cd api
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev

# In another terminal, setup UI
cd ui
npm install
npm run dev
```

---

## 📦 Building for Production

### Build Frontend

```bash
cd ui
npm run build
```

Output goes to `ui/dist`

### Build Backend

```bash
cd api
npm run build
```

Output goes to `api/dist`

---

## 🗄️ Database Management

### Generate Prisma Client

```bash
npm run db:generate
```

### Run Migrations

```bash
npm run db:migrate          # Interactive migration (local)
npm run db:migrate:deploy   # Deploy migrations (production)
```

### Seed Database

```bash
npm run db:seed             # Local seed
npm run db:seed:docker      # Docker seed
```

---

## 📚 API Documentation

Once the API is running, visit: **http://localhost:3000/api-docs**

All endpoints are documented with Swagger/OpenAPI.

---

## 🚀 Deployment

The application is deployed on Oracle VPS and accessible at:
**https://sprout-digital-assessment.handraromel.site**

### CI/CD Pipeline

- **GitHub Actions** automatically builds and tests on push

---

## 📝 Available Scripts

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend

```bash
npm run dev                    # Start development server with hot reload
npm run build                  # Compile TypeScript
npm start                      # Run compiled JavaScript
npm run db:generate            # Generate Prisma client
npm run db:migrate             # Create database migrations
npm run db:seed                # Seed the database
npm run db:seed:docker         # Seed database in Docker
npm run db:regenerate:docker   # Regenerate and deploy in Docker
```
