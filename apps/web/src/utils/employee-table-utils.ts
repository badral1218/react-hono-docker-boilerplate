import { createColumnHelper, type RowData } from "@tanstack/react-table";
import type { Employee } from "@/types";

export const columnHelper = createColumnHelper<Employee>();

export const employeeColumns = [
  columnHelper.accessor("order", {
    header: "No",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("firstName", {
    header: "First name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("lastName", {
    header: "Last name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("age", {
    header: "Age",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("position", {
    header: "Position",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("department", {
    header: "Department",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone Number",
    cell: (info) => info.getValue(),
  }),
];

export const createNewEmployeeData = (order: number) => {
  return {
    id: -1,
    firstName: "",
    lastName: "",
    age: 0,
    email: "",
    order,
    position: "",
    phoneNumber: "",
    department: "",
  };
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
