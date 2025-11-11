'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { DashboardNavbar } from './dashboard-navbar'
import { DashboardOverview } from './dashboard-overview'
import { DashboardSidebar } from './dashboard-sidebar'

type DashboardLayoutProps = {
  children?: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    if (!sidebarOpen) {
      return
    }

    const prefersMobile = window.matchMedia('(max-width: 767px)').matches
    if (!prefersMobile) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [sidebarOpen])

  const handleSidebarClose = React.useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const handleToggleSidebar = React.useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  return (
    <ThemeProvider>
      <div className="bg-muted/10 text-foreground relative flex min-h-screen w-full">
        <DashboardSidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          pathname={pathname}
        />
        <div className="relative flex min-h-screen flex-1 flex-col">
          <DashboardNavbar onToggleSidebar={handleToggleSidebar} />
          <main className="bg-background flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-12">
            {children ?? <DashboardOverview />}
          </main>
        </div>
        {sidebarOpen ? (
          <button
            aria-label="Close sidebar overlay"
            onClick={handleSidebarClose}
            className="bg-slate-900/60 fixed inset-0 z-40 md:hidden"
            type="button"
          />
        ) : null}
      </div>
    </ThemeProvider>
  )
}
