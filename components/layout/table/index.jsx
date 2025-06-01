"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table as TableComponent } from "@/components/ui/table";

import { useState } from "react";

import TableHeader from "./table-header";
import TableBody from "./table-body";

const Table = ({ initialStates, data, columns }) => {
  const [sorting, setSorting] = useState(initialStates?.sorting || []);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      pagination: {
        pageIndex: 0,
        pageSize: data?.length || 10,
      },
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg">
      <TableComponent>
        <TableHeader table={table} />
        <TableBody table={table} columns={columns} />
      </TableComponent>
    </div>
  );
};

export default Table;
