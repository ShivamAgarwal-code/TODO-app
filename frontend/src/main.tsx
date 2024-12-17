import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { StrictMode } from "react";

import "./index.css";
import App from "./App";
import { TodoProvider } from "./contexts/todo";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodoProvider>
      <App />
      <Toaster position="top-center" />
    </TodoProvider>
  </StrictMode>,
);
