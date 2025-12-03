import { Logger } from "@packages/logger";
import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { corsConfig } from "./config/cors";
import { initializedDatabase } from "./config/dataSource";
import { Routes } from "./routes";
import { rawBodyVerifyConfig } from "./config/rawBody";

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

    // For raw body parsing in webhooks trigger verification
    this.app.use(rawBodyVerifyConfig());

    // Help to parse JSON payloads and URL-encoded payloads
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Add cookie parser middleware
    this.app.use(cookieParser());
  }

  public routes(): void {
    Routes.Endpoints(this.app);
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      Logger.info(`API is running at http://localhost:${this.app.get("port")}`);
    });
  }
}

export const server = new Server();
server.start();
