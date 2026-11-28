import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Inbox, Search } from 'lucide-react';

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: 'left' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  toolbarExtra?: React.ReactNode;
  pageSize?: number;
  emptyTitle?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  searchPlaceholder = 'Search...',
  searchFilter,
  toolbarExtra,
  pageSize = 8,
  emptyTitle = 'No matching records found',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchFilter) return data;
    return data.filter((row) => searchFilter(row, q));
  }, [data, query, searchFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="card-note overflow-hidden">
      {(searchFilter || toolbarExtra) && (
        <div className="p-4 border-b border-[#ded8ca] flex flex-wrap items-center justify-between gap-3 bg-[#f6f3ec]/55">
          {searchFilter ? (
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="h-4 w-4 text-[#6e6a62] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="w-full h-9 pl-9 pr-3.5 rounded-[10px] border border-[#ded8ca] bg-[#efebe1] text-[13.5px] text-[#141312] placeholder:text-[#6e6a62] focus:border-[#1c5b48] focus:ring-2 focus:ring-[#1c5b48]/20 outline-none transition-colors"
              />
            </div>
          ) : (
            <div />
          )}
          {toolbarExtra && <div className="flex flex-wrap items-center gap-2">{toolbarExtra}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#ded8ca] bg-[#e5dfd2]/65">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3 px-4 font-mono-tech text-[11px] font-medium uppercase tracking-[0.1em] text-[#6e6a62] whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ded8ca]/75 text-[13.5px]">
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 px-4 text-center text-[#6e6a62]">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-7 w-7 text-[#6e6a62]" />
                    <p className="text-[13.5px] font-medium text-[#4c4842]">{emptyTitle}</p>
                  </div>
                </td>
              </tr>
            ) : (
              slice.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-[#efebe1]/75 transition-colors">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 align-middle text-[#141312] ${
                        col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > pageSize && (
        <div className="px-4 py-3 border-t border-[#ded8ca] bg-[#f6f3ec]/55 flex items-center justify-between text-[12.5px] text-[#6e6a62]">
          <span className="font-mono-tech">
            Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-full border border-[#ded8ca] bg-[#f6f3ec] text-[#4c4842] hover:bg-[#e5dfd2] disabled:opacity-40 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2.5 font-mono-tech font-medium text-[#141312]">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-full border border-[#ded8ca] bg-[#f6f3ec] text-[#4c4842] hover:bg-[#e5dfd2] disabled:opacity-40 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
