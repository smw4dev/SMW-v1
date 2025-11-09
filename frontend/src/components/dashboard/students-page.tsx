"use client"

import * as React from 'react'
import {
  Download,
  Home,
  MoreHorizontal,
  Search,
  Trash2,
  UsersRound,
  Eye,
  Pencil,
} from 'lucide-react'

import { ActionIconButton } from './action-icon-button'
import { AddUserDialog } from './add-user-dialog'
import { StatusBadge } from './status-badge'
import { usersTable } from './data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function StudentsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Breadcrumbs />
      <HeaderActions />
      <Toolbar />
      <StudentsTable />
    </div>
  )
}

function Breadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex items-center gap-2 text-sm"
    >
      <Home className="h-4 w-4" />
      <span>Home</span>
      <span>/</span>
      <UsersRound className="h-4 w-4" />
      <span>Students</span>
      <span>/</span>
      <span className="text-foreground">List</span>
    </nav>
  )
}

function HeaderActions() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">All Students</h1>
        <p className="text-muted-foreground text-sm">
          Manage every student in a single, organized place.
        </p>
      </div>

      {/* Action buttons moved to Toolbar for single-line layout */}
      <div />
    </div>
  )
}

function Toolbar() {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      {/* Left: search + small action icons beside it */}
      <div className="flex items-center gap-2 w-full max-w-2xl">
        <div className="relative flex w-full min-w-[240px] items-center">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />
          <input
            className="bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-0 h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none transition"
            placeholder="Search students"
            type="search"
          />
        </div>
        <ActionIconButton
          variant="ghost"
          aria-label="Delete selected"
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </ActionIconButton>
        <ActionIconButton
          variant="ghost"
          aria-label="More options"
          className="h-8 w-8"
        >
          <MoreHorizontal className="h-4 w-4" />
        </ActionIconButton>
      </div>

      {/* Right: Add User and Export buttons */}
      <div className="flex flex-nowrap items-center gap-2">
        <AddUserDialog />
        <Button
          variant="outline"
          className="border-blue-500 px-5 text-sm font-semibold text-blue-500 hover:bg-blue-500/10"
        >
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>
    </div>
  )
}

function StudentsTable() {
  const [page, setPage] = React.useState(1)
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set())

  const pageSize = 8
  const pages = Math.max(1, Math.ceil(usersTable.length / pageSize))
  const start = (page - 1) * pageSize
  const pageItems = usersTable.slice(start, start + pageSize)

  const visibleIds = React.useMemo(() => pageItems.map((u) => u.id), [pageItems])
  const selectedOnPageCount = visibleIds.filter((id) => selectedIds.has(id)).length
  const allOnPageSelected = selectedOnPageCount === visibleIds.length && visibleIds.length > 0
  const someOnPageSelected = selectedOnPageCount > 0 && !allOnPageSelected

  const toggleRow = React.useCallback((id: number, next?: boolean) => {
    setSelectedIds((prev) => {
      const nextSet = new Set(prev)
      const willSelect = typeof next === 'boolean' ? next : !nextSet.has(id)
      if (willSelect) nextSet.add(id)
      else nextSet.delete(id)
      return nextSet
    })
  }, [])

  const toggleAllVisible = React.useCallback((checked: boolean | 'indeterminate') => {
    setSelectedIds((prev) => {
      const nextSet = new Set(prev)
      if (checked === true) {
        visibleIds.forEach((id) => nextSet.add(id))
      } else {
        visibleIds.forEach((id) => nextSet.delete(id))
      }
      return nextSet
    })
  }, [visibleIds])

  return (
    <div className="rounded-2xl bg-background shadow-sm">
      <Table className="[&_th]:px-5 [&_td]:px-5 md:[&_th]:px-6 md:[&_td]:px-6 [&_td]:py-3 [&_th]:py-3">
        <TableHeader className="[&_tr]:border-0">
          <TableRow className="border-0">
            <TableHead className="w-12 bg-muted rounded-l-xl">
              <Checkbox
                aria-label="Select all students"
                checked={allOnPageSelected ? true : someOnPageSelected ? 'indeterminate' : false}
                onCheckedChange={toggleAllVisible}
              />
            </TableHead>
            <TableHead className="bg-muted text-muted-foreground uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="bg-muted text-muted-foreground uppercase tracking-wider">
              Student ID
            </TableHead>
            <TableHead className="bg-muted text-muted-foreground uppercase tracking-wider">
              Contact No
            </TableHead>
            <TableHead className="bg-muted text-muted-foreground uppercase tracking-wider">
              Class
            </TableHead>
            <TableHead className="bg-muted text-muted-foreground uppercase tracking-wider">
              Batch
            </TableHead>
            <TableHead className="bg-muted text-muted-foreground uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="bg-muted text-muted-foreground rounded-r-xl text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="[&_tr]:border-0">
          {/* spacer between header and body */}
          <TableRow data-spacer="true" className="border-0">
            <TableCell colSpan={8} className="h-2 p-0" aria-hidden="true" />
          </TableRow>
          {pageItems.map((user, idx) => {
            const isSelected = selectedIds.has(user.id)
            const isFirst = idx === 0
            const isLast = idx === pageItems.length - 1
            return (
              <TableRow
                key={user.id}
                data-state={isSelected ? 'selected' : undefined}
                className={
                  `border-0 hover:[&>td]:bg-muted/30 dark:hover:[&>td]:bg-muted/20 data-[state=selected]:[&>td]:bg-blue-100 dark:data-[state=selected]:[&>td]:bg-blue-900/40 [&>td]:transition-colors` +
                  (isFirst ? ' [&>td:first-child]:rounded-tl-xl [&>td:last-child]:rounded-tr-xl' : '') +
                  (isLast ? ' [&>td:first-child]:rounded-bl-xl [&>td:last-child]:rounded-br-xl' : '')
                }
              >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${user.name}`}
                  checked={isSelected}
                  onCheckedChange={(c) => toggleRow(user.id, c === true)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{user.name}</span>
                    <a
                      href={`mailto:${user.email}`}
                      className="text-muted-foreground text-xs underline-offset-2 hover:underline"
                    >
                      {user.email}
                    </a>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{user.id}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{user.contactNo ?? '-'}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{user.studentClass ?? '-'}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{user.batch ?? '-'}</span>
              </TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <ActionIconButton variant="ghost" aria-label={`View student ${user.name}`}>
                    <Eye className="h-4 w-4" />
                  </ActionIconButton>
                  <ActionIconButton variant="ghost" aria-label={`Edit student ${user.name}`}>
                    <Pencil className="h-4 w-4" />
                  </ActionIconButton>
                  <ActionIconButton
                    variant="destructive"
                    aria-label={`Delete student ${user.name}`}
                    className="border-pink-500/50 text-pink-500 dark:text-pink-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </ActionIconButton>
                </div>
              </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

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
          {Array.from({ length: pages }).map((_, idx) => {
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
          })}
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
    </div>
  )
}

function IconPill({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="bg-slate-800/80 text-muted-foreground hover:bg-slate-700/80 flex h-7 w-7 items-center justify-center rounded-full transition"
      {...props}
    >
      {children}
    </button>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
