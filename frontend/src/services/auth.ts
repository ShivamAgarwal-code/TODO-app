import { User } from "../types";

let currentUser: User | null = null;
const ENDPOINT = `${import.meta.env?.VITE_PUBLIC_API_BASE_URL}/api/v1/auth`;

export const authService = {
    login: (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) =>
            fetch(ENDPOINT + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })
                .then(async (res) => {
                    const data = await res.json();
                    currentUser = data;

                    if (!res.ok) throw new Error(data?.message);
                    return data;
                })
                .then((data) => {
                    resolve(data);
                    localStorage.setItem("__AUTH__", JSON.stringify(data));
                })
                .catch((e) => {
                    reject(new Error(e?.message ?? "Invalid credentials"));
                }),
        );
    },

    register: (username: string, email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) =>
            fetch(ENDPOINT + "/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            })
                .then(async (res) => {
                    const data = await res.json();
                    currentUser = data;

                    if (!res.ok) throw new Error(data?.message);
                    return data;
                })
                .then((data) => {
                    resolve(data);
                    localStorage.setItem("__AUTH__", JSON.stringify(data));
                })
                .catch((e) => {
                    reject(
                        new Error(
                            e?.message ?? "Something went wrong, please try again.",
                        ),
                    );
                }),
        );
    },

    logout: (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                currentUser = null;
                localStorage.removeItem("__AUTH__");
                resolve();
            }, 500);
        });
    },

    getCurrentUser: (): User | null => {
        return currentUser ?? localStorage.getItem("__AUTH__")
            ? JSON.parse(localStorage.getItem("__AUTH__") as string)
            : null;
    },
};
