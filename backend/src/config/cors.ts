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
