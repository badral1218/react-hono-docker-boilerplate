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

const TAG_PALETTE = [
  {
    bg: "bg-teal-400/10",
    ring: "ring-teal-400/25",
    text: "text-teal-300",
    solid: "bg-teal-400/20",
  },
  {
    bg: "bg-indigo-400/10",
    ring: "ring-indigo-400/25",
    text: "text-indigo-300",
    solid: "bg-indigo-400/20",
  },
  {
    bg: "bg-amber-400/10",
    ring: "ring-amber-400/25",
    text: "text-amber-300",
    solid: "bg-amber-400/20",
  },
  {
    bg: "bg-rose-400/10",
    ring: "ring-rose-400/25",
    text: "text-rose-300",
    solid: "bg-rose-400/20",
  },
  {
    bg: "bg-violet-400/10",
    ring: "ring-violet-400/25",
    text: "text-violet-300",
    solid: "bg-violet-400/20",
  },
  {
    bg: "bg-sky-400/10",
    ring: "ring-sky-400/25",
    text: "text-sky-300",
    solid: "bg-sky-400/20",
  },
] as const;

export const tagFor = (seed: string) => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return TAG_PALETTE[hash % TAG_PALETTE.length];
};

export const initialsFor = (first: string, last: string) => {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
};
