import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Deal API",
      version: "1.0.0",
      description: "This API manages property requests and ads",
    },
  },
  components: {
    Authorization: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: ["./routes/*.js"],
};

export const specs = swaggerJsdoc(options);
