import { useState } from "react";

export const useRowEditing = <T extends { id: number }>() => {
  const [rowId, setRowId] = useState("");
  const [value, setValue] = useState<T | null>(null);

  return {
    rowId,
    value,
    start: (id: string, original: T) => {
      setRowId(id);
      setValue(original);
    },
    cancel: () => {
      setRowId("");
      setValue(null);
    },
    updateValue: (columnId: string, newValue: string) => {
      setValue((prev) => (prev ? { ...prev, [columnId]: newValue } : prev));
    },
  };
};
