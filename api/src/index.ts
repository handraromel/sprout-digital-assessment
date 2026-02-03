import {
  configureApp,
  configureErrorHandling,
  configureHealthCheck,
  configureRoutes,
  configureSwagger,
} from "@/config/main";
import routes from "@/routes";
import dotenv from "dotenv";
import express from "express";
import { APP_MESSAGES } from "./messages";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure all middleware and settings
configureApp(app);
configureHealthCheck(app);
configureSwagger(app);
configureRoutes(app, routes);

// Error handling
configureErrorHandling(app);

// Start server
app.listen(PORT, () => {
  console.log(`${APP_MESSAGES.SERVER_STARTED} http://localhost:${PORT}`);
  console.log(
    `${APP_MESSAGES.SWAGGER_AVAILABLE} http://localhost:${PORT}/api-docs`,
  );
  console.log(
    `${APP_MESSAGES.HEALTH_CHECK_AVAILABLE} http://localhost:${PORT}/health`,
  );
});

export default app;
