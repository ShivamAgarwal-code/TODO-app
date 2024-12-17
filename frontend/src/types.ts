export type TodoStatus = "COMPLETED" | "PENDING" | "IN_PROGRESS";

export interface Todo {
    uuid: string;
    title: string;
    description?: string;
    status: TodoStatus;
    dueDate?: Date;
    updatedAt?: string;
}

export interface User {
    id: string;
    username: string;
    token: string;
}

export interface TodoActions {
    addTodo: (todo: Omit<Todo, "uuid">) => void;
    editTodo: (updates: Partial<Todo>) => void;
    deleteTodo: (id: string) => void;
}
