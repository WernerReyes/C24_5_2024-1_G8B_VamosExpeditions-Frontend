import {
  DataTableFilterMeta,
  DataTableSortEvent,
  DataTableStateEvent,
} from "primereact/datatable";
import type { PaginatorPageChangeEvent } from "primereact/paginator";
import { useState } from "react";

export const usePaginator = (initialLimit: number, sessionKey?: string) => {
  const session = sessionStorage.getItem(sessionKey || "") || "{}";
  const initialState = JSON.parse(session);
  const [currentPage, setCurrentPage] = useState<number>(
    initialState.currentPage ?? 1
  );
  const [filters, setFilters] = useState<DataTableFilterMeta>(
    initialState.filters ?? undefined
  );
  const [sortField, setSortField] = useState<DataTableSortEvent>();
  const [first, setFirst] = useState<number>(initialState.first ?? 0);
  const [limit, setLimit] = useState<number>(initialState.rows ?? initialLimit);

  const handlePageChange = (
    event: PaginatorPageChangeEvent | DataTableStateEvent
  ) => {
    if (event.page && event.page > 0) {
      setCurrentPage(event.page + 1);
    } else setCurrentPage(1);
    setFirst(event.first);
    setLimit(event.rows);

    if ("sortField" in event && "sortOrder" in event) {
      event["first"] = 0;
      setSortField({
        sortField: event.sortField!,
        sortOrder: event.sortOrder!,
        multiSortMeta: [],
      });
      setFilters(event.filters);
    }
  };

  const handleSaveState = (state: {
    first: number;
    rows: number;
    filters: {};
  }) => {
    if (!sessionKey) return;
    sessionStorage.setItem(
      sessionKey,
      JSON.stringify({
        first: state.first,
        rows: state.rows,
        currentPage: state.first / state.rows + 1,
        filters: state.filters,
      })
    );
  };


  return {
    currentPage,
    limit,
    first,
    handlePageChange,
    handleSaveState,
    filters,
    sortField,
  };
};
