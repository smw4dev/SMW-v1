'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  BarChart2,
  Box,
  Code2,
  CreditCard,
  PiggyBank,
  Eye,
  History,
  Home,
  Settings,
  SlidersHorizontal,
  UserCircle2,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// removed collapsible menu items per request
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { navSections } from './data'

const HOME_PATH = '/dashboard'

function isPathActive(pathname: string | null, href?: string) {
  if (!href || !pathname) return false
  if (href === HOME_PATH) {
    return pathname === HOME_PATH
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

const iconMap = {
  Home,
  Users,
  CreditCard,
  PiggyBank,
  UserCircle2,
  Box,
  BarChart2,
  Code2,
  Eye,
  Settings,
  History,
}

type DashboardSidebarProps = {
  open: boolean
  onClose: () => void
  pathname: string | null
}

export function DashboardSidebar({ open, onClose, pathname }: DashboardSidebarProps) {

  React.useEffect(() => {
    if (!open) {
      return
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, open])

  return (
    <aside
      className={cn(
        'bg-sidebar/95 text-sidebar-foreground supports-[backdrop-filter]:backdrop-blur fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border px-4 py-5 shadow-lg transition-transform duration-200',
        'md:sticky md:top-0 md:self-start md:h-screen md:translate-x-0 md:bg-sidebar md:z-0 md:overflow-y-auto',
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      )}
    >
      <div className="flex flex-1 flex-col justify-between gap-8">
        <div className="flex flex-col gap-8">
          {/* Company logo only */}
          <div className="flex items-center">
            <Avatar aria-label="Company" className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white">
              <AvatarFallback className="font-semibold">SMW</AvatarFallback>
            </Avatar>
          </div>

          <nav className="flex flex-col gap-6">
            <SidebarLink
              icon={Home}
              label="Home"
              href={HOME_PATH}
              active={isPathActive(pathname, HOME_PATH)}
              onNavigate={onClose}
            />

            {navSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </span>
                <div className="flex flex-col gap-2">
                  {section.items.map((item) => {
                    // The 'Balances' collapsible is removed; only direct links remain

                    const IconComponent =
                      iconMap[item.icon as keyof typeof iconMap] ?? iconMap.Home
                    return (
                      <SidebarLink
                        key={item.label}
                        icon={IconComponent}
                        label={item.label}
                        href={item.href}
                        active={isPathActive(pathname, item.href)}
                        onNavigate={onClose}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Settings</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Adjustments</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    alt="Profile"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Profile</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  )
}

type SidebarLinkProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  href?: string
  active?: boolean
  onNavigate: () => void
}

function SidebarLink({
  icon: Icon,
  label,
  href,
  active,
  onNavigate,
}: SidebarLinkProps) {
  const handleClick = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onNavigate()
    }
  }, [onNavigate])

  return (
    <Button
      variant="ghost"
      className={cn(
        'flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium',
        active
          ? 'bg-primary/10 text-primary hover:bg-primary/20'
          : 'hover:bg-muted/60',
      )}
      onClick={handleClick}
      asChild={Boolean(href)}
    >
      {href ? (
        <Link href={href} className="flex w-full items-center gap-3">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{label}</span>
          {label === 'Students' ? (
            <Badge variant="secondary" className="ml-auto">
              24
            </Badge>
          ) : null}
        </Link>
      ) : (
        <span className="flex w-full items-center gap-3">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{label}</span>
        </span>
      )}
    </Button>
  )
}
