import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import { createAppQueryClient } from "@/lib/app-query-client";
import { AppRouterProvider, createAppRouter } from "@/lib/app-router";
import { installRateLimitHandler } from "@/lib/rate-limit-tracker";

installRateLimitHandler();

const queryClient = createAppQueryClient();
const router = createAppRouter({ queryClient });

function App() {
  return (
    <StrictMode>
      <AppRouterProvider router={router} />
    </StrictMode>
  );
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(<App />);
} else {
  ReactDOM.hydrateRoot(rootElement, <App />);
}
