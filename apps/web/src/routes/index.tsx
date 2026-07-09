import { createFileRoute } from "@tanstack/react-router";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { EmployeeRow } from "@/components/employee/EmployeeRow";
import { ErrorState } from "@/components/employee/ErrorState";
import { LoadingState } from "@/components/employee/LoadingState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const [sorting, setSorting] = useState<SortingState>([]);

  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    if (!data?.employees) {
      return;
    }

    setTableData((old) => {
      const draft = old.find((row) => row.id === -1);
      if (!draft) {
        return data.employees;
      }

      const insertIndex = Math.max(0, (draft.order ?? 1) - 1);
      const next = [...data.employees];
      next.splice(insertIndex, 0, draft);
      return next;
    });
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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
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
    void insertRowAt(1);
  };

  const handleDelete = (employeeId: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee.mutate(String(employeeId));
    }
  };

  const insertRowAt = async (fromOrder: number) => {
    if (editing.rowId) {
      return;
    }

    const newEmployee = createNewEmployeeData(fromOrder);
    const shiftedRows = tableData.filter((row) => row.id !== -1).slice(fromOrder - 1);
    const reorderPayload = shiftedRows.map(({ id, order }) => ({
      id: String(id),
      order: String(order),
    }));

    setTableData((old) => {
      const withoutDraft = old.filter((row) => row.id !== -1);
      const next = [...withoutDraft];
      next.splice(fromOrder - 1, 0, newEmployee);
      return next;
    });
    editing.start(String(fromOrder - 1), newEmployee);

    if (reorderPayload.length === 0) {
      return;
    }

    try {
      await updateEmployeesOrder.mutateAsync(reorderPayload);
    } catch {
      handleCancelEditing();
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  const total = data?.employees.length ?? 0;

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-[#1A1D23] font-['Inter',ui-sans-serif,sans-serif]">
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
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#0F8C7C] font-['JetBrains_Mono',ui-monospace,monospace]">
              Team directory
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[#111318] font-['Space_Grotesk',ui-sans-serif,sans-serif]">
              Employee management
            </h1>
            <p className="mt-2 text-[#6B7280]">
              Manage your organization's employees from one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#E2E5EA] bg-white px-4 py-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#0F8C7C]" />
            </span>
            <Users size={14} className="text-[#6B7280]" />
            <span className="text-sm font-['JetBrains_Mono',ui-monospace,monospace] text-[#1A1D23]">
              {total} {total === 1 ? "employee" : "employees"}
            </span>
          </div>
        </header>

        <div className="relative rounded-2xl border border-[#E2E5EA] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_4px_16px_rgba(16,24,40,0.06)] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#0F8C7C]/40 to-transparent" />

          <div className="flex items-center justify-between border-b border-[#E2E5EA] bg-[#FAFBFC] px-4 py-3">
            <div className="flex gap-3 items-center">
              <h2 className="text-sm font-medium uppercase tracking-wider text-[#6B7280] font-['JetBrains_Mono',ui-monospace,monospace]">
                Employees
              </h2>
              <Input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                placeholder="Search all columns..."
                className="border-[#E2E5EA] bg-white text-[#1A1D23] placeholder:text-[#9AA2B1] focus-visible:ring-[#0F8C7C]/40"
              />
            </div>
            <Button
              className="cursor-pointer bg-[#0F8C7C] text-white hover:bg-[#0C7365]"
              onClick={handleAddEmployee}
              disabled={!!editing.rowId}
            >
              <Plus size={16} />
              Add Employee
            </Button>
          </div>

          <Table>
            <TableHeader className="sticky top-0 z-10 bg-[#FAFBFC]/95 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-[#E2E5EA] hover:bg-transparent">
                  <TableHead className="h-12 w-14 border-[#E2E5EA] pl-4 text-[11px] font-medium uppercase tracking-wider text-[#6B7280] font-['JetBrains_Mono',ui-monospace,monospace]">
                    #
                  </TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      onClick={header.column.getToggleSortingHandler()}
                      data-sort={header.column.getCanSort()}
                      key={header.id}
                      className="h-12 border-[#E2E5EA] text-[11px] data-[sort=true]:cursor-pointer data-[sort=true]:hover:bg-[#0F8C7C]/8 font-medium uppercase tracking-wider text-[#6B7280] font-['JetBrains_Mono',ui-monospace,monospace]"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="ml-2 text-xs">
                          {header.column.getIsSorted() === "asc"
                            ? "↑"
                            : header.column.getIsSorted() === "desc"
                              ? "↓"
                              : ""}
                        </span>
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="h-12 border-[#E2E5EA] text-[11px] font-medium uppercase tracking-wider text-[#6B7280] font-['JetBrains_Mono',ui-monospace,monospace] pr-4">
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
                  isEditing={editing.rowId === row.id}
                  editingValue={editing.value}
                  onEditingValueChange={editing.updateValue}
                  onStartEdit={() => editing.start(row.id, row.original)}
                  onCancelEdit={handleCancelEditing}
                  onSaveEdit={handleSaveEditing}
                  isSaving={addEmployee.isPending || updateEmployee.isPending}
                  onDelete={() => handleDelete(row.original.id)}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-[#6B7280]">
          <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-xs uppercase tracking-wider">
            Internal dashboard
          </span>
        </div>
      </div>
    </main>
  );
}
