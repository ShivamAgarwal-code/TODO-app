import React, { useState } from "react";
import { Todo, TodoStatus } from "../types";

interface AddTodoFormProps {
  addTodo: (todo: Omit<Todo, "uuid">) => void;
}

export function AddTodoForm({ addTodo }: AddTodoFormProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>("PENDING");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTodo({
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });
    setIsAdding(false);
    setTitle("");
    setDescription("");
    setStatus("PENDING");
    setDueDate("");
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full h-full min-h-[100px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
      >
        + Add New Todo
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-lg">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TodoStatus)}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      >
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
      />
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-200 text-gray-700 rounded hover:bg-purple-300 transition-colors"
        >
          Add Todo
        </button>
      </div>
    </form>
  );
}
