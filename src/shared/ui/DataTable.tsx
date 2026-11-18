import React, { useState, useMemo } from "react";
import {
  Box,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Surface } from "./Surface";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  width?: number | string;
  /** Provide to enable client-side sorting on this column. */
  sortValue?: (row: T) => string | number | null | undefined;
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
  /** When provided, renders a search input and filters rows client-side. */
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  /** Override the default filter logic (matches any sortValue by default). */
  filterFn?: (row: T, filter: string) => boolean;
}

type SortDir = "asc" | "desc";
interface SortState { colId: string; dir: SortDir }

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  loadingRows = 5,
  emptyState,
  onRowClick,
  footer,
  filterValue,
  onFilterChange,
  filterPlaceholder = "Search…",
  filterFn,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);

  const handleSortClick = (colId: string) => {
    setSort((prev) => {
      if (prev?.colId !== colId) return { colId, dir: "asc" };
      if (prev.dir === "asc") return { colId, dir: "desc" };
      return null;
    });
  };

  const displayRows = useMemo(() => {
    let result = rows;

    if (filterValue) {
      const needle = filterValue.toLowerCase();
      result = result.filter((row) => {
        if (filterFn) return filterFn(row, filterValue);
        return columns.some((col) => {
          if (!col.sortValue) return false;
          const v = col.sortValue(row);
          return v != null && String(v).toLowerCase().includes(needle);
        });
      });
    }

    if (sort) {
      const col = columns.find((c) => c.id === sort.colId);
      if (col?.sortValue) {
        result = [...result].sort((a, b) => {
          const av = col.sortValue!(a) ?? "";
          const bv = col.sortValue!(b) ?? "";
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }

    return result;
  }, [rows, filterValue, filterFn, sort, columns]);

  const showFilter = onFilterChange !== undefined;

  return (
    <TableContainer component={Surface} sx={{ overflowX: "auto" }}>
      {showFilter && (
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <TextField
            size="small"
            placeholder={filterPlaceholder}
            value={filterValue ?? ""}
            onChange={(e) => onFilterChange!(e.target.value)}
            sx={{ maxWidth: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align} sx={{ width: col.width }}>
                {col.sortValue ? (
                  <TableSortLabel
                    active={sort?.colId === col.id}
                    direction={sort?.colId === col.id ? sort.dir : "asc"}
                    onClick={() => handleSortClick(col.id)}
                  >
                    {col.header}
                  </TableSortLabel>
                ) : (
                  col.header
                )}
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
            displayRows.map((row) => (
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

          {!isLoading && displayRows.length === 0 && emptyState && (
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
