import * as React from 'react'

import { cn } from '@/lib/utils'

type ActionIconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'destructive' | 'ghost'
}

export function ActionIconButton({
  className,
  variant = 'default',
  ...props
}: ActionIconButtonProps) {
  const variantClasses =
    variant === 'destructive'
      ? 'border-rose-300/60 text-rose-500 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-300 dark:hover:bg-rose-900/40'
      : variant === 'ghost'
        ? 'border-transparent text-muted-foreground hover:bg-muted/70'
        : 'border-border text-muted-foreground hover:bg-muted/70'

  return (
    <button
      type="button"
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full border transition',
        variantClasses,
        className,
      )}
      {...props}
    />
  )
}
