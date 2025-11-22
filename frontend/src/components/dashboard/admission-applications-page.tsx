'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  ClipboardList,
  Download,
  Eye,
  Home,
  MoreHorizontal,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

import { ActionIconButton } from './action-icon-button'
import { DashboardDataTable, DashboardTableColumn } from './dashboard-data-table'
import { StatusBadge } from './status-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/components/auth/AuthProvider'
import { buildApiUrl } from '@/lib/api-client'
import {
  type AdmissionApplicationApi,
  type AdmissionApplicationRecord,
  mapAdmissionApplication,
} from '@/lib/admissions'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})

type AdmissionApplication = AdmissionApplicationRecord

export function AdmissionApplicationsPage() {
  const { fetchWithAuth } = useAuth()
  const [applications, setApplications] = React.useState<AdmissionApplication[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadApplications = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchWithAuth(buildApiUrl('/admissions/'))
      if (!response.ok) {
        let message = response.statusText || 'Failed to load applications.'
        try {
          const body = await response.json()
          if (typeof body.detail === 'string') {
            message = body.detail
          }
        } catch {
          // ignore JSON parse errors and fallback to status text
        }
        throw new Error(message)
      }
      const data = (await response.json()) as AdmissionApplicationApi[]
      setApplications(data.map(mapAdmissionApplication))
    } catch (err) {
      console.error('Unable to load admission applications', err)
      setError(err instanceof Error ? err.message : 'Unable to load admission applications.')
    } finally {
      setLoading(false)
    }
  }, [fetchWithAuth])

  React.useEffect(() => {
    loadApplications()
  }, [loadApplications])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <Breadcrumbs />
      <HeaderActions />
      <Toolbar onRefresh={loadApplications} refreshing={loading} />
      {error ? <ErrorBanner message={error} onRetry={loadApplications} /> : null}
      <ApplicationsTable applications={applications} loading={loading} />
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
      <ClipboardList className="h-4 w-4" />
      <span>Applications</span>
      <span>/</span>
      <span className="text-foreground">List</span>
    </nav>
  )
}

function HeaderActions() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">Admission Applications</h1>
        <p className="text-muted-foreground text-sm">
          Track every submission from first contact to approval.
        </p>
      </div>

      <div />
    </div>
  )
}

function Toolbar({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void
  refreshing: boolean
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex w-full max-w-2xl items-center gap-2">
        <div className="relative flex w-full min-w-[240px] items-center">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />
          <input
            className="bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-0 h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none transition"
            placeholder="Search applicants"
            type="search"
          />
        </div>
        <ActionIconButton
          variant="ghost"
          aria-label="Filter applications"
          className="h-8 w-8"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </ActionIconButton>
        <ActionIconButton variant="ghost" aria-label="More options" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </ActionIconButton>
      </div>

      <div className="flex flex-nowrap items-center gap-2">
        <Button
          variant="outline"
          className="px-4 text-sm font-semibold"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          className="border-blue-500 px-5 text-sm font-semibold text-blue-500 hover:bg-blue-500/10"
        >
          <Download className="mr-2 h-4 w-4" />
          Export list
        </Button>
      </div>
    </div>
  )
}

function ApplicationsTable({
  applications,
  loading,
}: {
  applications: AdmissionApplication[]
  loading: boolean
}) {
  const router = useRouter()
  const columns = React.useMemo(
    () =>
      createApplicationColumns((application) =>
        router.push(`/admin/admissions/${application.id}`),
      ),
    [router],
  )

  if (loading) {
    return <TableSkeleton />
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-center shadow-sm">
        <p className="text-base font-semibold text-foreground">No applications yet</p>
        <p className="text-sm text-muted-foreground">
          Once students submit the admission form, they will appear here automatically.
        </p>
      </div>
    )
  }

  return (
    <DashboardDataTable
      data={applications}
      columns={columns}
      selectable
      selectionLabel="applications"
      getRowLabel={(application) => `${application.studentName} (${application.applicationNumber})`}
    />
  )
}

function createApplicationColumns(
  onView: (application: AdmissionApplication) => void,
): DashboardTableColumn<AdmissionApplication>[] {
  return [
    {
      id: 'applicant',
      header: 'Applicant',
      render: (application) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-background">
            <AvatarImage src={application.picture} alt={application.studentName} />
            <AvatarFallback>{initials(application.studentName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-base font-semibold">{application.studentName}</span>
            <span className="text-muted-foreground text-xs">{application.applicationNumber}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'class',
      header: 'Class & Batch',
      render: (application) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{application.currentClass}</span>
          <span className="text-muted-foreground text-xs">
            {application.batch ?? 'Batch not assigned'}
          </span>
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      render: (application) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {application.studentMobile ?? 'Phone not provided'}
          </span>
          {application.studentEmail ? (
            <a
              href={`mailto:${application.studentEmail}`}
              className="text-muted-foreground text-xs underline-offset-2 hover:underline"
            >
              {application.studentEmail}
            </a>
          ) : (
            <span className="text-muted-foreground text-xs">Email not provided</span>
          )}
        </div>
      ),
    },
    {
      id: 'submission',
      header: 'Submission',
      render: (application) => {
        const created = new Date(application.createdAt)
        return (
          <div className="flex flex-col text-sm font-medium">
            <span>{dateFormatter.format(created)}</span>
            <span className="text-muted-foreground text-xs">
              {timeFormatter.format(created)}
            </span>
          </div>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      render: (application) => <StatusBadge status={application.status || 'pending'} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      align: 'right',
      headerClassName: 'text-right',
      cellClassName: 'text-right',
      render: (application) => (
        <ActionIconButton
          variant="ghost"
          aria-label={`View application ${application.applicationNumber}`}
          onClick={() => onView(application)}
        >
          <Eye className="h-4 w-4" />
        </ActionIconButton>
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

function TableSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
      <Skeleton className="h-6 w-48" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
      <span>{message}</span>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
