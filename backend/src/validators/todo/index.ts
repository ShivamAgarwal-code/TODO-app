import { body, query } from "express-validator";

export const todoValidator = (includeId?: "only" | "required") => {
  if (includeId === "only") {
    return [
      query("id").optional().isUUID().withMessage("ID is invalid."),
    ];
  };

  return [
    body("title").isString().notEmpty().withMessage("Title is required."),
    body("description").optional().isString(),
    body("status").isString().matches(/^(PENDING|IN_PROGRESS|COMPLETED)$/).withMessage("Status is invalid."),
    body("dueDate").optional().isString().withMessage("Due date is invalid."),
    ...(includeId === "required" ? [body("id").optional()] : []),
  ];
};
