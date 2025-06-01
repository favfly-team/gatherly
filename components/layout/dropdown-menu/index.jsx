import { DropdownMenu as DropdownMenuComponent } from "@/components/ui/dropdown-menu";
import DropdownTrigger from "./dropdown-trigger";
import DropdownMenuContent from "./dropdown-menu-content";

const DropdownMenu = ({ trigger, items = [], triggerClassName }) => {
  return (
    <DropdownMenuComponent>
      {/* Trigger */}
      <DropdownTrigger trigger={trigger} triggerClassName={triggerClassName} />

      {/* Content */}
      <DropdownMenuContent items={items} />
    </DropdownMenuComponent>
  );
};

export default DropdownMenu;
