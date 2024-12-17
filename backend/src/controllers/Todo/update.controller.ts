import { errorHandlerWrapper } from "../../utils";
import { todoService } from "../../services";
import httpStatus from "http-status";

const updateHandler = async (req, res) => {
  const { uuid, title, description, status, dueDate } = req.body;
  const todo = await todoService.updateTodo(req.user.uuid, {
    uuid,
    title,
    description,
    status,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  });

  res.json({ todo }).status(httpStatus.OK);
};

export const updateTodoController = errorHandlerWrapper(updateHandler);
