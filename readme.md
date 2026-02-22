# CodeTode

1. [🎥 Full Project Video Series](#-full-project-video-series-start-here-first)
2. [🧠 Architecture Overview](#-architecture-overview)
3. [📦 Monorepo Structure](#-monorepo-structure)
4. [⚙️ Prerequisites](#-prerequisites)
5. [🔐 Environment Variables Guide](#-environment-variables-guide)
   - [Backend `.env`](#backend-env)
   - [Frontend `.env`](#frontend-env)
6. [🧪 Install Dependencies](#-install-dependencies)
7. [▶️ Run Project Locally](#️-run-project-locally)
8. [🏗 Build Project](#-build-project)
9. [🧹 Clean Project](#-clean-project)
10. [🗄 Database Migration Guide](#-database-migration-guide)
11. [🌱 Seed Database](#-seed-database)
12. [🚀 Deployment Guide](#-deployment-guide)
    - [Backend Deployment (Render)](#backend-deployment-render)
    - [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
    - [Database Deployment (NeonDB)](#database-deployment-neondb)
    - [Redis Deployment (RedisCloud)](#redis-deployment-rediscloud)
13. [Shared Packages](#shared-packages)
14. [Available Root Commands](#available-root-commands)
15. [🤝 Contribution Guide](#-contribution-guide)
16. [License](#license)

---

# 🎥 Full Project Video Series (Start Here First)

If you want a complete understanding of the project architecture, setup, and implementation, watch these videos first:

- ▶️ Part 1: [https://youtu.be/942PSbDTXgo](https://youtu.be/942PSbDTXgo)
- ▶️ Part 2: [https://youtu.be/7qP-xAnQhLc](https://youtu.be/7qP-xAnQhLc)
- ▶️ Part 3: [https://youtu.be/TH5K2ebqar8](https://youtu.be/TH5K2ebqar8)
- ▶️ Final Part: [https://youtu.be/\_-w6VZlO30Y](https://youtu.be/_-w6VZlO30Y)

---

# 🧠 Architecture Overview

A full-stack monorepo project built with **pnpm workspace**, featuring:

- Backend: Express + TypeORM + PostgreSQL + Redis
- Frontend: Vite + TypeScript + Tanstack Router + Tanstack Query
- Shared packages: Definitions & Logger
- Documentation: Docusaurus
- Deployment-ready architecture

This project follows:

- Monorepo architecture
- Shared packages pattern
- Scalable backend structure
- Workspace dependency linking

Benefits:

- Code reuse
- Type safety across frontend/backend
- Faster builds
- Easier maintenance

---

# 📦 Monorepo Structure

This project uses **pnpm workspace** to manage multiple apps and shared packages.

```
code-tode/
│
├── backend/              # Express backend API
├── frontend/             # Vite frontend app
├── doc/                  # Documentation (Docusaurus)
│
├── packages/
│   ├── definitions/     # Shared types, schemas, constants
│   └── logger/          # Shared logging utility
│
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

# ⚙️ Prerequisites

Install these before running locally:

- Node.js ≥ 18
- pnpm ≥ 9
- PostgreSQL (or NeonDB)
- Redis (local or RedisCloud)
- GitHub OAuth App
- LemonSqueezy account (for payments)

Install pnpm if not installed:

```
npm install -g pnpm
```

---

# 🔐 Environment Variables Guide

You must create `.env` files for both backend and frontend.

---

# Backend `.env`

Create:

```
backend/.env
```

Example:

```
NODE_ENV=development
SERVER_PORT=8000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=code_tode

# OR use NeonDB
# NEON_DB_CONNECTION_STRING=postgres://...

REDIS_URL=redis://localhost:6379

FRONTEND_URL=http://localhost:5173

GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/github/callback
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

JWT_SECRET=super_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
MAX_DEVICES_PER_USER=3

LS=your_lemonsqueezy_api_key
LS_WEBHOOK_SECRET=your_webhook_secret

COURSES_PATH="/course"
```

---

## How to get these values

### PostgreSQL

Local PostgreSQL:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=yourdb
```

Cloud option: NeonDB
[https://neon.tech](https://neon.tech)

Copy connection string → use as:

```
NEON_DB_CONNECTION_STRING=
```

---

### Redis

Local:

```
REDIS_URL=redis://localhost:6379
```

Cloud option: RedisCloud
[https://redis.com](https://redis.com)

---

### GitHub OAuth

Go to:

[https://github.com/settings/developers](https://github.com/settings/developers)

Create OAuth App:

Callback URL:

```
http://localhost:8000/api/auth/github/callback
```

Copy:

```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
```

---

### LemonSqueezy

[https://lemonsqueezy.com](https://lemonsqueezy.com)

Get:

- API Key
- Webhook secret

---

### COURSES_PATH

In the `/course` folder you can put any course content in .md file which will be visible in the admin panel to link with your lesson as lesson content

---

# Frontend `.env`

Create:

```
frontend/.env
```

```
VITE_API_URL=http://localhost:8000/api
```

This connects frontend → backend.

---

# 🧪 Install Dependencies

From root folder:

```
pnpm install
```

---

# ▶️ Run Project Locally

Run everything:

```
pnpm dev:all
```

Or run individually:

Backend:

```
pnpm dev:backend
```

Frontend:

```
pnpm dev:frontend
```

Packages watch mode:

```
pnpm dev:packages
```

---

# 🏗 Build Project

Build everything:

```
pnpm build
```

Build specific:

```
pnpm build:definitions
```

---

# 🧹 Clean Project

```
pnpm clean
```

---

# 🗄 Database Migration Guide

Create migration:

```
pnpm --filter backend migration:create
```

Generate migration:

```
pnpm --filter backend migration:generate
```

Run migration:

```
pnpm --filter backend migration:run
```

Revert migration:

```
pnpm --filter backend migration:revert
```

---

# 🌱 Seed Database

Seed data:

```
pnpm --filter backend seed
```

Generate seed data:

```
pnpm --filter backend seed:generate
```

Clean seed data:

```
pnpm --filter backend seed:clean
```

Verify seed:

```
pnpm --filter backend seed:verify
```

---

# 🚀 Deployment Guide

You need accounts on:

- NeonDB
- RedisCloud
- Render
- Netlify
- LemonSqueezy
- GitHub

---

# Backend Deployment (Render)

Build Command:

```
pnpm install && pnpm -r --filter "./packages/*" --filter backend build
```

Start Command:

```
pnpm --filter backend start
```

Set environment variables in Render dashboard.

---

# Frontend Deployment (Netlify)

Build Command:

```
pnpm install && pnpm -r --filter "./packages/*" build && pnpm --filter frontend build
```

Publish directory:

```
frontend/dist
```

Set environment variable:

```
VITE_API_URL=https://your-backend-url/api
```

---

# Database Deployment (NeonDB)

Create project → copy connection string → use:

```
NEON_DB_CONNECTION_STRING=
```

---

# Redis Deployment (RedisCloud)

Create Redis instance → copy URL:

```
REDIS_URL=
```

---

# Shared Packages

Packages are automatically linked using pnpm workspace:

```
@packages/definitions
@packages/logger
```

Build shared packages:

```
pnpm -r --filter "./packages/*" build
```

---

# Available Root Commands

```
pnpm dev:backend
pnpm dev:frontend
pnpm dev:packages
pnpm dev:all
pnpm build
pnpm clean
```

---

# 🤝 Contribution Guide

We welcome contributions!

---

## Step 1: Create Issue

Describe:

- Bug
- Feature
- Improvement

---

## Step 2: Fork and Create Branch

```
git checkout -b feature/your-feature-name
```

---

## Step 3: Make Changes

Follow project structure.

---

## Step 4: Create Pull Request

Include:

- Proper description
- Screenshots or video of changes
- Explain what you changed

---

## Step 5: Join Discord (Recommended)

For discussion and sync:

[https://discord.gg/gjUEzqcTSz](https://discord.gg/gjUEzqcTSz)

---

# License

ISC License © 2025-present | CodeTode build with 💚 by Hasan

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
