import {
  TableBody as TableBodyComponent,
  TableCell,
  TableRow as TableRowComponent,
} from "@/components/ui/table";
import TableRow from "./table-row";

const TableBody = ({ table, columns }) => {
  return (
    <TableBodyComponent>
      {table.getRowModel().rows?.length ? (
        table
          .getRowModel()
          .rows.map((row) => <TableRow key={row.id} row={row} />)
      ) : (
        <TableRowComponent>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRowComponent>
      )}
    </TableBodyComponent>
  );
};

export default TableBody;
