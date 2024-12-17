import { errorHandlerWrapper } from "../../utils";
import { todoService } from "../../services";
import httpStatus from "http-status";

const todosHandler = async (req, res) => {
  const id = req.query?.id;
  const todo = id ? await todoService.getOneTodo(req.user.uuid, id) : await todoService.getAllTodo(req.user.uuid);
  res.json({ todo }).status(httpStatus.OK);
};

export const getTodosController = errorHandlerWrapper(todosHandler);
