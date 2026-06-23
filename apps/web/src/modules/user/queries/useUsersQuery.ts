import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

async function fetchUsers() {
  const response = await api.user.$get();

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  return response.json();
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}
