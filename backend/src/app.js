import "dotenv/config";
import fs from "fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { Registry, collectDefaultMetrics, Histogram, Counter } from 'prom-client';

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import showtimeRoutes from "./routes/showtime.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ---------- prometheus metrics ----------
const register = new Registry();
collectDefaultMetrics({ register });

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});
register.registerMetric(httpRequestDuration);

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestsTotal);

// ---------- security ----------
const isDev = process.env.NODE_ENV !== "production";
const connectSrcs = ["'self'"];

if (isDev) {
  connectSrcs.push("http://localhost:3001", "http://localhost:5173", "ws://localhost:5173");
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https:", "data:"],
        connectSrc: connectSrcs
      }
    }
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.json());

// ---------- cors ----------
const corsOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : "*",
    credentials: true
  })
);

// ---------- api rate limits ----------
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }));

// ---------- prometheus middleware ----------
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.observe({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode }, duration);
    httpRequestsTotal.inc({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  });
  next();
});

// ---------- api routes ----------
app.get("/", (req, res) => {
  res.json({ message: "Absolute Cinema API", status: "running" });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

// ---------- vue static ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, "../frontend/dist");

if (process.env.NODE_ENV === "production" && fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}



app.use(errorHandler);

export default app;

