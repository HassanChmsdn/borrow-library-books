import * as React from "react";
import { ArrowRight } from "lucide-react";

import { LinkButton } from "@/components/ui/link-button";

import { AdminSectionCard } from "./admin-section-card";

interface AdminQuickActionCardProps {
  actionLabel: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  title: string;
}

function AdminQuickActionCard({
  actionLabel,
  description,
  href,
  icon,
  title,
}: AdminQuickActionCardProps) {
  return (
    <AdminSectionCard
      title={title}
      description={description}
      contentClassName="gap-0"
    >
      <div className="flex items-center justify-between gap-3">
        {icon ? (
          <span className="bg-secondary text-primary flex size-10 items-center justify-center rounded-xl">
            {icon}
          </span>
        ) : (
          <span />
        )}
        <LinkButton href={href} size="sm" variant="ghost">
          {actionLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </LinkButton>
      </div>
    </AdminSectionCard>
  );
}

export { AdminQuickActionCard, type AdminQuickActionCardProps };
