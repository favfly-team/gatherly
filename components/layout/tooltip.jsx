"use client";

import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Tooltip = ({ children, content }) => {
  return (
    <TooltipComponent>
      {/* ===== TRIGGER ===== */}
      <TooltipTrigger asChild>{children}</TooltipTrigger>

      {/* ===== CONTENT ===== */}
      {content && (
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      )}
    </TooltipComponent>
  );
};

// ===== EXPORTS =====
export default Tooltip;
