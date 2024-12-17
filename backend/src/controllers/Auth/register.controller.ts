import { userService } from "../../services";
import { errorHandlerWrapper, generateToken } from "../../utils";
import { encryptPassword } from "../../utils/encrypt";
import httpStatus from "http-status";

const registerHandler = async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = await encryptPassword(password);
  try {
      const user = await userService.createUser({
        username,
        email,
        password: hashPassword,
      });
      const token = generateToken(user?.uuid);
      return res.status(httpStatus.ACCEPTED).json({ token, id: user?.uuid, username: user?.username });
    } catch (err) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Something went wrong, please try again." });
    }
};

export const registerController = errorHandlerWrapper(registerHandler);
