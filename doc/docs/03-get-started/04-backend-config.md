---
sidebar_position: 4
title: Backend Setup - Database, Redis, CORS & Cookie Parser
---

## Configuration Overview

This guide shows how to wire up the essential backend pieces used in this codebase:

- Database configuration (Local PostgreSQL or NeonDB)
- Redis client (ioredis)
- CORS configuration (with cookie support)
- Cookie parser middleware
- Morgan middleware for HTTP request logging

## Environment Variables Setup

Add the following environment variables to your `.env` file to configure the backend:

### Database Configuration

```env
# Local PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres

# NeonDB Configuration (Uncomment if using NeonDB)
# NEON_DB_CONNECTION_STRING=your_connection_string
```

### Redis Configuration

```env
# Redis Configuration
# For local Redis setup, no additional variables are needed.
# For cloud Redis, use the following:
REDIS_URL=redis://default:your_password@your_redis_host:6379
```

### CORS Configuration

```env
# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### Your final `.env` will look like now:

```env title="backend/.env"
# Server
NODE_ENV=development
SERVER_PORT=8000

# Local PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres

# NeonDB Configuration (Uncomment if using NeonDB)
# NEON_DB_CONNECTION_STRING=your_connection_string

# Redis Configuration
# For local Redis setup, no additional variables are needed.
# For cloud Redis, use the following:
# REDIS_URL=redis://default:your_password@your_redis_host:6379

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### Important Notes

- Ensure only one database option is active at a time:
  - If using **Local PostgreSQL**, keep the `NEON_DB_CONNECTION_STRING` line commented.
  - If using **NeonDB**, uncomment and set the `NEON_DB_CONNECTION_STRING` line, and comment out the PostgreSQL lines.
- Connection success/errors for Redis are logged via the shared Logger.

With these in place, your backend is ready for database connections, Redis caching, cross-origin requests with cookies, and cookie parsing.

## Frontend Configuration Alignment

As we added the frontend URL to `FRONTEND_URL=http://localhost:5173` in the backend `.env` file, we also need to ensure the frontend runs on the default Vite port (5173). Follow these steps:

1. Open the `frontend/package.json` file.
2. Locate the `scripts` section and remove any custom port configuration (e.g., `--port 3000`).
3. Update the `dev` and `start` scripts to use the default Vite commands:

```json title="frontend/package.json"
{
  // Rest of your script
  "scripts": {
    // highlight-start
    "dev": "vite",
    "start": "vite",
    // highlight-end
    "build": "vite build && tsc",
    "serve": "vite preview",
    "test": "vitest run"
  }
  // Rest of your script
}
```

This ensures the frontend runs on the default Vite port (5173) and aligns with the backend CORS configuration.

## Database Configuration Code

We will use TypeORM, a powerful ORM for TypeScript and JavaScript, to manage database connections and entities.

### Steps to Set Up Database Configuration

1. **Install TypeORM and PostgreSQL Driver:**

   ```bash
   nvm use && pnpm install typeorm pg
   ```

2. **Create Configuration File:**

   - In your backend project, create a new folder named `config` if it doesn't exist.
   - Navigate to the `backend/src/config` folder.
   - Create a file named `dataSource.ts`.

3. **Add the Following Code:**

```typescript title="backend/config/dataSource.ts"
import { Logger } from "@packages/logger";
import path from "path";
import { DataSource } from "typeorm";

const NEON_DB_CONNECTION_STRING = process.env.NEON_DB_CONNECTION_STRING;

export const AppDataSource = NEON_DB_CONNECTION_STRING
  ? new DataSource({
      type: "postgres",
      url: NEON_DB_CONNECTION_STRING,
      logging: false,
      poolSize: 5,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [path.join(__dirname, "..", "entity", "**", "*.{ts,js}")],
      migrations: [path.join(__dirname, "..", "migrations", "**", "*.{ts,js}")],
      subscribers: [],
    })
  : new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: false,
      entities: [path.join(__dirname, "..", "entity", "**", "*.{ts,js}")],
      migrations: [path.join(__dirname, "..", "migrations", "**", "*.{ts,js}")],
      subscribers: [],
    });

export const initializedDatabase = () => {
  AppDataSource.initialize()
    .then(() => {
      Logger.success(
        NEON_DB_CONNECTION_STRING
          ? "Neon Postgresql Database has been initialized!"
          : "Local Database has been initialized!"
      );
    })
    .catch((error) =>
      Logger.error("Error during Database initialization", error)
    );
};
```

This configuration dynamically selects between NeonDB and Local PostgreSQL based on the `.env` file settings.

**Note:** The `synchronize: true` option automatically creates database tables based on your entity definitions. This is convenient for development but should be set to `false` in production environments.

### Add the Database Initialization

In your `backend/src/index.ts` file, import the `initializedDatabase` function and call it after setting up your Express app:

```typescript title="backend/src/index.ts"
import { Logger } from "@packages/logger";
import express from "express";
// highlight-next-line
import { initializedDatabase } from "./config/dataSource";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    if (!process.env.SERVER_PORT)
      throw new Error("Environment variable `SERVER_PORT` not found");

    this.app.set("port", process.env.SERVER_PORT);

    // highlight-start
    // Initialize the database connection
    initializedDatabase();
    // highlight-end
  }

  public routes(): void {
    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      Logger.info(`API is running at http://localhost:${this.app.get("port")}`);
    });
  }
}

export const server = new Server();
server.start();
```

Now, if we run this, we should see in the console that the database connection is successful! Use `pnpm run dev` to run the file.

You should see log like this:

```
Found 0 errors. Watching for file changes.
API is running at http://localhost:8000
Local Database has been initialized!
```

## Redis Configuration Code

1. **Add a New File:**

   - Create a new file in the `config` folder named `redisClient.ts`.

2. **Add the Following Code:**

```typescript title="backend/config/redisClient.ts"
import { Logger } from "@packages/logger";
import Redis from "ioredis";

const REDIS_CLOUD_URL = process.env.REDIS_URL;

const redis = REDIS_CLOUD_URL ? new Redis(REDIS_CLOUD_URL) : new Redis();

redis.on("ready", () => {
  Logger.success("Redis connection successful and ready to use!");
});

redis.on("error", (err) => {
  Logger.error("Redis connection error:", err);
});

export const CACHE_TIMES = {
  oneMinute: 60,
  fiveMinutes: 5 * 60,
  fifteenMinutes: 15 * 60,
  oneHour: 60 * 60,
  sixHours: 6 * 60 * 60,
  twelveHours: 12 * 60 * 60,
  oneDay: 24 * 60 * 60,
  oneWeek: 7 * 24 * 60 * 60,
  twoWeeks: 14 * 24 * 60 * 60,
  oneMonth: 30 * 24 * 60 * 60,
} as const;

export type CacheTimeKey = keyof typeof CACHE_TIMES;

export function generateCacheKey(
  ...parts: (string | number | undefined)[]
): string {
  return ["code-tode", ...parts]
    .filter((part) => part !== undefined && part !== null)
    .join(":");
}

export default redis;
```

**Explanation of Key Components:**
- `CACHE_TIMES`: Predefined cache expiration times for different use cases
- `generateCacheKey`: Helper function to create consistent cache keys with the app prefix "code-tode"
- Event listeners for 'ready' and 'error' provide feedback on Redis connection status

3. **As you can see we are using `ioredis`, so let's install it with the following command:**

```bash
nvm use && pnpm install ioredis
```

4. **Usage:**

   - You don’t need to initialize this file in `index.ts`. Instead, import it directly in the files where you need Redis functionality.
   - Example:

     ```typescript
     import redis, {
       generateCacheKey,
       CACHE_TIMES,
     } from "../../config/redisClient";

     // Just an example of usage
     this.app.get("/", async (req, res) => {
       const key = generateCacheKey("test");
       let value = await redis.get(key);

       if (!value) {
         Logger.info(`Setting ${key} in Redis`);
         await redis.set(key, "testValue", "EX", CACHE_TIMES.oneMinute);
       } else {
         Logger.info(`Getting ${key} from Redis`);
       }

       res.send(`"Hello World!", ${key}`);
     });
     ```

### Redis CLI Commands

:::info
N.B: Make sure you install redis server into your machine and redis cli. As we mentioned all in prerequisites doc.
:::

**Find Cache Keys:**
To find cache keys, you can use the following command:
To check all the list of keys in Redis by terminal, follow these steps: Open your terminal and Connect to the Redis CLI.
Code

```bash
redis-cli
```

Use the KEYS command with a wildcard:
Code

```
KEYS *
```

**Single Key Cache Example:**
To delete a specific cache key, use the following command:

```bash
redis-cli DEL your_cache_key
```

**Clear Cache by Pattern:**
To delete all keys matching a specific pattern, use the following command:

```bash
redis-cli --scan --pattern 'code-tode:*' | xargs redis-cli del
```

**Flush All Cache:**
To clear all cache from Redis, use the following command:

```bash
redis-cli flushall
```

## Let's Add Some Middleware

### Add CORS config

1. create another file name `cors.ts` inside of the config folder
2. add following code

```typescript title="backend/config/cors.ts"
import cors from "cors";

export function corsConfig() {
  return cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true, // Critical for cookies
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
    maxAge: 86400, // 1 day in seconds (preflight request caching)
  });
}
```

3. install cors and it's type

```bash
nvm use && pnpm install --save-dev @types/cors cors
```

Here you can see the CORS configuration being set up to allow requests from the specified frontend URL, with the appropriate methods and headers. This is crucial for ensuring that your backend can communicate with your frontend without running into CORS issues.

**Key CORS Settings Explained:**
- `credentials: true`: Allows cookies and authorization headers to be sent with requests
- `origin`: Specifies which domains can make requests to your API
- `methods`: Defines which HTTP methods are allowed
- `maxAge`: Sets how long browsers can cache preflight request results

4. **Integrate CORS Configuration:**
   - Add the following code into the `config` method in `index.ts` to integrate it into the application:

```typescript title="backend/src/index.ts"
// Rest of your import

// highlight-start
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { corsConfig } from "./config/cors";
// highlight-end

class Server {
  // Rest of your code

  public config(): void {
    // Rest of your code

    // highlight-start
    // CORS configuration with emphasis on cookie support
    this.app.use(corsConfig());

    // Middleware for logging HTTP requests
    this.app.use(morgan("tiny"));

    // Add cookie parser middleware
    this.app.use(cookieParser());
    // highlight-end
  }

  // Rest of your code
}

// Rest of your code
```

**Note:** The order of middleware matters. CORS should be applied first to handle preflight requests, followed by logging and then cookie parsing.

### Morgan and Cookie Parser Middleware

We added them in the above code. Here is how they are used, But first let's install both:

```bash
pnpm install cookie-parser morgan
```

```bash
pnpm install --save-dev @types/cookie-parser @types/morgan
```

1. **Morgan Middleware:**

   - Morgan is a middleware for logging HTTP requests in your application. It helps you keep track of incoming requests and their details.
   - In the `index.ts` file, we have already added Morgan middleware with the following line:
     ```typescript
     this.app.use(morgan("tiny"));
     ```

2. **Cookie Parser Middleware:**
   - Cookie Parser is a middleware that parses cookies attached to the client request object. This is useful for reading and manipulating cookies in your application.
   - We have also added Cookie Parser middleware in the `index.ts` file with the following line:
     ```typescript
     this.app.use(cookieParser());
     ```

These middleware will help you with logging requests and parsing cookies in your application. They are essential for building a robust and maintainable backend.

### Final Steps

So far, our backend configuration is complete for now. We can always add more features and improvements as needed in the future. Now, let's run the application and check for any issues.

1. **Run the Application:**

   - Use the following command to start the backend:
     ```bash
     nvm use && pnpm run dev
     ```

2. **Verify Connections:**
   - Check the console for messages indicating successful connections to the database.
   - Use tools like Postman or curl to test API endpoints and verify logs from Morgan.
   - When you will use redis you will see redis connection successful.

**🎉 Congratulations! You've successfully set up the backend configuration with CORS, logging, and cookie parsing. Your application is now ready to handle requests from the frontend and manage sessions effectively.**
