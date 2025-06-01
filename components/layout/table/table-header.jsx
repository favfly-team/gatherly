import {
  TableHeader as TableHeaderComponent,
  TableHead,
  TableRow,
} from "@/components/ui/table";

import { flexRender } from "@tanstack/react-table";

const TableHeader = ({ table }) => {
  return (
    <TableHeaderComponent>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id} className="h-auto py-2">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeaderComponent>
  );
};

export default TableHeader;
