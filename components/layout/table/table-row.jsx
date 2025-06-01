import { TableRow as TableRowComponent } from "@/components/ui/table";
import TableCell from "./table-cell";

const TableRow = ({ row }) => {
  return (
    <TableRowComponent
      key={row.id}
      className="cursor-pointer"
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell cell={cell} key={cell.id} />
      ))}
    </TableRowComponent>
  );
};

export default TableRow;
