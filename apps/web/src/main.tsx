import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import { queryClient } from "./lib/queryClient";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const main = () => {
  const rootElement = document.getElementById("root");

  if (rootElement == null) {
    console.error("Root element not found");
    return;
  }

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
};

main();
