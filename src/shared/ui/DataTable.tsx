import React from "react";
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Surface } from "./Surface";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  isLoading?: boolean;
  loadingRows?: number;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  footer?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  loadingRows = 5,
  emptyState,
  onRowClick,
  footer,
}: DataTableProps<T>) {
  return (
    <TableContainer component={Surface} sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align} sx={{ width: col.width }}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading &&
            Array.from({ length: loadingRows }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton height={20} width={col.width ?? "80%"} />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading &&
            rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover={Boolean(onRowClick)}
                sx={onRowClick ? { cursor: "pointer" } : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!isLoading && rows.length === 0 && emptyState && (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ p: 0, border: 0 }}>
                {emptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {footer && <Box>{footer}</Box>}
    </TableContainer>
  );
}
