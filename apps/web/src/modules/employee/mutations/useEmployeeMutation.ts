import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { Employee } from "@/types";

export const useUpdateEmployeeMutation = () => {
  return useMutation({
    mutationKey: ["updateEmployeeById"],

    mutationFn: async (employee: Employee) => {
      const { id, ...rest } = employee;

      await api.employee[":id"].$put({
        param: { id: String(id) },
        json: rest,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEmployees"],
      });

      toast.success("Successfully updated");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};
