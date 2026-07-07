import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Check, Edit2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUpdateEmployeeMutation } from "@/modules/employee/mutations/useEmployeeMutation";
import { useEmployeesQuery } from "@/modules/employee/queries/useEmployeesQuery";
import type { Employee } from "@/types";
import { createNewEmployeeData, employeeColumns } from "@/utils/employee-table-utils";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data, isLoading, error } = useEmployeesQuery();

  const [tableData, setTableData] = useState<Employee[]>(data?.employees ?? []);

  const [editingRowId, setEditingRowId] = useState("");

  const [editingValue, setEditingValue] = useState<Employee | null>(null);

  const updateEmployee = useUpdateEmployeeMutation();

  const table = useReactTable({
    columns: employeeColumns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setTableData((old) =>
          old.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)),
        );
      },
    },
  });

  const handleSaveEditing = async () => {
    if (editingValue) {
      updateEmployee.mutate(editingValue);
      setEditingRowId("");
      setEditingValue(null);
    }
  };

  const addRowAbove = (currentOrder: number | null) => {
    const order = currentOrder ?? 1;

    const abovePart = tableData.slice(0, order - 1);

    const newRow = createNewEmployeeData(order);

    const lastPart = tableData.slice(order - 1).map((data) => {
      data.order = data.order ? data.order + 1 : null;

      return data;
    });

    const newData = [...abovePart, newRow, ...lastPart];

    setTableData(newData);
  };

  const addRowBelow = (currentOrder: number | null) => {
    const order = currentOrder ?? 1;

    const firstPart = tableData.slice(0, order);

    const newRow = createNewEmployeeData(order + 1);

    const lastPart = tableData.slice(order);

    const newData = [...firstPart, newRow, ...lastPart];

    setTableData(newData);
  };

  useEffect(() => {
    if (data?.employees) {
      setTableData(data.employees);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 text-lg animate-pulse">Loading employees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-6">
          <h2 className="text-red-400 font-semibold mb-2">Something went wrong</h2>
          <p className="text-zinc-300">{error.message}</p>
        </div>
      </div>
    );
  }

  const editableCells = ["email", "firstName", "lastName", "birthday", "age", "position"];

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Employee Management</h1>

          <p className="mt-2 text-zinc-400">Manage your organization's employees from one place.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-2xl backdrop-blur overflow-hidden">
          <Table>
            <TableHeader className="sticky top-0 bg-zinc-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-zinc-800 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-14 border-zinc-800 text-zinc-300 font-semibold first:pl-4"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}

                  <TableHead className="h-14 border-zinc-800 text-zinc-300 font-semibold">
                    Action
                  </TableHead>
                  <TableHead className="h-14 border-zinc-800 text-zinc-300 font-semibold pr-4">
                    Edit
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`
                    border-zinc-800 group
                    transition-colors
                    hover:bg-zinc-800/70 relative
                    ${index % 2 === 0 ? "bg-zinc-900/30" : "bg-zinc-900/60"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 text-zinc-200 first:pl-4">
                      {row.id === editingRowId && editableCells.includes(cell.column.id) ? (
                        <Input
                          value={editingValue?.[cell.column.id as keyof Employee] ?? ""}
                          onChange={(e) =>
                            setEditingValue((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    [cell.column.id]: e.target.value,
                                  }
                                : prev,
                            )
                          }
                        />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}

                  <TableCell className="w-12 pr-4">
                    <div className="flex gap-4">
                      <ArrowUp
                        onClick={() => addRowAbove(row.original.order)}
                        className="hover:cursor-pointer"
                        size={20}
                      />
                      <ArrowDown
                        onClick={() => addRowBelow(row.original.order)}
                        className="hover:cursor-pointer"
                        size={20}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="w-12 pr-4">
                    {editingRowId === row.id ? (
                      <div className="flex gap-2 items-center">
                        <Button
                          variant={"secondary"}
                          className={"hover:cursor-pointer"}
                          onClick={() => {
                            setEditingRowId("");
                            setEditingValue(null);
                          }}
                        >
                          <X size={16} />
                        </Button>
                        <Button
                          className={"hover:cursor-pointer bg-green-500 hover:bg-green-600"}
                          onClick={handleSaveEditing}
                          disabled={updateEmployee.isPending}
                        >
                          <Check size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant={"secondary"}
                        className={"hover:cursor-pointer"}
                        onClick={() => {
                          setEditingRowId(row.id);
                          setEditingValue(row.original);
                        }}
                      >
                        <Edit2 size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Footer */}
        <div className="mt-5 flex items-center justify-between text-sm text-zinc-500">
          <span>
            Total Employees:{" "}
            <span className="font-semibold text-zinc-300">{data?.employees.length ?? 0}</span>
          </span>

          <span>Internal Dashboard</span>
        </div>
      </div>
    </main>
  );
}
