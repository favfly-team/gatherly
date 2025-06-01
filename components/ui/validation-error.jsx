import React from "react";
import { cn } from "@/lib/utils";
import { ZodError } from "zod";

export function formatError(_value, error) {
  if (!error) {
    return null;
  }

  if (!(error instanceof ZodError)) {
    return new ZodError([
      { message: "Something went wrong", path: [], code: "custom" },
    ]).format();
  }

  return error.format();
}

export const ValidationError = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    if (!children) {
      return null;
    }

    return (
      <span
        ref={ref}
        className={cn("text-destructive text-xs", className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

ValidationError.displayName = "ValidationError";
