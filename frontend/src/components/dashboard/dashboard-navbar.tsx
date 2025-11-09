'use client'

import * as React from 'react'
import {
  Bell,
  Github,
  LifeBuoy,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Sun,
  User,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/components/theme/ThemeProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type DashboardNavbarProps = {
  onToggleSidebar: () => void
}

export function DashboardNavbar({ onToggleSidebar }: DashboardNavbarProps) {
  const { mode, toggleMode } = useTheme()
  const isDark = mode === 'dark'

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-4 md:px-8 supports-[backdrop-filter]:backdrop-blur">
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      <nav className="flex items-center gap-2">

        <NotificationsDropdown />


        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleMode}
        >
          <Sun className={cn('h-5 w-5', isDark ? 'hidden' : 'block')} />
          <Moon className={cn('absolute h-5 w-5', isDark ? 'block' : 'hidden')} />
        </Button>

        <UserDropdown />
      </nav>
    </header>
  )
}

function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute right-1 top-1 h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center border-transparent bg-emerald-500 text-[10px] font-semibold text-white">
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end" sideOffset={12}>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col gap-2">
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
            <span className="text-sm font-semibold">
              Payment from Acme Co.
            </span>
            <span className="text-xs text-muted-foreground">
              $3,200.00 · 2 hours ago
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
            <span className="text-sm font-semibold">
              New customer sign-up
            </span>
            <span className="text-xs text-muted-foreground">
              Jane Fisher · 6 hours ago
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
            <span className="text-sm font-semibold">
              System update deployed
            </span>
            <span className="text-xs text-muted-foreground">
              Release 2.10.3 · Yesterday
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="User menu">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              alt="Jane Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" sideOffset={12}>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Jane Doe</span>
            <span className="text-xs text-muted-foreground">
              jane.doe@example.com
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircle className="mr-2 h-4 w-4" />
            Support
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            Help Center
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
