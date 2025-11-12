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
import { useRouter } from 'next/navigation'

import { ActionIconButton } from './action-icon-button'
import { AddUserDialog } from './add-user-dialog'
import { DashboardDataTable, DashboardTableColumn } from './dashboard-data-table'
import { StatusBadge } from './status-badge'
import { usersTable } from './data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Student = (typeof usersTable)[number]

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
  const router = useRouter()
  const columns = React.useMemo(
    () => createStudentColumns((student) => router.push(`/dashboard/students/${student.id}`)),
    [router],
  )

  return (
    <DashboardDataTable
      data={usersTable}
      columns={columns}
      selectable
      selectionLabel="students"
      getRowLabel={(student) => student.name}
    />
  )
}

function createStudentColumns(onView: (student: Student) => void): DashboardTableColumn<Student>[] {
  return [
    {
      id: 'name',
      header: 'Name',
      render: (user) => (
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
      ),
    },
    {
      id: 'studentId',
      header: 'Student ID',
      render: (user) => <span className="text-sm font-medium">{user.id}</span>,
    },
    {
      id: 'contact',
      header: 'Contact No',
      render: (user) => <span className="text-sm font-medium">{user.contactNo ?? '-'}</span>,
    },
    {
      id: 'class',
      header: 'Class',
      render: (user) => <span className="text-sm font-medium">{user.studentClass ?? '-'}</span>,
    },
    {
      id: 'batch',
      header: 'Batch',
      render: (user) => <span className="text-sm font-medium">{user.batch ?? '-'}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      render: (user) => <StatusBadge status={user.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (user) => (
        <div className="flex items-center justify-end gap-2">
          <ActionIconButton
            variant="ghost"
            aria-label={`View student ${user.name}`}
            onClick={() => onView(user)}
          >
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
      ),
    },
  ]
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
