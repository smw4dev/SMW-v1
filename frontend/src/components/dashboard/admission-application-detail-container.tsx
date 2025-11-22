'use client'

import * as React from 'react'
import Link from 'next/link'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { AdmissionApplicationDetailPage } from './admission-application-detail-page'
import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { buildApiUrl } from '@/lib/api-client'
import {
  type AdmissionApplicationApi,
  type AdmissionApplicationRecord,
  mapAdmissionApplication,
} from '@/lib/admissions'

type DetailContainerProps = {
  applicationId: number
}

export function AdmissionApplicationDetailContainer({
  applicationId,
}: DetailContainerProps) {
  const { fetchWithAuth } = useAuth()
  const [application, setApplication] = React.useState<AdmissionApplicationRecord | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const loadApplication = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchWithAuth(buildApiUrl(`/admissions/${applicationId}/`))
      if (response.status === 404) {
        setApplication(null)
        setError('This application was not found or may have been removed.')
        return
      }
      if (!response.ok) {
        const payload = await response.text()
        throw new Error(payload || 'Unable to load the application.')
      }
      const data = (await response.json()) as AdmissionApplicationApi
      setApplication(mapAdmissionApplication(data))
    } catch (err) {
      console.error('Failed to load admission application', err)
      setApplication(null)
      setError(err instanceof Error ? err.message : 'Unable to load application.')
    } finally {
      setLoading(false)
    }
  }, [applicationId, fetchWithAuth])

  React.useEffect(() => {
    loadApplication()
  }, [loadApplication])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading application...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-5 w-5" />
          {error ?? 'Application not available.'}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={loadApplication}>
            Retry
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/admissions">Return to list</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <AdmissionApplicationDetailPage application={application} />
}
