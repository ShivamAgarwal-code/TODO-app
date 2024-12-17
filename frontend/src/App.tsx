"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

import { DarkModeToggle } from "./components/ThemeToggle";
import { AddTodoForm } from "./components/AddTodoForm";
import { FilterArea } from "./components/FilterArea";
import { AuthModal } from "./components/AuthModal";
import { TextLoop } from "./components/TextLoop";
import { TodoCard } from "./components/TodoCard";
import { authService } from "./services/auth";
import { useTodo } from "./contexts/todo";
import { User } from "./types";

export default function Home() {
  const { user, todos, setUser, todoActions } = useTodo();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Handler for successful authentication
  const handleAuthSuccess = (user: User) => {
    setUser(user);
    setIsAuthModalOpen(false);
  };

  // Handler for user logout
  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Todo App
            </h1>
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              {user ? (
                <>
                  <p className="text-gray-600 dark:text-gray-300">
                    Welcome, {user.username}!
                  </p>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </motion.div>

          {user ? (
            <>
              <FilterArea />

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                transition={{ duration: 0.5, delay: 0.2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AddTodoForm addTodo={todoActions.addTodo} />
                <AnimatePresence>
                  {todos.map((todo, index) => (
                    <TodoCard
                      key={index}
                      todo={todo}
                      index={index}
                      actions={todoActions}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Organize Your Life with Our Todo App
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Stay on top of your tasks, manage your time effectively, and boost your
                productivity.
              </p>
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 blur-sm">
                  {todos.map((todo, index) => (
                    <div
                      key={todo.uuid}
                      className={`p-4 rounded-2xl shadow-lg ${
                        index % 2 === 0
                          ? "bg-purple-100 dark:bg-purple-900"
                          : "bg-green-100 dark:bg-green-900"
                      }`}
                    >
                      <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                        {todo.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {todo.status}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Unlock Full Access
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Sign up now to start organizing your tasks and boosting your
                      productivity!
                    </p>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <TextLoop
                        children={["Sign Up Now", "Login Now"]}
                        transition={{ duration: 0.5 }}
                        interval={5}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>
            Made with ❤️ by Niiquaye Divine Ibok |{" "}
            <a
              href="https://github.com/divineniiquaye"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
