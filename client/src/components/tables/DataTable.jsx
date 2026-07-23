import React, { useState } from 'react';
import { Table } from './Table.jsx';
import { TableHeader } from './TableHeader.jsx';
import { TableBody } from './TableBody.jsx';
import { TableRow } from './TableRow.jsx';
import { TableCell } from './TableCell.jsx';
import { TablePagination } from './TablePagination.jsx';
import { TableSearch } from './TableSearch.jsx';
import { TableFilter } from './TableFilter.jsx';
import { TableSort } from './TableSort.jsx';

export const DataTable = ({
  columns = [],
  data = [],
  filters = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  defaultSortKey = '',
  defaultSortOrder = 'asc'
}) => {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Filter Data
  let processedData = [...data];
  if (search) {
    processedData = processedData.filter((row) =>
      columns.some((col) =>
        String(row[col.key] || '')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }

  Object.keys(activeFilters).forEach((filterKey) => {
    const val = activeFilters[filterKey];
    if (val) {
      processedData = processedData.filter((row) => String(row[filterKey]) === String(val));
    }
  });

  // Sort Data
  if (sortKey) {
    processedData.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }

  // Paginate Data
  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  const paginatedData = processedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSortChange = (key, order) => {
    setSortKey(key);
    setSortOrder(order);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {searchable && (
          <TableSearch
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            onClear={() => setSearch('')}
            placeholder={searchPlaceholder}
          />
        )}
        {filters.length > 0 && (
          <TableFilter
            filters={filters}
            activeFilters={activeFilters}
            onApply={(f) => {
              setActiveFilters(f);
              setPage(1);
            }}
            onClear={() => {
              setActiveFilters({});
              setPage(1);
            }}
          />
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow hover={false}>
            {columns.map((col) => (
              <TableCell key={col.key} isHeader>
                <div className="flex items-center gap-1.5">
                  <span>{col.label}</span>
                  {col.sortable && (
                    <TableSort
                      column={col.key}
                      activeSortKey={sortKey}
                      activeSortOrder={sortOrder}
                      onSort={handleSortChange}
                    />
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow hover={false}>
              <TableCell className="text-center text-slate-400 py-10" colSpan={columns.length}>
                No data available in table.
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, idx) => (
              <TableRow key={row.id || idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {processedData.length > itemsPerPage && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          itemsPerPage={itemsPerPage}
          totalItems={processedData.length}
        />
      )}
    </div>
  );
};
