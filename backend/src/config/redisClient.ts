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
