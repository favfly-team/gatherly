import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger as DropdownMenuTriggerComponent } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DropdownTrigger = ({ trigger, triggerClassName }) => {
  return (
    <DropdownMenuTriggerComponent asChild>
      <Button variant="ghost" className={cn("h-8 w-8 p-0", triggerClassName)}>
        {trigger}
      </Button>
    </DropdownMenuTriggerComponent>
  );
};

export default DropdownTrigger;
