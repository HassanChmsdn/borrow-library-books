import { Boxes } from "lucide-react";

import { AdminFilterSelect, AdminSearchBar } from "@/components/admin";

import type { AdminInventoryStatusFilter } from "../types";

interface InventoryToolbarProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: AdminInventoryStatusFilter) => void;
  searchValue: string;
  statusOptions: ReadonlyArray<{
    label: string;
    value: AdminInventoryStatusFilter;
  }>;
  statusValue: AdminInventoryStatusFilter;
}

function InventoryToolbar({
  onSearchChange,
  onStatusChange,
  searchValue,
  statusOptions,
  statusValue,
}: Readonly<InventoryToolbarProps>) {
  return (
    <>
      <AdminSearchBar
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        label="Search inventory copies"
        placeholder="Search copy code, title, or author..."
      />
      <AdminFilterSelect
        label="Status"
        leadingIcon={<Boxes aria-hidden="true" className="size-4" />}
        options={statusOptions}
        value={statusValue}
        onValueChange={onStatusChange}
      />
    </>
  );
}

export { InventoryToolbar, type InventoryToolbarProps };