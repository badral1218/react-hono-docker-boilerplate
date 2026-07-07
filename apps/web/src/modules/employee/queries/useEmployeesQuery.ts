import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const getEmployees = async () => {
  const response = await api.employee.$get();

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status}`);
  }

  return response.json();
};

export const useEmployeesQuery = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
};
