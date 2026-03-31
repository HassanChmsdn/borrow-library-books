import * as React from "react";

import { cn } from "@/lib/utils";

function ShellContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="shell-container"
      className={cn(
        "px-gutter mx-auto w-full max-w-(--layout-shell-max-width)",
        className,
      )}
      {...props}
    />
  );
}

export { ShellContainer };
