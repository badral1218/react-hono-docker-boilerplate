import { createFileRoute } from "@tanstack/react-router";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEmployeesQuery } from "@/modules/employee/queries/useEmployeesQuery";

import { employeeColumns } from "@/utils/employee-table-utils";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const { data, isLoading, error } = useEmployeesQuery();

  const table = useReactTable({
    columns: employeeColumns,
    data: data?.employees ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Employee Management</h1>

          <p className="mt-2 text-zinc-400">Manage your organization's employees from one place.</p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-2xl backdrop-blur">
          <Table>
            <TableHeader className="sticky top-0 bg-zinc-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-zinc-800 hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-14 border-zinc-800 text-zinc-300 font-semibold"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={`
                    border-zinc-800
                    transition-colors
                    hover:bg-zinc-800/70
                    ${index % 2 === 0 ? "bg-zinc-900/30" : "bg-zinc-900/60"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 text-zinc-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
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
