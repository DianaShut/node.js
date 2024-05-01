import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./api-error";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

app.use(
  "*", // Обробник помилок, який відправляє відповідь з HTTP статусом 404 та повідомленням "Not found".
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status || 500).json(err.message);
  },
);

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
