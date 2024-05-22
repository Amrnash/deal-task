import express from "express";
import { properyRouter } from "./routes/properties.js";
import { usersRouter } from "./routes/users.js";

const app = express();
app.use(express.json());
app.use("/property", properyRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  const status = err.status ?? 500;
  const errorResponse = {
    message: err.message,
    status,
  };
  if (process.env.NODE_ENV === "development") {
    errorResponse.stack = err.stack;
    if (err.info) {
      errorResponse.info = err.info;
    }
  }
  console.log(err);
  res.status(status).json({ error: errorResponse });
});

export { app };
