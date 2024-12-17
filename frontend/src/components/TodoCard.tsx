import { motion } from "motion/react";
import { X } from "lucide-react";
import React from "react";

import { Todo, TodoStatus, TodoActions } from "../types";
import { ArrowLeftIcon } from "./icons";

interface TodoCardProps {
  todo: Todo;
  index: number;
  actions: TodoActions;
}

export function TodoCard({ todo, index, actions }: TodoCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(todo.title);
  const [editedDescription, setEditedDescription] = React.useState(
    todo.description || "",
  );
  const [editedStatus, setEditedStatus] = React.useState<TodoStatus>(todo.status);
  const [editedDueDate, setEditedDueDate] = React.useState(
    todo.dueDate ? todo.dueDate.toISOString().slice(0, 16) : "",
  );

  const handleSave = () => {
    actions.editTodo({
      uuid: todo.uuid,
      title: editedTitle,
      status: editedStatus,
      description: editedDescription,
      dueDate: editedDueDate ? new Date(editedDueDate) : undefined,
    });
    setIsEditing(false);
  };
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.2 } },
  };

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-2xl shadow-lg relative overflow-hidden
        ${
          index % 2 === 0
            ? "bg-purple-200 dark:bg-purple-800"
            : "bg-green-200 dark:bg-green-800"
        }`}
    >
      {isEditing ? (
        <motion.div initial="hidden" animate="visible" variants={contentVariants}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Todo Title"
            className="w-full p-2 mb-3 border-b rounded-b-md border-gray-700 dark:border-b-gray-300 dark:text-white outline-none"
          />
          <textarea
            className="h-full w-full text-sm outline-none border-b rounded-b-md border-gray-700 dark:border-b-gray-300 dark:text-white"
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Add a note..."
            maxLength={1000}
            autoFocus
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value as TodoStatus)}
            className="w-full p-2 px-4 mb-3 mt-2 outline-none border-1 border-gray-700 dark:border-zinc-200 rounded dark:text-white"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <input
            type="datetime-local"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded dark:text-white"
          />
          <div className="flex items-center justify-between space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="ml-[-8px] text-gray-700 dark:text-white transition-colors"
            >
              <ArrowLeftIcon />
            </button>
            <button
              onClick={handleSave}
              type="submit"
              className="h-8 px-6 items-center bg-transparent hover:bg-black/15 dark:hover:bg-white/15 border rounded-lg border-gray-700 text-gray-700 dark:border-zinc-200 dark:text-zinc-50"
            >
              Save
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsEditing(true)}
          className="h-full w-full flex flex-col justify-between"
        >
          <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
            {todo.title}
          </h3>
          {todo.description ? (
            <p className="text-sm text-left text-gray-600 dark:text-gray-400 mt-2">
              {todo.description}
            </p>
          ) : (
            <p className="text-sm text-left italic underline text-gray-600 dark:text-gray-400 mt-2">
              Click here to add a todo note
            </p>
          )}
          <div className="mt-4 w-full flex flex-row justify-between items-center">
            <span
              className={`text-xs px-2 py-1 rounded-full
                ${todo.status === "COMPLETED" ? "bg-green-500 text-white" : ""}
                ${todo.status === "PENDING" ? "bg-yellow-500 text-white" : ""}
                ${todo.status === "IN_PROGRESS" ? "bg-blue-500 text-white" : ""}`}
            >
              {"COMPLETED" === todo.status
                ? "Completed"
                : "PENDING" === todo.status
                ? "Pending"
                : "In progress"}
            </span>
            <time className="text-sm text-gray-600 dark:text-gray-400">
              {todo.dueDate?.toLocaleString([], {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </time>
          </div>
          <div className="absolute z-50 top-2 right-2 space-x-2">
            <button
              onClick={() => actions.deleteTodo(todo.uuid)}
              className="text-red-600 bg-red-200 hover:text-red-800 dark:hover:text-red-400 transition-colors rounded-md"
            >
              <X />
            </button>
          </div>
        </motion.button>
      )}
    </motion.div>
  );
}
