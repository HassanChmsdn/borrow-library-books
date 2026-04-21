"use client";

import * as React from "react";

import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function AdminTable({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="admin-table-shell"
      className="border-border-subtle rounded-xl border"
    >
      <div className="overflow-x-auto">
        <table
          data-slot="admin-table"
          className={cn("w-full min-w-xl border-collapse", className)}
          {...props}
        />
      </div>
    </div>
  );
}

function AdminTableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="admin-table-header"
      className={cn("bg-elevated", className)}
      {...props}
    />
  );
}

function AdminTableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="admin-table-body"
      className={cn("bg-card", className)}
      {...props}
    />
  );
}

function AdminTableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="admin-table-row"
      className={cn(
        "border-border-subtle [&:hover_td]:bg-elevated/70 border-b last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function AdminTableHead({ className, ...props }: React.ComponentProps<"th">) {
  const { translateText } = useI18n();

  return (
    <th
      data-slot="admin-table-head"
      className={cn(
        "text-caption text-text-tertiary px-4 py-3 text-start font-medium tracking-[0.18em] uppercase sm:px-5",
        className,
      )}
      {...props}
    >
      {translateNode(props.children, translateText)}
    </th>
  );
}

function AdminTableCell({ className, ...props }: React.ComponentProps<"td">) {
  const { translateText } = useI18n();

  return (
    <td
      data-slot="admin-table-cell"
      className={cn("px-4 py-4 align-top sm:px-5", className)}
      {...props}
    >
      {translateNode(props.children, translateText)}
    </td>
  );
}

function AdminTableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  const { translateText } = useI18n();

  return (
    <caption
      data-slot="admin-table-caption"
      className={cn(
        "text-body-sm text-text-secondary mt-3 px-4 pb-4 text-start",
        className,
      )}
      {...props}
    >
      {translateNode(props.children, translateText)}
    </caption>
  );
}

export {
  AdminTable,
  AdminTableBody,
  AdminTableCaption,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
};
