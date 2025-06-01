import { flexRender } from "@tanstack/react-table";
import { TableCell as TableCellComponent } from "@/components/ui/table";

const TableCell = ({ cell }) => {
  return (
    <TableCellComponent key={cell.id}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCellComponent>
  );
};

export default TableCell;
