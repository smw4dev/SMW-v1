"use client"

import {
  Calendar,
  CreditCard,
  Download,
  Filter,
  Home,
  MoreHorizontal,
  Search,
  Send,
  Eye,
} from 'lucide-react'

import { ActionIconButton } from './action-icon-button'
import { DashboardDataTable, DashboardTableColumn } from './dashboard-data-table'
import { StatusBadge } from './status-badge'
import { paymentsTable } from './data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Payment = (typeof paymentsTable)[number]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

const paymentColumns: DashboardTableColumn<Payment>[] = [
  {
    id: 'student',
    header: 'Student',
    render: (payment) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-background">
          <AvatarImage src={payment.avatar} alt={payment.studentName} />
          <AvatarFallback>{initials(payment.studentName)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-semibold">{payment.studentName}</span>
          <a
            href={`mailto:${payment.studentEmail}`}
            className="text-muted-foreground text-xs underline-offset-2 hover:underline"
          >
            {payment.studentEmail}
          </a>
        </div>
      </div>
    ),
  },
  {
    id: 'txnId',
    header: 'TXN ID',
    render: (payment) => (
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{payment.reference}</span>
        <span className="text-muted-foreground text-xs">Invoice: {payment.invoice}</span>
      </div>
    ),
  },
  {
    id: 'date',
    header: 'Date/Time',
    render: (payment) => (
      <div className="flex flex-col text-sm font-medium">
        <span>{formatDate(payment.date)}</span>
        <span className="text-muted-foreground text-xs">{formatTime(payment.date)}</span>
      </div>
    ),
  },
  {
    id: 'amount',
    header: 'Amount',
    align: 'right',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    render: (payment) => <span className="text-sm font-semibold">{formatCurrency(payment.amount)}</span>,
  },
  {
    id: 'status',
    header: 'Status',
    render: (payment) => (
      <StatusBadge status={payment.status} />
    ),
  },
  {
    id: 'method',
    header: 'Method',
    render: (payment) => (
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="w-fit text-xs capitalize">
          {payment.method}
        </Badge>
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    align: 'right',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    render: (payment) => (
      <div className="flex items-center justify-end gap-2">
        <ActionIconButton variant="ghost" aria-label={`View invoice ${payment.invoice}`}>
          <Eye className="h-4 w-4" />
        </ActionIconButton>
        <ActionIconButton variant="ghost" aria-label={`Send reminder for ${payment.invoice}`}>
          <Send className="h-4 w-4" />
        </ActionIconButton>
        <ActionIconButton variant="ghost" aria-label={`More actions for ${payment.invoice}`}>
          <MoreHorizontal className="h-4 w-4" />
        </ActionIconButton>
      </div>
    ),
  },
]

const paymentTotals = paymentsTable.reduce(
  (acc, payment) => {
    if (payment.status === 'paid') {
      acc.collected += payment.amount
      acc.collectedCount += 1
    }
    if (payment.status === 'pending') {
      acc.pending += payment.amount
      acc.pendingCount += 1
    }
    if (payment.status === 'overdue') {
      acc.overdue += payment.amount
      acc.overdueCount += 1
    }
    if (payment.status === 'failed') {
      acc.failedCount += 1
    }
    return acc
  },
  { collected: 0, pending: 0, overdue: 0, collectedCount: 0, pendingCount: 0, overdueCount: 0, failedCount: 0 },
)

const paymentCards = [
  {
    label: 'Collected this month',
    value: formatCurrency(paymentTotals.collected),
    meta: `${paymentTotals.collectedCount} invoices settled`,
    accent: 'from-emerald-500/10 to-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    trend: '+6.2% vs last month',
  },
  {
    label: 'Pending approval',
    value: formatCurrency(paymentTotals.pending),
    meta: `${paymentTotals.pendingCount} invoices awaiting`,
    accent: 'from-amber-500/10 to-amber-500/30 text-amber-700 dark:text-amber-300',
    trend: 'Action required',
  },
  {
    label: 'Overdue invoices',
    value: formatCurrency(paymentTotals.overdue),
    meta: `${paymentTotals.overdueCount} invoices need follow-up`,
    accent: 'from-rose-500/10 to-rose-500/30 text-rose-700 dark:text-rose-300',
    trend: 'Escalate soon',
  },
]

export function PaymentsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <PaymentBreadcrumbs />
      <PaymentHeader />
      <PaymentHighlights />
      <PaymentsToolbar />
      <DashboardDataTable
        data={paymentsTable}
        columns={paymentColumns}
        selectable
        selectionLabel="payments"
        getRowLabel={(payment) => `${payment.invoice} for ${payment.studentName}`}
      />
    </div>
  )
}

function PaymentBreadcrumbs() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex items-center gap-2 text-sm"
    >
      <Home className="h-4 w-4" />
      <span>Home</span>
      <span>/</span>
      <CreditCard className="h-4 w-4" />
      <span>Payments</span>
      <span>/</span>
      <span className="text-foreground">History</span>
    </nav>
  )
}

function PaymentHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight">Payments & Collections</h1>
        <p className="text-muted-foreground text-sm">
          Track tuition invoices, collection progress, and pending follow-ups in one view.
        </p>
      </div>
      <div className="flex flex-nowrap items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export report
        </Button>
        <Button className="gap-2">
          <CreditCard className="h-4 w-4" />
          Record payment
        </Button>
      </div>
    </div>
  )
}

function PaymentHighlights() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {paymentCards.map((card) => (
        <div
          key={card.label}
          className={`bg-gradient-to-br ${card.accent} rounded-2xl border border-border/40 p-5 shadow-sm`}
        >
          <p className="text-sm font-medium">{card.label}</p>
          <p className="mt-2 text-3xl font-bold">{card.value}</p>
          <p className="text-muted-foreground mt-1 text-xs">{card.meta}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide">{card.trend}</p>
        </div>
      ))}
    </div>
  )
}

function PaymentsToolbar() {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-[280px] flex-1 items-center gap-2">
        <div className="relative flex w-full items-center">
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search invoices or students"
            className="bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-blue-500/80 focus-visible:ring-offset-0 h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none transition"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Status
        </Button>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          This month
        </Button>
      </div>
      <div className="flex flex-nowrap items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
        <Button className="gap-2">
          <Send className="h-4 w-4" />
          Send reminders
        </Button>
      </div>
    </div>
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
