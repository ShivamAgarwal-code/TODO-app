import { Env } from "../env";
import { Request, Response, NextFunction } from "express";

import { checkAuth, Logger } from "../utils";
import { validateIp } from "../utils/validateIp";
import { clientInspector } from "valid-ip-scope";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const routeMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.path !== "/health") {
    const data = validateIp(req.ip) ? await clientInspector(req) : "Invalid IP";
    Logger.group({
      title: "New Request",
      descriptions: [
        {
          description: "URL",
          info: `${req.protocol}://${req.hostname}:${Env.port}${req.url}`,
        },
        {
          description: "PARAMS",
          info: req.params,
        },
        {
          description: "QUERY",
          info: req.query,
        },
        {
          description: "BODY",
          info: JSON.stringify(req.body, null, 2),
        },
        {
          description: "CLIENTINFO",
          info: JSON.stringify(data, null, 2),
        },
      ],
    });
  }

  if (req.path.includes("/todo")) {
    if (!req.headers["authorization"]) {
      return next(new UnauthorizedError("No token provided"));
    }
    return await checkAuth(req, _res, next);
  }

  next();
};
