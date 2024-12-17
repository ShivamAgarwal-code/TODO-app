import { errorHandlerWrapper } from "../../utils";
import { todoService } from "../../services";
import httpStatus from "http-status";

const addHandler = async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const todo = await todoService.createTodo(req.user.uuid, {
    description: !!description ? description : undefined,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    title,
    status,
  });
  res.json({ todo }).status(httpStatus.CREATED);
};

export const addTodoController = errorHandlerWrapper(addHandler);
