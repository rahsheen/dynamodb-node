import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import boxRouter from "./routes/box";

const app = express();
/**
 * Enable CORS
 */
app.use(cors());

/**
 * Miscellaneous
 */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Routes
 */
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/box", boxRouter);

export default app;
