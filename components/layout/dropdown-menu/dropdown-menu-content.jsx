import {
  DropdownMenuContent as DropdownMenuContentComponent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const DropdownMenuContent = ({ items }) => {
  return (
    <DropdownMenuContentComponent
      align="end"
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(({ ...item }, index) => (
        <DropdownMenuItem key={index} {...item}>
          {item?.icon}
          {item?.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContentComponent>
  );
};

export default DropdownMenuContent;
