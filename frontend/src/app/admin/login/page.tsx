'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2, ShieldCheck } from 'lucide-react'

import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, user, initializing } = useAuth()
  const [formState, setFormState] = React.useState({ email: '', password: '' })
  const [error, setError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (!initializing && user?.isStaff) {
      router.replace('/admin')
    }
  }, [initializing, user, router])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    const result = await login({
      email: formState.email.trim().toLowerCase(),
      password: formState.password,
    })

    if (!result.success) {
      setError(result.message ?? 'Unable to sign in. Please try again later.')
    }

    setSubmitting(false)
  }

  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-10">
      <div className="bg-background/95 w-full max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="bg-primary/10 text-primary mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold">Admin Access</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in with your staff credentials to manage Sunny&apos;s Math World.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formState.email}
              onChange={handleChange}
              disabled={submitting || initializing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleChange}
              disabled={submitting || initializing}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={submitting || initializing}>
            {submitting || initializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Need help? Contact your super admin or{' '}
          <Link href="/" className="font-medium text-primary hover:underline">
            return to the main site
          </Link>
        </p>
      </div>
    </div>
  )
}
