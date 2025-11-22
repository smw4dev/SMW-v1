import { cn } from '@/lib/utils'

type Status = 'active' | 'inactive' | 'paused' | 'vacation' | string

const STATUS_STYLES: Record<string, string> = {
  active:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  inactive:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  approved:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  paused:
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  vacation:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  paid:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  pending:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  overdue:
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  failed:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  reviewed:
    'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  submitted:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  draft:
    'bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200',
  rejected:
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

type StatusBadgeProps = {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase',
        STATUS_STYLES[status] ??
          'bg-slate-200 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200',
        className,
      )}
    >
      {status}
    </span>
  )
}
