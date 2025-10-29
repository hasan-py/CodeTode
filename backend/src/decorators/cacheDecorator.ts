import { Logger } from "@packages/logger";
import redis, { CACHE_TIMES, generateCacheKey } from "../config/redisClient";

interface CacheableSimpleOptions {
  key: string | ((...args: any[]) => string);
  ttl?: keyof typeof CACHE_TIMES | number;
}

export function Cacheable({
  key,
  ttl = "fifteenMinutes",
}: CacheableSimpleOptions) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const cacheKey =
        typeof key === "function" ? key(...args) : generateCacheKey(key);
      const cached = await redis.get(cacheKey);
      if (cached) {
        try {
          Logger.optional(`Cache hit for key: ${cacheKey}`);
          return JSON.parse(cached);
        } catch (error) {
          Logger.error("Cache parse error", error?.message);
        }
      }
      const result = await originalMethod.apply(this, args);
      const ttlSeconds = typeof ttl === "string" ? CACHE_TIMES[ttl] : ttl;
      await redis.set(cacheKey, JSON.stringify(result), "EX", ttlSeconds);
      return result;
    };
    return descriptor;
  };
}
