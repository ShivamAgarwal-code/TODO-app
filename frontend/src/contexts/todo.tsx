import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";

import { Todo, User, TodoActions, TodoStatus } from "../types";
import { authService } from "../services/auth";
import { todoService } from "../services/todo";

// Define the shape of our context
interface TodoContextType {
  user: User | null;
  todos: Todo[];
  statusFilter: TodoStatus | "all";
  sortBy: "dueDate" | "title";
  sortOrder: "asc" | "desc";
  setUser: (user: User | null) => void;
  setStatusFilter: (filter: TodoStatus | "all") => void;
  setSortBy: (sort: "dueDate" | "title") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  todoActions: TodoActions;
}

// Create the context
const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Initial todos
const initialTodos: Todo[] = [
  {
    uuid: "1",
    title: "Weekly design",
    status: "IN_PROGRESS",
    dueDate: new Date(new Date().setHours(10, 2)),
  },
  {
    uuid: "2",
    title: "Blog post",
    status: "PENDING",
    dueDate: new Date(new Date().setHours(10, 30)),
  },
  {
    uuid: "3",
    title: "Lunch break",
    status: "PENDING",
    dueDate: new Date(new Date().setHours(12, 0)),
  },
  {
    uuid: "4",
    title: "Write news",
    description: "Prepare content for the weekly newsletter",
    status: "COMPLETED",
    dueDate: new Date(new Date().setHours(13, 0)),
  },
  {
    uuid: "5",
    title: "Design our website",
    status: "IN_PROGRESS",
    dueDate: new Date(new Date().setHours(14, 0)),
  },
];

// Create a provider component
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [statusFilter, setStatusFilter] = useState<TodoStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"dueDate" | "title" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Check for existing user on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      todoService
        .getTodos()
        .then((todos) => {
          setUser(currentUser);
          setTodos(todos);
        })
        .catch((e) => {
          if (e?.message === "Token is invalid") {
            authService.logout();
          }
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      todoService
        .getTodos()
        .then((todos) => setTodos(todos))
        .catch((e) => {
          if (e?.message === "Token is invalid") {
            authService.logout();
          }
        });
    }
  }, [user]);

  // Move useCallback hooks to the top level
  const addTodo = useCallback(
    (newTodo: Omit<Todo, "uuid">) => {
      if (user) {
        toast.promise(
          (async () => {
            const createdTodo = await todoService.addTodo(newTodo);
            setTodos([createdTodo, ...(await todoService.getTodos())]);
          })(),
          {
            loading: "Adding todo...",
            success: "Todo added successfully!",
            error: "Something went wrong, please try again.",
          },
        );
      }
    },
    [user],
  );

  const editTodo = useCallback(
    (updates: Partial<Todo>) => {
      if (user) {
        toast.promise(
          (async () => {
            const updatedTodo = await todoService.updateTodo(updates);
            setTodos((prevTodos) =>
              prevTodos.map((v) => (v?.uuid === updatedTodo.uuid ? updatedTodo : v)),
            );
          })(),
          {
            loading: "Editing todo...",
            success: "Todo updated successfully!",
            error: "Something went wrong, please try again.",
          },
        );
      }
    },
    [user],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      if (user) {
        toast.promise(
          (async () => {
            const deletedTodo = await todoService.deleteTodo(id);
            if (deletedTodo) {
              setTodos((prevTodos) => prevTodos.filter((todo) => todo.uuid !== id));
            }
          })(),
          {
            loading: "Deleting todo...",
            success: "Todo deleted successfully!",
            error: "Something went wrong, please try again.",
          },
        );
      }
    },
    [user],
  );

  // Memoize filtered and sorted todos
  const filteredAndSortedTodos = useMemo(() => {
    return todos
      .filter((todo) => statusFilter === "all" || todo.status === statusFilter)
      .sort((a, b) => {
        if (sortBy === "dueDate") {
          return sortOrder === "asc"
            ? (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0)
            : (b.dueDate?.getTime() || 0) - (a.dueDate?.getTime() || 0);
        } else if (sortBy === "date") {
          return sortOrder === "asc"
            ? new Date(a?.updatedAt || 0).getTime() - new Date(b?.updatedAt || 0).getTime()
            : new Date(b?.updatedAt || 0).getTime() - new Date(a?.updatedAt || 0).getTime()
        } else {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });
  }, [todos, statusFilter, sortBy, sortOrder]);

  // Then use useMemo with the pre-defined callbacks
  const todoActions = useMemo(
    () => ({
      addTodo,
      editTodo,
      deleteTodo,
    }),
    [addTodo, editTodo, deleteTodo],
  );

  const contextValue = useMemo(
    () => ({
      user,
      todos: filteredAndSortedTodos,
      statusFilter,
      sortBy,
      sortOrder,
      setUser,
      setStatusFilter,
      setSortBy,
      setSortOrder,
      todoActions,
    }),
    [user, todos, statusFilter, sortBy, sortOrder, todoActions],
  );

  return <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>;
};

// Create a custom hook to use the todo context
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
