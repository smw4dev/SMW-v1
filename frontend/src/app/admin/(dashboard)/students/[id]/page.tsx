import { notFound } from 'next/navigation'

import { StudentDetailPage } from '@/components/dashboard/student-detail-page'
import {
  paymentsTable,
  studentAdmissions,
  usersTable,
  type StudentAdmissionDetail,
} from '@/components/dashboard/data'

export default function StudentDetailRoute({
  params,
}: {
  params: { id: string }
}) {
  const studentId = Number(params.id)

  if (Number.isNaN(studentId)) {
    notFound()
  }

  const student = usersTable.find((entry) => entry.id === studentId)

  if (!student) {
    notFound()
  }

  const admission =
    studentAdmissions.find((entry) => entry.studentId === student.id) ??
    buildFallbackAdmission(student)

  const payments = paymentsTable.filter(
    (payment) =>
      payment.studentEmail === student.email ||
      payment.studentName.toLowerCase() === student.name.toLowerCase()
  )

  return (
    <StudentDetailPage student={student} admission={admission} payments={payments} />
  )
}

function buildFallbackAdmission(
  student: (typeof usersTable)[number],
): StudentAdmissionDetail {
  return {
    studentId: student.id,
    applicationId: `APP-${new Date().getFullYear()}-${student.id.toString().padStart(4, '0')}`,
    guardianName: `${student.name.split(' ')[0]} Guardian`,
    guardianRelation: 'Guardian',
    guardianPhone: student.contactNo ?? '+880 1XXX-XXXXXX',
    guardianEmail: `parent.${student.email}`,
    address: 'Address on file',
    previousSchool: 'Provided during admission',
    enrolledProgram: student.studentClass ?? 'Program TBD',
    session: 'Current Academic Session',
    admissionDate: new Date().toISOString(),
    paymentPlan: 'Standard plan',
    documents: [
      { label: 'Birth Certificate', status: 'received' },
      { label: 'Transfer Certificate', status: 'pending' },
    ],
    notes: 'Auto-generated record from student profile.',
  }
}
