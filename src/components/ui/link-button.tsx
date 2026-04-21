"use client";

import Link from "next/link";
import type { VariantProps } from "class-variance-authority";

import { translateNode, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";

function LinkButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  const { translateText } = useI18n();

  return (
    <Link
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {translateNode(props.children, translateText)}
    </Link>
  );
}

export { LinkButton };