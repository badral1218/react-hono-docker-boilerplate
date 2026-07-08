import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const getEmployees = async () => {
  try {
    const response = await api.employee.$get();
    if (!response.ok) {
      throw new Error(`Failed to fetch employees: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const useEmployeesQuery = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });
};
