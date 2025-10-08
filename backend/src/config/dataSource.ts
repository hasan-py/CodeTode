import { DataSource } from "typeorm";
import path from "path";
import { Logger } from "@packages/logger";
import { config } from "dotenv";

config();

const NEON_DB_CONNECTION_STRING = process.env.NEON_DB_CONNECTION_STRING;
const isDevelopment = process.env.NODE_ENV === "development";

export const AppDataSource = NEON_DB_CONNECTION_STRING
  ? new DataSource({
      type: "postgres",
      url: NEON_DB_CONNECTION_STRING,
      logging: false,
      poolSize: 5,
      synchronize: !!isDevelopment,
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
      synchronize: !!isDevelopment,
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
