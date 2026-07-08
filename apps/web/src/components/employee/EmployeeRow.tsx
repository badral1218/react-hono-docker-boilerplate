import { flexRender, type Row } from "@tanstack/react-table";
import { Check, Edit2, Trash2, X } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Employee } from "@/types";
import { initialsFor, tagFor } from "@/utils/employee-table-utils";

type EmployeeRowProps = {
  row: Row<Employee>;
  index: number;
  isEditing: boolean;
  editingValue: Employee | null;
  onEditingValueChange: (columnId: string, value: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  isSaving: boolean;
  onDelete: () => void;
};

const EDITABLE_COLUMNS: Array<keyof Employee> = [
  "email",
  "firstName",
  "lastName",
  "age",
  "position",
  "department",
  "phoneNumber",
];

export const EmployeeRow = ({
  row,
  index,
  isEditing,
  editingValue,
  onEditingValueChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  isSaving,
  onDelete,
}: EmployeeRowProps) => {
  const employee = row.original;
  const tag = tagFor(`${employee.firstName ?? ""}${employee.lastName ?? ""}`);
  const orderLabel = String(employee.order ?? index + 1).padStart(2, "0");

  return (
    <TableRow
      className="row-anim border-[#232A36] group transition-colors hover:bg-[#141922]"
      style={{ "--delay": `${Math.min(index, 12) * 30}ms` } as CSSProperties}
    >
      <TableCell className="w-14 pl-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-6 min-w-6 items-center justify-center rounded px-1 text-[11px] font-medium ring-1 ${tag?.bg} ${tag?.text} ${tag?.ring} font-['JetBrains_Mono',ui-monospace,monospace]`}
          >
            {orderLabel}
          </span>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tag?.solid} ${tag?.text}`}
            aria-hidden="true"
          >
            {initialsFor(employee.firstName, employee.lastName)}
          </span>
        </div>
      </TableCell>

      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="py-4 text-[#E7EAF0]">
          {isEditing && EDITABLE_COLUMNS.includes(cell.column.id as keyof Employee) ? (
            <Input
              value={String(editingValue?.[cell.column.id as keyof Employee] ?? "")}
              onChange={(e) => onEditingValueChange(cell.column.id, e.target.value)}
              className="h-9 border-[#232A36] bg-[#0A0D12] text-[#E7EAF0] focus-visible:ring-2 focus-visible:ring-[#4FD8C4]/40 focus-visible:border-[#4FD8C4]/60"
            />
          ) : (
            <span
              className={
                cell.column.id === "email"
                  ? "text-[#8891A4] font-['JetBrains_Mono',ui-monospace,monospace] text-[13px]"
                  : cell.column.id === "age"
                    ? "text-[#8891A4] font-['JetBrains_Mono',ui-monospace,monospace] text-[13px]"
                    : ""
              }
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </span>
          )}
        </TableCell>
      ))}

      <TableCell className="w-28 pr-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 cursor-pointer border border-[#232A36] bg-transparent hover:bg-[#141922]"
              onClick={onCancelEdit}
              aria-label="Cancel edit"
            >
              <X className="text-white" size={16} />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 cursor-pointer bg-[#4FD8C4] text-[#04342C] hover:bg-[#3fc4b1]"
              onClick={onSaveEdit}
              disabled={isSaving}
              aria-label="Save changes"
            >
              <Check size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={onStartEdit}
              aria-label="Edit employee"
              className="rounded p-1.5 text-[#8891A4] transition-colors hover:bg-[#4FD8C4]/10 hover:text-[#4FD8C4] cursor-pointer"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete employee"
              className="rounded p-1.5 text-[#8891A4] transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
