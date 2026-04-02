import * as React from "react";

import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface AdminUserAvatarProps extends React.ComponentProps<"div"> {
  meta?: React.ReactNode;
  name: string;
  size?: "sm" | "md";
  subtitle?: React.ReactNode;
}

function AdminUserAvatar({
  className,
  meta,
  name,
  size = "md",
  subtitle,
  ...props
}: AdminUserAvatarProps) {
  const avatarSize = size === "sm" ? "size-10" : "size-12";

  return (
    <div className={cn("flex items-start gap-3", className)} {...props}>
      <div
        className={cn(
          "bg-secondary text-primary flex shrink-0 items-center justify-center rounded-2xl font-medium",
          avatarSize,
        )}
      >
        <span className={size === "sm" ? "text-caption" : "text-body-sm"}>
          {getInitials(name)}
        </span>
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-body text-foreground font-medium">{name}</p>
        {subtitle ? (
          <p className="text-body-sm text-text-secondary">{subtitle}</p>
        ) : null}
        {meta ? (
          <p className="text-caption text-text-tertiary font-medium tracking-[0.18em] uppercase">
            {meta}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export { AdminUserAvatar, type AdminUserAvatarProps };
