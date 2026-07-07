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
  columnHelper.accessor("birthday", {
    header: "Birthday",
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
];

export const createNewEmployeeData = (order: number) => {
  return {
    id: 0,
    firstName: "",
    lastName: "",
    age: 0,
    birthday: "",
    email: "",
    order,
    position: "",
  };
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
