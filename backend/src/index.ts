import { Logger } from "@packages/logger";
import express from "express";
import { initializedDatabase } from "./config/dataSource";
import redis, { CACHE_TIMES, generateCacheKey } from "./config/redisClient";
import { corsConfig } from "./config/cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

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

    // Initialize the database connection
    initializedDatabase();

    // CORS configuration with emphasis on cookie support
    this.app.use(corsConfig());

    // Middleware for logging HTTP requests
    this.app.use(morgan("tiny"));

    // Add cookie parser middleware
    this.app.use(cookieParser());
  }

  public routes(): void {
    this.app.get("/", async (req, res) => {
      const key = generateCacheKey("test");

      let value = await redis.get(key);

      if (!value) {
        Logger.info(`Setting ${key} in Redis`);
        await redis.set(key, "testValue", "EX", CACHE_TIMES.fifteenMinutes);
      } else {
        Logger.info(`Getting ${key} from Redis`);
      }

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
