'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Download,
  Hash,
  Home,
  Megaphone,
  Mail,
  MapPin,
  Phone,
  School,
  Shield,
  Sparkles,
  User,
  Users,
  Plus,
  X,
} from 'lucide-react'

import type { AdmissionApplicationRecord } from '@/lib/admissions'
import { StatusBadge } from './status-badge'
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

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const sexLabelMap: Record<string, string> = {
  M: 'Male',
  F: 'Female',
  O: 'Other',
}

type DetailItem = {
  label: string
  value?: ReactNode
  icon?: ReactNode
}

export function AdmissionApplicationDetailPage({
  application,
}: {
  application: AdmissionApplicationRecord
}) {
  const submissionDate = new Date(application.createdAt)
  const updatedDate = application.updatedAt ? new Date(application.updatedAt) : submissionDate
  const batchLabel = application.batchDetail?.label ?? application.batch
  const statusLabel = application.status || 'pending'
  const scheduleParts = [application.batchDetail?.days, application.batchDetail?.timeSlot].filter(
    (part): part is string => typeof part === 'string' && part.trim().length > 0,
  )
  const scheduleLabel = scheduleParts.length ? scheduleParts.join(' • ') : null

  const profileItems: DetailItem[] = [
    {
      label: 'Full name',
      value: application.studentName,
      icon: <User className="h-4 w-4" />,
    },
    {
      label: 'Nickname',
      value: application.studentNickName,
      icon: <Sparkles className="h-4 w-4" />,
    },
    {
      label: 'Date of birth',
      value: dateFormatter.format(new Date(application.dateOfBirth)),
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: 'Gender',
      value: sexLabelMap[application.sex] ?? application.sex,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: 'Home district',
      value: application.homeDistrict ?? application.homeLocation,
      icon: <MapPin className="h-4 w-4" />,
    },
  ]

  const contactItems: DetailItem[] = [
    {
      label: 'Primary phone',
      value: application.studentMobile,
      icon: <Phone className="h-4 w-4" />,
    },
    {
      label: 'Email',
      value: application.studentEmail ? (
        <a
          href={`mailto:${application.studentEmail}`}
          className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-300"
        >
          {application.studentEmail}
        </a>
      ) : undefined,
      icon: <Mail className="h-4 w-4" />,
    },
    {
      label: 'Present address',
      value: application.homeLocation,
      icon: <MapPin className="h-4 w-4" />,
    },
  ]

  const academicItems: DetailItem[] = [
    {
      label: 'Current school',
      value: application.school,
      icon: <School className="h-4 w-4" />,
    },
    {
      label: 'JSC result',
      value: application.jscResult ? (
        <Badge variant="secondary">{application.jscResult}</Badge>
      ) : undefined,
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      label: 'SSC result',
      value: application.sscResult ? (
        <Badge variant="secondary">{application.sscResult}</Badge>
      ) : undefined,
      icon: <ClipboardList className="h-4 w-4" />,
    },
    {
      label: 'Batch schedule',
      value: scheduleLabel,
      icon: <CalendarDays className="h-4 w-4" />,
    },
  ]

  const applicationItems: DetailItem[] = [
    {
      label: 'Status',
      value: <StatusBadge status={statusLabel} />,
      icon: <Hash className="h-4 w-4" />,
    },
    {
      label: 'Review status',
      value: application.isReviewed ? 'Reviewed' : 'Pending',
      icon: <Shield className="h-4 w-4" />,
    },
    {
      label: 'Created on',
      value: dateTimeFormatter.format(submissionDate),
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: 'Updated on',
      value: dateTimeFormatter.format(updatedDate),
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      label: 'Previous student',
      value: application.prevStudent ? 'Yes' : 'No',
      icon: <School className="h-4 w-4" />,
    },
    {
      label: 'How heard about us',
      value: application.hearAboutUs,
      icon: <Megaphone className="h-4 w-4" />,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <DetailBreadcrumbs application={application} />
      <ApplicationHero application={application} />
      <div className="grid gap-4 lg:grid-cols-3">
        <DetailCard
          title="Student Profile"
          description="Pulled directly from the admission form."
          items={profileItems}
        />
        <DetailCard
          title="Academic Background"
          description="Latest school info and exam results."
          items={academicItems}
        />
        <DetailCard
          title="Application Insights"
          description="Key indicators for this application."
          items={applicationItems}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DetailCard
          title="Contact & Location"
          description="Use these details for any outreach."
          items={contactItems}
        />
        <GuardiansCard guardians={application.guardians} />
      </div>
    </div>
  )
}

function DetailBreadcrumbs({
  application,
}: {
  application: AdmissionApplicationRecord
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex items-center gap-2 text-sm"
    >
      <Link href="/admin" className="hover:text-foreground flex items-center gap-1">
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <span>/</span>
      <Link href="/admin/admissions" className="hover:text-foreground">
        Applications
      </Link>
      <span>/</span>
      <span className="text-foreground">{application.applicationNumber}</span>
    </nav>
  )
}

function ApplicationHero({ application }: { application: AdmissionApplicationRecord }) {
  const sexLabel = sexLabelMap[application.sex] ?? application.sex
  const batchLabel = application.batchDetail?.label ?? application.batch
  const [isPhotoOpen, setIsPhotoOpen] = useState(false)
  const hasPhoto = Boolean(application.picture)
  const groupLabel = application.groupName ?? application.batchDetail?.groupName ?? null
  const subjectLabel =
    application.subject ??
    application.batchDetail?.courseTitle ??
    application.batchDetail?.courseGradeLevel ??
    null
  const placementBadges = [
    application.currentClass
      ? { key: 'class', label: 'Class', value: application.currentClass }
      : null,
    groupLabel ? { key: 'group', label: 'Group', value: groupLabel } : null,
    subjectLabel ? { key: 'subject', label: 'Subject', value: subjectLabel } : null,
  ].filter(
    (badge): badge is { key: string; label: string; value: string } => badge !== null,
  )

  useEffect(() => {
    if (!isPhotoOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPhotoOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPhotoOpen])

  return (
    <Card className="relative overflow-hidden border bg-gradient-to-br from-primary/5 via-background to-orange-50 shadow-sm dark:to-primary/10">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(59,130,246,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      <CardHeader className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative h-24 w-24">
            <Avatar className="h-24 w-24 ring-4 ring-background shadow-lg">
              <AvatarImage src={application.picture ?? undefined} alt={application.studentName} />
              <AvatarFallback className="text-xl">
                {initials(application.studentName)}
              </AvatarFallback>
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
            <CardTitle className="text-3xl font-semibold">{application.studentName}</CardTitle>
            <CardDescription className="text-base text-foreground/80">
              Class placement & preferences
            </CardDescription>
            {placementBadges.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {placementBadges.map((badge) => (
                  <Badge key={badge.key} variant="outline" className="text-xs">
                    {badge.label}: {badge.value}
                  </Badge>
                ))}
              </div>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {batchLabel ? (
                <Badge variant="secondary" className="text-xs">
                  Batch: {batchLabel}
                </Badge>
              ) : null}
              <Badge variant="outline" className="text-xs">
                App ID: {application.applicationNumber}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" className="text-sm">
              <Link href="/admin/admissions">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Link>
            </Button>
            <Button variant="outline" className="text-sm">
              <Download className="mr-2 h-4 w-4" />
              Export summary
            </Button>
          </div>
        </div>
      </CardHeader>
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
              src={application.picture as string}
              alt={`${application.studentName} photo`}
              className="max-h-[96vh] max-w-[96vw] object-contain select-none rounded-md"
            />
          </div>
        </div>
      )}
    </Card>
  )
}

function DetailCard({
  title,
  description,
  items,
}: {
  title: string
  description?: string
  items: DetailItem[]
}) {
  return (
    <Card className="h-full bg-card shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="grid gap-3">
        {items.map((item) => (
          <DetailRow key={item.label} label={item.label} value={item.value} icon={item.icon} />
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
        <div className="mt-1 text-sm font-semibold text-foreground">
          {value ?? <span className="text-muted-foreground/80">Not provided</span>}
        </div>
      </div>
    </div>
  )
}

function GuardiansCard({
  guardians,
}: {
  guardians: AdmissionApplicationRecord['guardians']
}) {
  return (
    <Card className="h-full bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Parents & Guardians</CardTitle>
        <CardDescription>Contact points listed in the application.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {guardians.length === 0 ? (
          <p className="text-sm text-muted-foreground">No guardian data supplied.</p>
        ) : (
          guardians.map((guardian) => (
            <div
              key={guardian.id ?? `${guardian.role}-${guardian.name}`}
              className="rounded-2xl border bg-muted/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{guardian.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {guardian.role}
                    {guardian.isPrimaryContact ? ' • Guardian' : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {guardian.isPrimaryContact ? (
                    <Badge variant="secondary" className="text-xs">
                      Primary guardian
                    </Badge>
                  ) : null}
                  <Badge variant="outline" className="text-xs">
                    {guardian.occupation ?? 'Occupation not shared'}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {guardian.contactNumber ?? 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
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
