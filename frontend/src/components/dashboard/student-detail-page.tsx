"use client"

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarCheck,
  ClipboardList,
  Coins,
  CreditCard,
  GraduationCap,
  Hash,
  Home,
  Mail,
  MapPin,
  Phone,
  School,
  Shield,
  UserRound,
  Users,
  X,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

import { DashboardDataTable, DashboardTableColumn } from './dashboard-data-table'
import { StatusBadge } from './status-badge'
import { usersTable, type PaymentRecord, type StudentAdmissionDetail } from './data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

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

type Student = (typeof usersTable)[number]

type StudentDetailPageProps = {
  student: Student
  admission: StudentAdmissionDetail
  payments: PaymentRecord[]
}

const paymentColumns: DashboardTableColumn<PaymentRecord>[] = [
  {
    id: 'invoice',
    header: 'Invoice',
    render: (payment) => (
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{payment.invoice}</span>
        <span className="text-muted-foreground text-xs">TXN: {payment.reference}</span>
      </div>
    ),
  },
  {
    id: 'date',
    header: 'Date',
    render: (payment) => (
      <div className="flex flex-col text-sm">
        <span className="font-medium">{dateFormatter.format(new Date(payment.date))}</span>
        <span className="text-muted-foreground text-xs">{timeFormatter.format(new Date(payment.date))}</span>
      </div>
    ),
  },
  {
    id: 'amount',
    header: 'Amount',
    align: 'right',
    headerClassName: 'text-right',
    cellClassName: 'text-right',
    render: (payment) => (
      <span className="text-sm font-semibold">{currencyFormatter.format(payment.amount)}</span>
    ),
  },
  {
    id: 'method',
    header: 'Method',
    render: (payment) => (
      <Badge variant="secondary" className="w-fit text-xs capitalize">
        {payment.method}
      </Badge>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    render: (payment) => <StatusBadge status={payment.status} />,
  },
]

export function StudentDetailPage({ student, admission, payments }: StudentDetailPageProps) {
  const personalDetails: DetailItem[] = [
    { label: 'Full name', value: student.name, icon: <UserRound className="h-4 w-4" /> },
    { label: 'Student ID', value: `STU-${student.id.toString().padStart(4, '0')}`, icon: <Hash className="h-4 w-4" /> },
    { label: 'Email', value: student.email, icon: <Mail className="h-4 w-4" /> },
    { label: 'Phone', value: student.contactNo ?? 'Not provided', icon: <Phone className="h-4 w-4" /> },
    { label: 'Address', value: admission.address, icon: <MapPin className="h-4 w-4" /> },
  ]

  const guardianDetails: DetailItem[] = [
    { label: 'Primary guardian', value: admission.guardianName, icon: <Shield className="h-4 w-4" /> },
    { label: 'Relationship', value: admission.guardianRelation ?? 'Not specified', icon: <Users className="h-4 w-4" /> },
    { label: 'Guardian phone', value: admission.guardianPhone, icon: <Phone className="h-4 w-4" /> },
    { label: 'Guardian email', value: admission.guardianEmail, icon: <Mail className="h-4 w-4" /> },
  ]

  const academicDetails: DetailItem[] = [
    { label: 'Previous school', value: admission.previousSchool, icon: <School className="h-4 w-4" /> },
    { label: 'Admission date', value: dateFormatter.format(new Date(admission.admissionDate)), icon: <CalendarCheck className="h-4 w-4" /> },
    { label: 'Session', value: admission.session, icon: <CalendarCheck className="h-4 w-4" /> },
    { label: 'Application ID', value: admission.applicationId, icon: <ClipboardList className="h-4 w-4" /> },
  ]

  const programDetails: DetailItem[] = [
    { label: 'Enrolled program', value: admission.enrolledProgram, icon: <GraduationCap className="h-4 w-4" /> },
    { label: 'Class level', value: student.studentClass ?? 'Not provided', icon: <BookOpenCheck className="h-4 w-4" /> },
    { label: 'Batch', value: student.batch ?? 'Not assigned', icon: <Users className="h-4 w-4" /> },
    { label: 'Payment plan', value: admission.paymentPlan, icon: <CreditCard className="h-4 w-4" /> },
  ]

  const paymentCountLabel =
    payments.length === 0 ? 'No payments yet' : `${payments.length} payment${payments.length === 1 ? '' : 's'} logged`

  const completedPayments = payments.filter((payment) => payment.status === 'paid')
  const totalPaid = completedPayments.reduce((sum, payment) => sum + payment.amount, 0)

  const lastPayment = completedPayments.reduce<PaymentRecord | null>((latest, payment) => {
    if (!latest) return payment
    return new Date(payment.date) > new Date(latest.date) ? payment : latest
  }, null)

  const lastPaymentLabel = lastPayment
    ? `${currencyFormatter.format(lastPayment.amount)} • ${dateFormatter.format(new Date(lastPayment.date))}`
    : paymentCountLabel

  const quickStats: QuickStat[] = [
    {
      label: 'Application',
      value: admission.applicationId,
      hint: admission.session,
      icon: <ClipboardList className="h-4 w-4" />,
      accent: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
    },
    {
      label: 'Enrollment',
      value: admission.enrolledProgram,
      hint: student.studentClass ?? 'Class not set',
      icon: <GraduationCap className="h-4 w-4" />,
      accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    },
    {
      label: 'Payment plan',
      value: admission.paymentPlan,
      hint: paymentCountLabel,
      icon: <CreditCard className="h-4 w-4" />,
      accent: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
    },
    {
      label: 'Total paid',
      value: currencyFormatter.format(totalPaid),
      hint: lastPaymentLabel,
      icon: <Coins className="h-4 w-4" />,
      accent: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <DetailBreadcrumbs name={student.name} />
      <StudentHero student={student} admission={admission} />
      <QuickStatsGrid stats={quickStats} />
      <div className="grid gap-4 lg:grid-cols-3">
        <DetailCard
          title="Personal Details"
          description="Pulled from the student's admission form."
          items={personalDetails}
          icon={<UserRound className="h-5 w-5" />}
        />
        <DetailCard
          title="Guardian & Emergency Contact"
          description="Used for urgent communication and consent."
          items={guardianDetails}
          icon={<Shield className="h-5 w-5" />}
        />
        <PaymentSnapshotCard
          totalPaid={totalPaid}
          paymentPlan={admission.paymentPlan}
          paymentCountLabel={paymentCountLabel}
          lastPaymentLabel={lastPaymentLabel}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DetailCard
          title="Academic Background"
          description="Highlights what the student reported before admission."
          items={academicDetails}
          icon={<BookOpenCheck className="h-5 w-5" />}
        />
        <DetailCard
          title="Program & Enrollment"
          description="Class placement and payment planning."
          items={programDetails}
          icon={<GraduationCap className="h-5 w-5" />}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Filtered automatically for this student.</CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardDataTable
            data={payments}
            columns={paymentColumns}
            emptyMessage="No payments recorded yet for this student."
          />
        </CardContent>
      </Card>
    </div>
  )
}

function DetailBreadcrumbs({ name }: { name: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex items-center gap-2 text-sm"
    >
      <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <span>/</span>
      <Link href="/dashboard/students" className="hover:text-foreground">
        Students
      </Link>
      <span>/</span>
      <span className="text-foreground">{name}</span>
    </nav>
  )
}

function StudentHero({
  student,
  admission,
}: {
  student: Student
  admission: StudentAdmissionDetail
}) {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false)
  const hasPhoto = Boolean(student.avatar)

  useEffect(() => {
    if (!isPhotoOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPhotoOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPhotoOpen])

  return (
    <Card className="relative overflow-hidden border bg-gradient-to-br from-primary/5 via-background to-primary/10 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <CardHeader className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative h-24 w-24">
            <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback className="text-xl">{initials(student.name)}</AvatarFallback>
            </Avatar>
            {hasPhoto && (
              <button
                type="button"
                aria-label="View full-size photo"
                onClick={() => setIsPhotoOpen(true)}
                className="absolute inset-0 rounded-full overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#ff6a2b] shadow-md">
                    <Plus className="w-4 h-4 text-white" />
                  </span>
                </span>
              </button>
            )}
          </div>
          <div>
            <CardTitle className="text-3xl font-semibold">{student.name}</CardTitle>
            <CardDescription className="text-base text-foreground/80">{student.email}</CardDescription>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={student.status} />
              <Badge variant="outline">{student.studentClass ?? 'Class not set'}</Badge>
              <Badge variant="secondary">Batch {student.batch ?? 'TBD'}</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/students">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to list
            </Link>
          </Button>
          <Button>Edit profile</Button>
        </div>
      </CardHeader>
      <CardContent className="relative z-10 grid gap-4 md:grid-cols-3">
        <InfoItem label="Primary contact" value={student.contactNo ?? 'Not provided'} icon={<Phone className="h-4 w-4" />} />
        <InfoItem label="Email" value={student.email} icon={<Mail className="h-4 w-4" />} />
        <InfoItem label="Address" value={admission.address} icon={<MapPin className="h-4 w-4" />} />
      </CardContent>

      {isPhotoOpen && hasPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          aria-modal
          role="dialog"
          onClick={() => setIsPhotoOpen(false)}
        >
          <button
            aria-label="Close"
            onClick={() => setIsPhotoOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
          >
            <X className="w-7 h-7" />
          </button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={student.avatar as string}
              alt={`${student.name} photo`}
              className="max-h-[96vh] max-w-[96vw] object-contain select-none rounded-md"
            />
          </div>
        </div>
      )}
    </Card>
  )
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string
  value?: ReactNode
  icon: ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{value ?? 'Not provided'}</p>
        </div>
      </div>
    </div>
  )
}

function DetailCard({
  title,
  description,
  items,
  icon,
}: {
  title: string
  description?: string
  items: DetailItem[]
  icon?: ReactNode
}) {
  return (
    <Card className="h-full bg-card shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          {icon && <div className="rounded-full bg-primary/10 p-2 text-primary">{icon}</div>}
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <DetailRow key={item.label} label={item.label} value={item.value} icon={item.icon} />
        ))}
      </CardContent>
    </Card>
  )
}

function PaymentSnapshotCard({
  totalPaid,
  paymentPlan,
  paymentCountLabel,
  lastPaymentLabel,
}: {
  totalPaid: number
  paymentPlan: string
  paymentCountLabel: string
  lastPaymentLabel: string
}) {
  const items = [
    { label: 'Plan', value: paymentPlan, icon: <CreditCard className="h-4 w-4" /> },
    { label: 'Payments logged', value: paymentCountLabel, icon: <ClipboardList className="h-4 w-4" /> },
    { label: 'Last payment', value: lastPaymentLabel, icon: <CalendarCheck className="h-4 w-4" /> },
  ]

  return (
    <Card className="h-full bg-card shadow-sm">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Payment Snapshot</CardTitle>
            <CardDescription>Quick overview of billing status.</CardDescription>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total paid</p>
          <p className="text-3xl font-semibold text-foreground">{currencyFormatter.format(totalPaid)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3 rounded-2xl border bg-background/70 p-3">
            <div className="rounded-lg bg-muted/60 p-2 text-muted-foreground">{item.icon}</div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function DetailRow({ label, value, icon }: DetailItem) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-muted/40 p-4">
      {icon && <div className="rounded-lg bg-muted/60 p-2 text-muted-foreground">{icon}</div>}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{value ?? 'Not provided'}</p>
      </div>
    </div>
  )
}

type DetailItem = {
  label: string
  value?: ReactNode
  icon?: ReactNode
}

type QuickStat = {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon: ReactNode
  accent: string
}

function QuickStatsGrid({ stats }: { stats: QuickStat[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={String(stat.label)}
          className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow"
        >
          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <div className={`rounded-full p-2 ${stat.accent}`}>{stat.icon}</div>
            {stat.label}
          </div>
          <p className="mt-3 text-lg font-semibold leading-tight text-foreground">{stat.value}</p>
          {stat.hint && <p className="text-xs text-muted-foreground">{stat.hint}</p>}
        </div>
      ))}
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
