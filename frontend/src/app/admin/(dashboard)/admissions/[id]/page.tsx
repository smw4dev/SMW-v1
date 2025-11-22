import { notFound } from 'next/navigation'

import { AdmissionApplicationDetailContainer } from '@/components/dashboard/admission-application-detail-container'

export default function AdmissionApplicationDetailRoute({
  params,
}: {
  params: { id: string }
}) {
  const applicationId = Number(params.id)

  if (Number.isNaN(applicationId)) {
    notFound()
  }

  return <AdmissionApplicationDetailContainer applicationId={applicationId} />
}
