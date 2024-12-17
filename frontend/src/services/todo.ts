import { authService } from "./auth";
import { Todo } from "../types";

const ENDPOINT = `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/api/v1/todo`;

export const todoService = {
    addTodo: (data: Omit<Todo, "uuid">): Promise<Todo> => {
        return new Promise((resolve, reject) =>
            fetch(ENDPOINT + "/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authService.getCurrentUser()?.token ?? "",
                },
                body: JSON.stringify({
                    ...data,
                    dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
                }),
            })
                .then(async (res) => {
                    const data = await res.json();

                    if (!res.ok) throw new Error(data?.message);
                    return data;
                })
                .then((data) =>
                    resolve({
                        ...data.todo,
                        dueDate: data.todo?.dueDate
                            ? new Date(data.todo.dueDate)
                            : undefined,
                    }),
                )
                .catch((e) => reject(new Error(e?.message ?? "Something went wrong"))),
        );
    },

    updateTodo: (data: Partial<Todo>): Promise<Todo> => {
        return new Promise((resolve, reject) =>
            fetch(ENDPOINT + "/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authService.getCurrentUser()?.token ?? "",
                },
                body: JSON.stringify({
                    ...data,
                    dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
                }),
            })
                .then(async (res) => {
                    const data = await res.json();

                    if (!res.ok) throw new Error(data?.message);
                    return data;
                })
                .then((data) =>
                    resolve({
                        ...data.todo,
                        dueDate: data.todo?.dueDate
                            ? new Date(data.todo.dueDate)
                            : undefined,
                    }),
                )
                .catch((e) => reject(new Error(e?.message ?? "Something went wrong"))),
        );
    },

    deleteTodo: (id: string): Promise<boolean> => {
        return new Promise((resolve, reject) =>
            fetch(ENDPOINT + ("/delete?id=" + id), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authService.getCurrentUser()?.token ?? "",
                },
            })
                .then(async (res) => {
                    const data = await res.json();

                    if (!res.ok) throw new Error(data?.message);
                    return data;
                })
                .then((data) => resolve(!!data?.success))
                .catch((e) => reject(new Error(e?.message ?? "Something went wrong"))),
        );
    },

    getTodos: (id?: string): Promise<Todo[]> => {
        return new Promise((resolve, reject) =>
            fetch(ENDPOINT + (!!id ? `/todos?id=${id}` : "/todos"), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authService.getCurrentUser()?.token ?? "",
                },
            })
                .then(async (res) => {
                    const data = await res.json();

                    if (!res.ok) throw new Error(data?.message);
                    return data;
                })
                .then((data) =>
                    resolve(
                        data.todo.map((t: Todo) => ({
                            ...t,
                            dueDate: t?.dueDate ? new Date(t.dueDate) : undefined,
                        })),
                    ),
                )
                .catch((e) => reject(new Error(e?.message ?? "Something went wrong"))),
        );
    },
};
