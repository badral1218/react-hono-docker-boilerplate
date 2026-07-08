import { createColumnHelper } from "@tanstack/react-table";
import type { Employee } from "@/types";

export const columnHelper = createColumnHelper<Employee>();

export const employeeColumns = [
  columnHelper.accessor("id", {
    header: "ID",
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
];
