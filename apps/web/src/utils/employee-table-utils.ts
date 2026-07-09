import { createColumnHelper, type RowData } from "@tanstack/react-table";
import { TAG_PALETTE } from "@/constants";
import type { Employee } from "@/types";

export const columnHelper = createColumnHelper<Employee>();

export const employeeColumns = [
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
  columnHelper.accessor("birthdate", {
    header: "Birthdate",
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
    birthdate: "",
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

export const tagFor = (seed: string) => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_PALETTE[hash % TAG_PALETTE.length];
};

export const initialsFor = (first: string, last: string) => {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
};
