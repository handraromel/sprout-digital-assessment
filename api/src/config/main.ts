/**
 * Express App Configuration
 * Centralizes all middleware and application setup
 */

import { swaggerSpec } from "@/config/swagger";
import cors from "cors";
import express, { Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

/**
 * Configure Express app with all middleware
 */
export const configureApp = (app: Express): void => {
  // Security middleware
  app.use(helmet());

  // CORS middleware
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    }),
  );

  // Request logging middleware
  app.use(morgan("dev"));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

/**
 * Configure routes
 */
export const configureRoutes = (app: Express, routes: express.Router): void => {
  app.use(process.env.API_PREFIX || "/api/v1", routes);
};

/**
 * Configure Swagger documentation
 */
export const configureSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

/**
 * Configure health check endpoint
 */
export const configureHealthCheck = (app: Express): void => {
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });
};

/**
 * Configure error handling middleware
 */
export const configureErrorHandling = (app: Express): void => {
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error(err.stack);
      res.status(500).json({ error: "Something went wrong!" });
    },
  );
};
