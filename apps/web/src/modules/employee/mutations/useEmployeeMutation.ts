import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { Employee } from "@/types";

export type NewEmployee = Omit<Employee, "id"> & { order: number };

export const useAddEmployeeMutation = () => {
  return useMutation({
    mutationKey: ["addEmployee"],

    mutationFn: async (employee: NewEmployee) => {
      const response = await api.employee.add.$post({
        json: employee,
      });

      if (!response.ok) {
        throw new Error("Failed to add employee");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEmployees"],
      });

      toast.success("Successfully added");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  return useMutation({
    mutationKey: ["updateEmployeeById"],

    mutationFn: async (employee: Employee) => {
      const { id, ...rest } = employee;

      await api.employee[":id"].$put({
        param: { id: String(id) },
        json: { ...rest, order: rest.order ?? 1 },
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

export const useDeleteEmployeeMutation = () => {
  return useMutation({
    mutationKey: ["deleteEmployee"],
    mutationFn: async (employeeId: string) => {
      await api.employee[":id"].$delete({ param: { id: employeeId } });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEmployees"],
      });
      toast.success("Successfully deleted the employee.");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateOrders = () => {
  return useMutation({
    mutationKey: ["updateEmployeesOrder"],
    mutationFn: async (body: { id: string; order: string }[]) => {
      await api.employee.order.update.$put({ json: body });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getEmployees"],
      });
    },
  });
};
