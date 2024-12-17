import e, { json } from "express";
import { userService } from "../../services";
import { errorHandlerWrapper } from "../../utils";
import { generateToken } from "../../utils/generate";
import { comparePassword } from "../../utils/password";
import httpStatus from "http-status";

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await userService.getOneUser({ email });
  if (!findUser) return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Credentials" });
  if (findUser.deletedAt) return res.status(httpStatus.BAD_REQUEST).json({ message: "User does not exist" });
  const compare = await comparePassword(password, findUser.password);
  if (!compare) return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid Credentials" });
  const token = generateToken(findUser.uuid);
  res.status(httpStatus.ACCEPTED).json({ token, id: findUser.uuid, username: findUser.username });
};

export const loginController = errorHandlerWrapper(loginHandler);
