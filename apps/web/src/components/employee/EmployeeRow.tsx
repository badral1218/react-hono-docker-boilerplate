import { flexRender, type Row } from "@tanstack/react-table";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Check, Edit2, Trash2, X } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Employee } from "@/types";
import { initialsFor, tagFor } from "@/utils/employee-table-utils";
import { Calendar } from "../ui/calendar";

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
  "birthdate",
  "position",
  "department",
  "phoneNumber",
];

const parseBirthdate = (value: unknown): Date | undefined => {
  if (!value || typeof value !== "string") return undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
};

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

  return (
    <TableRow
      className="row-anim border-[#E2E5EA] group transition-colors hover:bg-[#F6F7F9]"
      style={{ "--delay": `${Math.min(index, 12) * 30}ms` } as CSSProperties}
    >
      <TableCell className="w-14 pl-4">
        <div className="flex items-center gap-3">
          <span className={``}>{index + 1}</span>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tag?.solid} ${tag?.text}`}
            aria-hidden="true"
          >
            {initialsFor(employee.firstName, employee.lastName)}
          </span>
        </div>
      </TableCell>

      {row.getVisibleCells().map((cell) => {
        const columnId = cell.column.id as keyof Employee;
        const isBirthdateColumn = columnId === "birthdate";

        if (isEditing && EDITABLE_COLUMNS.includes(columnId)) {
          if (isBirthdateColumn) {
            const rawValue = editingValue?.birthdate;
            const selectedDate = parseBirthdate(rawValue);

            return (
              <TableCell key={cell.id} className="py-4 text-[#1A1D23]">
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="h-9 w-full justify-start border-[#E2E5EA] bg-white text-left font-normal text-[#1A1D23] hover:bg-white hover:text-[#1A1D23]"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[#6B7280]" />
                      {selectedDate ? (
                        format(selectedDate, "MMM d, yyyy")
                      ) : (
                        <span className="text-[#9AA2B1]">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) =>
                        onEditingValueChange("birthdate", date ? format(date, "yyyy-MM-dd") : "")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </TableCell>
            );
          }

          return (
            <TableCell key={cell.id} className="py-4 text-[#1A1D23]">
              <Input
                value={String(editingValue?.[columnId] ?? "")}
                onChange={(e) => onEditingValueChange(cell.column.id, e.target.value)}
                className="h-9 border-[#E2E5EA] bg-white text-[#1A1D23] focus-visible:ring-2 focus-visible:ring-[#0F8C7C]/30 focus-visible:border-[#0F8C7C]/60"
              />
            </TableCell>
          );
        }

        return (
          <TableCell key={cell.id} className="py-4 text-[#1A1D23]">
            <span
              className={
                cell.column.id === "email" || cell.column.id === "age" || isBirthdateColumn
                  ? "text-[#6B7280] font-['JetBrains_Mono',ui-monospace,monospace] text-[13px]"
                  : ""
              }
            >
              {isBirthdateColumn
                ? (() => {
                    const date = parseBirthdate(employee.birthdate);
                    return date ? format(date, "MMM d, yyyy") : "—";
                  })()
                : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </span>
          </TableCell>
        );
      })}

      <TableCell className="w-28 pr-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 cursor-pointer border border-[#E2E5EA] bg-white hover:bg-[#F6F7F9]"
              onClick={onCancelEdit}
              aria-label="Cancel edit"
            >
              <X className="text-[#1A1D23]" size={16} />
            </Button>
            <Button
              size="icon"
              className="h-8 w-8 cursor-pointer bg-[#0F8C7C] text-white hover:bg-[#0C7365]"
              onClick={onSaveEdit}
              disabled={isSaving}
              aria-label="Save changes"
            >
              <Check size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onStartEdit}
              aria-label="Edit employee"
              className="rounded p-1.5 text-[#6B7280] transition-colors hover:bg-[#0F8C7C]/10 hover:text-[#0F8C7C] cursor-pointer"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete employee"
              className="rounded p-1.5 text-[#6B7280] transition-colors hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
