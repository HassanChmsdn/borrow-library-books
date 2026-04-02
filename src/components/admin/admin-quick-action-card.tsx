import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

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
        <Button asChild size="sm" variant="ghost">
          <Link href={href}>
            {actionLabel}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </AdminSectionCard>
  );
}

export { AdminQuickActionCard, type AdminQuickActionCardProps };
