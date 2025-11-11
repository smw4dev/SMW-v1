"use client"

import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

type RowId = string | number

export type DashboardTableColumn<T extends { id: RowId }> = {
  id: string
  header: React.ReactNode
  render: (row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  headerClassName?: string
  cellClassName?: string
}

type DashboardDataTableProps<T extends { id: RowId }> = {
  data: T[]
  columns: DashboardTableColumn<T>[]
  pageSize?: number
  selectable?: boolean
  selectionLabel?: string
  getRowLabel?: (row: T) => string
  className?: string
  emptyMessage?: string
}

export function DashboardDataTable<T extends { id: RowId }>({
  data,
  columns,
  pageSize = 8,
  selectable = false,
  selectionLabel = 'rows',
  getRowLabel,
  className,
  emptyMessage = 'No records found',
}: DashboardDataTableProps<T>) {
  const [page, setPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<Set<RowId>>(new Set())

  const pages = Math.max(1, Math.ceil(data.length / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = data.slice(start, start + pageSize)

  const visibleIds = React.useMemo(() => pageItems.map((item) => item.id), [pageItems])
  const selectedOnPageCount = selectable
    ? visibleIds.filter((id) => selectedIds.has(id)).length
    : 0
  const allOnPageSelected =
    selectable && selectedOnPageCount === visibleIds.length && visibleIds.length > 0
  const someOnPageSelected = selectable && selectedOnPageCount > 0 && !allOnPageSelected

  React.useEffect(() => {
    if (page > pages) {
      setPage(pages)
    }
  }, [page, pages])

  React.useEffect(() => {
    if (!selectable && selectedIds.size > 0) {
      setSelectedIds(new Set())
    }
  }, [selectable, selectedIds.size])

  const toggleRow = React.useCallback(
    (id: RowId, next?: boolean) => {
      if (!selectable) return
      setSelectedIds((prev) => {
        const nextSet = new Set(prev)
        const willSelect = typeof next === 'boolean' ? next : !nextSet.has(id)
        if (willSelect) nextSet.add(id)
        else nextSet.delete(id)
        return nextSet
      })
    },
    [selectable],
  )

  const toggleAllVisible = React.useCallback(
    (checked: boolean | 'indeterminate') => {
      if (!selectable) return
      setSelectedIds((prev) => {
        const nextSet = new Set(prev)
        if (checked === true) {
          visibleIds.forEach((id) => nextSet.add(id))
        } else {
          visibleIds.forEach((id) => nextSet.delete(id))
        }
        return nextSet
      })
    },
    [selectable, visibleIds],
  )

  const totalColumns = columns.length + (selectable ? 1 : 0)
  const paginationButtons = React.useMemo(
    () =>
      Array.from({ length: pages }).map((_, idx) => {
        const p = idx + 1
        const isActive = p === page
        return (
          <button
            key={p}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? 'bg-primary text-primary-foreground shadow-md rounded-full px-3 py-2'
                : 'text-foreground/80 hover:text-foreground rounded-full px-3 py-2'
            }
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        )
      }),
    [page, pages],
  )

  return (
    <div className={cn('rounded-2xl bg-background shadow-sm', className)}>
      <Table className="[&_th]:px-5 [&_td]:px-5 md:[&_th]:px-6 md:[&_td]:px-6 [&_td]:py-3 [&_th]:py-3">
        <TableHeader className="[&_tr]:border-0">
          <TableRow className="border-0">
            {selectable && (
              <TableHead className="w-12 bg-muted rounded-l-xl">
                <Checkbox
                  aria-label={`Select all ${selectionLabel}`}
                  checked={allOnPageSelected ? true : someOnPageSelected ? 'indeterminate' : false}
                  onCheckedChange={toggleAllVisible}
                />
              </TableHead>
            )}
            {columns.map((column, idx) => (
              <TableHead
                key={column.id}
                className={cn(
                  'bg-muted text-muted-foreground uppercase tracking-wider',
                  !selectable && idx === 0 && 'rounded-l-xl',
                  idx === columns.length - 1 && 'rounded-r-xl',
                  column.align === 'right' && 'text-right',
                  column.align === 'center' && 'text-center',
                  column.headerClassName,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-0">
          {pageItems.length > 0 && (
            <TableRow data-spacer="true" className="border-0">
              <TableCell colSpan={totalColumns} className="h-2 p-0" aria-hidden="true" />
            </TableRow>
          )}
          {pageItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={totalColumns}
                className="text-muted-foreground py-12 text-center text-sm"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            pageItems.map((row, idx) => {
              const isSelected = selectable ? selectedIds.has(row.id) : false
              const isFirst = idx === 0
              const isLast = idx === pageItems.length - 1
              return (
                <TableRow
                  key={row.id}
                  data-state={isSelected ? 'selected' : undefined}
                  className={
                    `border-0 hover:[&>td]:bg-muted/30 dark:hover:[&>td]:bg-muted/20 data-[state=selected]:[&>td]:bg-blue-100 dark:data-[state=selected]:[&>td]:bg-blue-900/40 [&>td]:transition-colors` +
                    (isFirst
                      ? ' [&>td:first-child]:rounded-tl-xl [&>td:last-child]:rounded-tr-xl'
                      : '') +
                    (isLast
                      ? ' [&>td:first-child]:rounded-bl-xl [&>td:last-child]:rounded-br-xl'
                      : '')
                  }
                >
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        aria-label={`Select ${getRowLabel ? getRowLabel(row) : selectionLabel}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleRow(row.id, checked === true)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                        column.cellClassName,
                      )}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {pages > 1 && (
        <div className="flex w-full justify-center py-4">
          <div className="bg-muted flex items-center gap-1 rounded-full px-1.5 py-1">
            <button
              type="button"
              aria-label="Previous page"
              className="text-muted-foreground hover:text-foreground disabled:opacity-40 rounded-full px-3 py-2"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹
            </button>
            {paginationButtons}
            <button
              type="button"
              aria-label="Next page"
              className="text-muted-foreground hover:text-foreground disabled:opacity-40 rounded-full px-3 py-2"
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
