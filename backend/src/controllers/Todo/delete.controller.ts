import { errorHandlerWrapper } from "../../utils";
import { todoService } from "../../services";
import httpStatus from "http-status";

const deleteHandler = async (req, res) => {
  const id = req.query?.id;
  const todo = await todoService.deleteTodo(req.user.uuid, id);
  res.json({ success: todo }).status(httpStatus.OK);
};

export const deleteTodoController = errorHandlerWrapper(deleteHandler);
