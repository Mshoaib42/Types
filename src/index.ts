import express, { NextFunction, Request, Response } from "express";
import sequelize from "./config/db";
import { Server } from "http";
import logger from "./utils/logger";
import helmet from "helmet";
import { errorHandler } from "./middlewares/ErrorHandler.middleware";
import routes from "./routes";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
export const app = express();

dotenv.config();

// Middleware to compress response
app.use(compression());

// Middleware to secure HTTP headers
app.use(helmet());

// Middleware to parse JSON
app.use(express.json());

// Allowed origins
const allowedOrigins = [
  "https://clutch.com",
  "https://stagging.clutch.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies)
    methods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply rate limiter
app.use(apiRateLimiter);

// API Routes
app.use("/api/v1", routes);

// 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handling middleware

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy!");
});

app.use(errorHandler);
// Graceful shutdown
const gracefulShutdown = (server: Server) => () => {
  server.close(() => {
    sequelize.close().then(() => {
      process.exit(0);
    });
  });
};

const PORT = process.env.PORT ?? 4000;

const startServer = async () => {
  try {
    /*await sequelize
   .sync({ alter: true });*/
    console.log("Database connected");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    process.on("SIGTERM", gracefulShutdown(server));
    process.on("SIGINT", gracefulShutdown(server));
  } catch (e) {
    console.error(e);
    // logger.error("Failed to start server:", (e as Error).message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// startServer();

if (process.env.NODE_ENV !== "test") {
  startServer();
}
