import { authRouter } from "./authRouter";
import { todoRouter } from "./todoRoutes";
import { Router } from "express";

export const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/todo", todoRouter);
