import { createFileRoute } from "@tanstack/react-router";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { EmployeeRow } from "@/components/employee/EmployeeRow";
import { ErrorState } from "@/components/employee/ErrorState";
import { LoadingState } from "@/components/employee/LoadingState";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRowEditing } from "@/hooks/use-row-editing";
import {
  useAddEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateOrders,
} from "@/modules/employee/mutations/useEmployeeMutation";
import { useEmployeesQuery } from "@/modules/employee/queries/useEmployeesQuery";
import type { Employee } from "@/types";
import { createNewEmployeeData, employeeColumns } from "@/utils/employee-table-utils";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data, isLoading, error } = useEmployeesQuery();

  const [tableData, setTableData] = useState<Employee[]>(data?.employees ?? []);

  useEffect(() => {
    if (data?.employees) {
      setTableData(data.employees);
    }
  }, [data]);

  const editing = useRowEditing<Employee>();

  const deleteEmployee = useDeleteEmployeeMutation();
  const updateEmployee = useUpdateEmployeeMutation();
  const addEmployee = useAddEmployeeMutation();
  const updateEmployeesOrder = useUpdateOrders();

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

  const handleCancelEditing = () => {
    if (editing.value?.id === -1) {
      setTableData((old) => old.filter((row) => row.id !== -1));
    }

    editing.cancel();
  };

  const handleSaveEditing = () => {
    if (!editing.value) {
      return;
    }

    if (editing.value.id === -1) {
      const { id: _id, ...rest } = editing.value;

      addEmployee.mutate(
        {
          ...rest,
          order: rest.order ?? tableData.length,
          age: Number(rest.age),
        },
        {
          onSuccess: () => {
            setTableData((old) => old.filter((row) => row.id !== -1));
            editing.cancel();
          },
        },
      );

      return;
    }

    updateEmployee.mutate(editing.value, {
      onSuccess: editing.cancel,
    });
  };

  const handleAddEmployee = () => {
    if (editing.rowId) {
      return;
    }

    const newEmployee = createNewEmployeeData((data?.employees.length ?? 0) + 1);

    setTableData((old) => [newEmployee, ...old]);
    editing.start("0", newEmployee);
  };

  const handleDelete = (employeeId: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee.mutate(String(employeeId));
    }
  };

  const insertRowAt = async (fromOrder: number) => {
    const shiftedRows = tableData.slice(fromOrder - 1);
    const reorderPayload = shiftedRows.map(({ id, order }) => ({
      id: String(id),
      order: String(order),
    }));

    updateEmployeesOrder.mutate(reorderPayload);

    const { id: _id, ...newEmployee } = createNewEmployeeData(fromOrder);
    addEmployee.mutate(newEmployee);
  };

  const addRowAbove = (currentOrder: number | null) => insertRowAt(currentOrder ?? 1);
  const addRowBelow = (currentOrder: number | null) => insertRowAt((currentOrder ?? 1) + 1);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  const total = data?.employees.length ?? 0;

  return (
    <main className="min-h-screen bg-[#0A0D12] text-[#E7EAF0] font-['Inter',ui-sans-serif,sans-serif]">
      <style>{`
        @keyframes row-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        .row-anim { animation: row-in .35s ease-out both; animation-delay: var(--delay, 0ms); }
        @media (prefers-reduced-motion: reduce) { .row-anim { animation: none !important; } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <div className="mx-auto max-w-7xl px-8 py-12">
        <header className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#4FD8C4] font-['JetBrains_Mono',ui-monospace,monospace]">
              Team directory
            </p>
            <h1 className="text-4xl font-semibold tracking-tight font-['Space_Grotesk',ui-sans-serif,sans-serif]">
              Employee management
            </h1>
            <p className="mt-2 text-[#8891A4]">
              Manage your organization's employees from one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#232A36] bg-[#10141B] px-4 py-2">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#4FD8C4]" />
            </span>
            <Users size={14} className="text-[#8891A4]" />
            <span className="text-sm font-['JetBrains_Mono',ui-monospace,monospace] text-[#E7EAF0]">
              {total} {total === 1 ? "employee" : "employees"}
            </span>
          </div>
        </header>

        <div className="relative rounded-2xl border border-[#232A36] bg-[#10141B] shadow-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#4FD8C4]/40 to-transparent" />

          <div className="flex items-center justify-between border-b border-[#232A36] px-4 py-3">
            <h2 className="text-sm font-medium uppercase tracking-wider text-[#8891A4] font-['JetBrains_Mono',ui-monospace,monospace]">
              Employees
            </h2>
            <Button
              className="cursor-pointer bg-[#4FD8C4] text-[#04342C] hover:bg-[#3fc4b1]"
              onClick={handleAddEmployee}
              disabled={!!editing.rowId}
            >
              <Plus size={16} />
              Add Employee
            </Button>
          </div>

          <Table>
            <TableHeader className="sticky top-0 z-10 bg-[#10141B]/90 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-[#232A36] hover:bg-transparent">
                  <TableHead className="h-12 w-14 border-[#232A36] pl-4 text-[11px] font-medium uppercase tracking-wider text-[#8891A4] font-['JetBrains_Mono',ui-monospace,monospace]">
                    #
                  </TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-12 border-[#232A36] text-[11px] font-medium uppercase tracking-wider text-[#8891A4] font-['JetBrains_Mono',ui-monospace,monospace]"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                  <TableHead className="h-12 border-[#232A36] text-[11px] font-medium uppercase tracking-wider text-[#8891A4] font-['JetBrains_Mono',ui-monospace,monospace]">
                    Reorder
                  </TableHead>
                  <TableHead className="h-12 border-[#232A36] text-[11px] font-medium uppercase tracking-wider text-[#8891A4] font-['JetBrains_Mono',ui-monospace,monospace] pr-4">
                    Actions
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <EmployeeRow
                  key={row.id}
                  row={row}
                  index={index}
                  isEditing={Number(editing.rowId) === row.original.id}
                  editingValue={editing.value}
                  onEditingValueChange={editing.updateValue}
                  onStartEdit={() => editing.start(row.id, row.original)}
                  onCancelEdit={handleCancelEditing}
                  onSaveEdit={handleSaveEditing}
                  isSaving={addEmployee.isPending || updateEmployee.isPending}
                  onAddAbove={() => addRowAbove(row.original.order)}
                  onAddBelow={() => addRowBelow(row.original.order)}
                  onDelete={() => handleDelete(row.original.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-[#8891A4]">
          <span>
            Total employees:{" "}
            <span className="font-medium text-[#E7EAF0] font-['JetBrains_Mono',ui-monospace,monospace]">
              {total}
            </span>
          </span>
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-xs uppercase tracking-wider">
            Internal dashboard
          </span>
        </div>
      </div>
    </main>
  );
}
