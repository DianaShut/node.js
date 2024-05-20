import express, { NextFunction, Request, Response } from "express";
import fileupload from "express-fileupload";
import * as mongoose from "mongoose";

import { config } from "./configs/config";
import { runCronJobs } from "./crons";
import { ApiError } from "./errors/api-error";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());

app.use("/auth", authRouter);
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

app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGO_URL);
  console.log(`Server is running at http://${config.HOST}:${config.PORT}/`);
  runCronJobs();
});
