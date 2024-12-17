import { Router } from "express";
import { TodoValidator } from "../validators";
import { TodoController } from "../controllers";

export const todoRouter = Router();

todoRouter.post(
  "/add",
  TodoValidator.todoValidator(),
  TodoController.addTodoController
);

todoRouter.put(
  "/update",
  TodoValidator.todoValidator("required"),
  TodoController.updateTodoController
);

todoRouter.delete(
  "/delete",
  TodoValidator.todoValidator("only"),
  TodoController.deleteTodoController
);

todoRouter.get(
  "/todos",
  TodoValidator.todoValidator("only"),
  TodoController.getTodosController
);
