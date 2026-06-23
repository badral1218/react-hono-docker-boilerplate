import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";
import { authQuery } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    try {
      await queryClient.fetchQuery(authQuery);
      throw redirect({ to: "/users" });
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      throw redirect({ to: "/login" });
    }
  },
  component: () => null,
});
