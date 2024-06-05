import express from "express";
import { throwErr } from "./middlewares/err.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.js";
import candidateRouter from "./routes/candidate.js";
import { isLoggedIn } from "./middlewares/authentication.js";

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/candidate", isLoggedIn,candidateRouter);

// Error handling middleware
app.use(throwErr);

export { app };
