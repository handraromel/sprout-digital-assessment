import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Sprout Digital Assessment API",
      version: "1.0.0",
      description: "API documentation for the Sprout Digital Assessment",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: [path.join(__dirname, "../docs/swagger.docs.ts")],
};

export const swaggerSpec = swaggerJsdoc(options);
