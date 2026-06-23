import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./api";
import { queryClient } from "./queryClient";

const fetchCurrentUser = async () => {
  const response = await api.auth.me.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  return response.json();
};

export const authQuery = {
  queryKey: ["currentUser"],
  queryFn: fetchCurrentUser,
  staleTime: 5 * 1000,
  retry: false,
};

export type LoginPayload = Parameters<typeof api.auth.signin.$post>[0]["json"];

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }: LoginPayload) => {
      const response = await api.auth.signin.$post({
        json: { email, password },
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(
          ("message" in json && json.message) || "Login failed. Please check your credentials.",
        );
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQuery.queryKey });
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await api.auth.signout.$post();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authQuery.queryKey });
    },
  });
};

export const useCurrentUser = () => useQuery(authQuery);
