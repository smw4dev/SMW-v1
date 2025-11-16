'use client'

import * as React from 'react'
import Link from 'next/link'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Pencil,
  Star,
  Users,
  Trash2,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  agents,
  balanceCards,
  chartConfig,
  chartData,
  transactions,
  usersTable,
} from './data'
import { ActionIconButton } from './action-icon-button'
import { StatusBadge } from './status-badge'

export function DashboardOverview() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="flex flex-col gap-8">
          <BalanceCards />
          <StatisticsCard />
        </div>
        <div className="flex flex-col gap-6">
          <AgentsCard />
          <TransactionsCard />
        </div>
      </section>

      <LatestUsersTable />
    </div>
  )
}

function BalanceCards() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Available Balance
          </h2>
          <p className="text-muted-foreground text-sm">
            Overview of key insurance accounts
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {balanceCards.map((card) => (
          <Card
            key={card.title}
            className={cn(
              'rounded-2xl border-none shadow-lg',
              'bg-gradient-to-br',
              card.background,
            )}
          >
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-background/20 flex h-12 w-12 items-center justify-center rounded-full">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm uppercase tracking-wide opacity-80">
                    {card.subtitle}
                  </p>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-semibold">{card.value}</span>
                <span className={cn('text-sm font-medium', card.trendColor)}>
                  {card.trend}
                </span>
              </div>
              <div className="flex flex-wrap gap-6 text-sm">
                {card.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <StatIcon icon={stat.icon} colorClass={stat.color} />
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function StatIcon({
  icon,
  colorClass,
}: {
  icon: string
  colorClass?: string
}) {
  const className = cn('h-4 w-4', colorClass)
  if (icon === 'arrow-up') {
    return <ArrowUp className={className} />
  }
  if (icon === 'arrow-down') {
    return <ArrowDown className={className} />
  }
  return <Star className={className} />
}

function StatisticsCard() {
  return (
    <Card className="rounded-2xl border-none bg-muted/40 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl font-semibold">Statistics</CardTitle>
          <CardDescription>
            Performance comparison between segments
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[420px] w-full rounded-xl border bg-background/80 p-6"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="series1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-series1)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-series1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="series2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-series2)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-series2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="series1"
              stroke="var(--color-series1)"
              fill="url(#series1)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="series2"
              stroke="var(--color-series2)"
              fill="url(#series2)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function AgentsCard() {
  return (
    <Card className="rounded-2xl border-none bg-muted/40 shadow-lg">
      <CardContent className="space-y-5 pt-6">
        <div className="flex items-center justify-center">
          <div className="border-border/70 flex w-40 flex-col items-center gap-1 rounded-xl border-2 border-dashed px-4 py-3">
            <span className="text-lg">⭐</span>
            <p className="text-lg font-semibold">Agents</p>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Meet your agents and review their rank to get the best results.
        </p>
        <div className="flex justify-center">
          <div className="-space-x-3 flex">
            {agents.map((url, index) => (
              <Avatar
                key={url}
                className="h-12 w-12 border-2 border-background"
                style={{ zIndex: agents.length - index }}
              >
                <AvatarImage src={url} alt="" />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
            ))}
            <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full border-2 border-background text-sm font-semibold">
              +12
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TransactionsCard() {
  return (
    <Card className="rounded-2xl border-none bg-muted/40 shadow-lg">
      <CardHeader>
        <CardTitle>Latest Transactions</CardTitle>
        <CardDescription>Most recent insurance payouts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.name}
            className="flex flex-col gap-3 rounded-xl border border-transparent bg-background/60 px-3 py-3 transition hover:border-border sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={transaction.avatar} alt="" />
                <AvatarFallback>TX</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {transaction.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {transaction.date}
                </span>
              </div>
            </div>
            <span className="text-emerald-500 text-sm font-semibold sm:ml-auto">
              {transaction.amount}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function LatestUsersTable() {
  return (
    <Card className="rounded-2xl border-none bg-muted/40 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Latest Students</CardTitle>
          <CardDescription>
            Recently onboarded students and their status.
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/students" className="text-sm font-medium">
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersTable.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.role}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.team}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <ActionIconButton aria-label="View user">
                  <Eye className="h-4 w-4" />
                </ActionIconButton>
                <ActionIconButton aria-label="Edit user">
                  <Pencil className="h-4 w-4" />
                </ActionIconButton>
                <ActionIconButton aria-label="Delete user" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </ActionIconButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
