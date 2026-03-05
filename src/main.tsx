import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { Provider as JotaiProvider } from "jotai";
import { router } from "./App";
import "./index.css";
import { scheduleTokenExpiry } from "./sdk";

const queryClient = new QueryClient();
scheduleTokenExpiry();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </JotaiProvider>
      <ToastProvider placement="top-right" />
    </HeroUIProvider>
  </StrictMode>,
);
