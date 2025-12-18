---
sidebar_position: 1
title: Overview
description: Learn about the Micro Learning Platform's architecture, features, and development workflow.
---

## Introduction

Welcome to the Micro Learning Platform documentation! This comprehensive learning management system provides a modern, scalable solution for online education.

## Platform Overview

Our platform offers a robust set of features including:

- 📚 Course management and content organization
- 👥 Student enrollment and progress tracking
- 💳 Payment integration with LemonSqueezy
- 🤖 AI-powered learning assistance
- 📊 Learning analytics and leaderboards

## Project Architecture

### 📂 Project Structure

```
├── backend/         # Node.js API server with TypeScript
├── frontend/        # React web application
├── packages/        # Shared packages
│   ├── validations/ # Shared Zod validation schemas
│   └── logger/      # Shared logging functionality
└── doc/            # Documentation site
```

### 🛠 Technology Stack

#### Backend Core

- ⚡ Node.js with TypeScript
- 🌐 Express.js for API routes
- 🗄️ PostgreSQL with TypeORM
- 🔐 JWT authentication
- 📚 Swagger documentation

#### Frontend

- React with TypeScript
- Vite as build tool
- TanStack Router & Query
- Zustand for state management
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ (use `nvm use`)
- pnpm 8+

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

```bash
# Start backend development server
pnpm dev:backend

# Start frontend development server
pnpm dev:frontend

# Start all services (including shared packages)
pnpm dev:all

# Build all packages
pnpm build

# Build only validations package
pnpm build:validations
```

## Database Management

```bash
# Generate seed data
pnpm seed:generate

# Seed the database
pnpm seed

# Truncate seed data
pnpm seed:clean
```

## Architecture Patterns

### Backend Structure

```
backend/
├── src/
│   ├── controllers/    # API controllers
│   ├── services/      # Business logic
│   ├── entity/        # TypeORM schemas
│   ├── routes/        # API routes
│   ├── middleware/    # Express middleware
│   └── config/        # Configuration
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/    # React components
│   ├── routes/       # Route components
│   ├── api/          # API integration
│   ├── hooks/        # Custom hooks
│   ├── stores/       # Zustand stores
│   └── types/        # TypeScript types
```

## Using Shared Packages

In any workspace, you can use the shared packages:

```bash
# Add validations package
pnpm add @packages/validations

# Add logger package
pnpm add @packages/logger
```

## Development Workflow

1. Use `nvm use` to ensure correct Node.js version
2. Install dependencies with `pnpm install`
3. Start development servers:
   - Backend: `pnpm dev:backend`
   - Frontend: `pnpm dev:frontend`
   - All services: `pnpm dev:all`
4. Build packages as needed with `pnpm build`

## Cleaning Up

```bash
# Remove all build artifacts and dependencies
pnpm clean
```

### 1. **Backend**

The backend is a Node.js application written in TypeScript. It uses PostgreSQL as the database and follows a modular architecture. Key libraries and tools include:

- **TypeORM**: For database modeling and migrations.
- **Express**: For building RESTful APIs.
- **JWT**: For authentication and token management.
- **Redis**: For caching and session management.

#### Folder Structure:

- `src/entity/`: TypeORM schemas for database models.
- `src/controllers/`: API controllers with error-catching decorators.
- `src/services/`: Business logic for features.
- `src/routes/`: API route definitions.
- `src/config/`: Configuration files (e.g., database, Redis, CORS).
- `src/utils/` and `src/middleware/`: Helpers and Express middleware.
- `src/migrations/`: Database migration files.
- `src/seed/`: Scripts for seeding and truncating the database.

### 2. **Frontend**

The frontend is a React application written in TypeScript. It uses **Vite** for fast builds, **TanStack Query** for data fetching, and **Zustand** for state management.

#### Folder Structure:

- `src/components/`: Feature-based React components.
- `src/api/`: API layer for interacting with the backend.
- `src/hooks/`: Custom hooks for shared UI and API logic.
- `src/routes/`: Route definitions for different parts of the app (admin, website, learner).
- `src/stores/`: Zustand global state management.
- `src/types/` and `src/utils/`: Shared types and utility functions.

### 3. **Shared Packages**

- **`packages/validations/`**: Contains shared Zod schemas for data validation. These schemas ensure consistent validation across the backend and frontend.
- **`packages/logger/`**: A shared logger utility for consistent logging throughout the application.

### 4. **Documentation**

The `doc/` folder contains documentation for the project, built using **Docusaurus**. It includes guides, blog posts, and static assets to help developers understand and contribute to the project.

#### Folder Structure:

- `docs/`: Markdown files for documentation.
- `blog/`: Blog posts for updates and announcements.
- `src/`: Components and pages for the Docusaurus site.
- `static/`: Static assets like images and icons.

## Key Libraries and Tools

### Backend:

- **TypeORM**: Database ORM for PostgreSQL.
- **Express**: Web framework for building APIs.
- **JWT**: Authentication and token management.
- **Redis**: Caching and session storage.

### Frontend:

- **React**: UI library for building user interfaces.
- **Vite**: Fast build tool for modern web projects.
- **TanStack Query**: Data fetching and caching.
- **Zustand**: Lightweight state management.

### Shared:

- **Zod**: Schema validation for TypeScript.
- **Winston**: Logging library for consistent log management.

## 🔧 Development Guidelines

### 🔄 Development Flow

#### Backend Development

1. 📝 Design business logic in `src/services/`
2. 🎮 Implement controllers in `src/controllers/`
3. 🛣️ Define API routes in `src/routes/`
4. 🗄️ Create/update TypeORM schemas in `src/entity/`
5. 🔧 Add utilities in `src/utils/` or middleware
6. ✅ Update validation schemas in `packages/validations/`

#### Frontend Development

1. 🗺️ Define routes in `src/routes/`
2. 🧱 Create UI components in `src/components/`
3. 🎯 Implement controller hooks for UI logic
4. 🔄 Add API hooks for data fetching
5. 🏪 Manage global state with Zustand

## 🌟 Key Features

### 📚 Learning Experience

- 📝 Course enrollment and progress system
- 📈 XP/Points and achievements
- 🤖 AI-powered learning assistance
- 📊 Activity monitoring and streaks
- 🎯 Personalized learning paths

### 🎓 Course Management

- 📂 Hierarchical content organization
  - Courses → Modules → Chapters → Lessons
- 🔄 Smart content sequencing
- ✅ Quiz and assessment system
- 📋 Draft/Published/Archived status
- 📊 Progress analytics

### 👥 User Management

- 🔑 Role-based access control
- 👤 Profile customization
- 📈 Learning statistics
- 📱 Activity dashboard

### 💳 Payment Integration

- 🛒 LemonSqueezy checkout
- 💰 Course pricing management
- 🔄 Webhook processing
- 📊 Revenue analytics

## 📑 Feature Reference

| Feature                | Description                                |
| ---------------------- | ------------------------------------------ |
| 👥 **User Management** | Advanced user system with JWT auth & Redis |
| 📚 **Course System**   | Complete course lifecycle management       |
| 📊 **Progress System** | Smart progress tracking with XP & streaks  |
| 🤖 **AI Assistant**    | Contextual learning support with AI        |
| 📈 **Analytics**       | Comprehensive learning & revenue metrics   |
| 🌐 **API Platform**    | Public APIs for courses & leaderboards     |
| ⚙️ **Admin Portal**    | Powerful course & user management tools    |
| ✅ **Validation**      | Cross-stack schema validation with Zod     |
| 📖 **Documentation**   | Developer-friendly Docusaurus docs         |

## 🎯 Next Steps

To begin working with the platform:

1. 📥 Clone the repository
2. ⚙️ Follow the setup instructions
3. 🔧 Start the development servers
4. 📖 Explore the documentation
5. 🛠️ Make your first contribution

## 🌟 Conclusion

This monorepo provides a robust foundation for building a modern learning platform. By following these patterns and guidelines, you'll be able to contribute effectively while maintaining code quality and consistency across the stack.

---
