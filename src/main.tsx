import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Глобальные стили подключаются раньше компонентов.
import "./index.css";
import App from "./App";
import { TooltipProvider } from "./components/Tooltip";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
);
