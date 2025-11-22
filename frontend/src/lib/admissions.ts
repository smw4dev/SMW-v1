export type BatchDetail = {
  id: number
  label: string
  batchNumber?: string | null
  className?: string | null
  groupName?: string | null
  days?: string | null
  timeSlot?: string | null
  courseTitle?: string | null
  courseGradeLevel?: string | null
}

export type AdmissionGuardian = {
  id?: number
  role: string
  name: string
  occupation?: string | null
  contactNumber?: string | null
  email?: string | null
  isPrimaryContact?: boolean
}

export type AdmissionApplicationRecord = {
  id: number
  applicationNumber: string
  studentName: string
  studentNickName?: string | null
  dateOfBirth: string
  sex: string
  currentClass: string
  batch?: string | null
  batchDetail?: BatchDetail
  jscResult?: string | null
  sscResult?: string | null
  jscSchoolName?: string | null
  sscSchoolName?: string | null
  studentMobile?: string | null
  studentEmail?: string | null
  homeLocation?: string | null
  homeDistrict?: string | null
  picture?: string | null
  isSubmitted: boolean
  isReviewed: boolean
  isApproved: boolean
  status: string
  statusRaw?: string
  school?: string | null
  createdAt: string
  updatedAt?: string | null
  guardians: AdmissionGuardian[]
  groupName?: string | null
  subject?: string | null
  prevStudent?: boolean
  hearAboutUs?: string | null
}

export type BatchDetailApi = {
  id: number
  label?: string | null
  batch_number?: string | null
  class_name?: string | null
  group_name?: string | null
  days?: string | null
  time_slot?: string | null
  course?: {
    id: number
    title?: string | null
    grade_level?: string | null
  } | null
}

export type AdmissionGuardianApi = {
  id: number
  role: string
  name: string
  occupation?: string | null
  contact_number?: string | null
  email_address?: string | null
  is_primary_contact?: boolean
}

export type AdmissionApplicationApi = {
  id: number
  student_name: string
  student_nick_name?: string | null
  home_district?: string | null
  date_of_birth: string
  sex: string
  current_class: string
  group_name?: string | null
  subject?: string | null
  jsc_school_name?: string | null
  jsc_result?: string | null
  ssc_school_name?: string | null
  ssc_result?: string | null
  batch?: number | null
  batch_detail?: BatchDetailApi | null
  student_mobile?: string | null
  student_email?: string | null
  home_location?: string | null
  picture?: string | null
  hear_about_us?: string | null
  prev_student?: boolean
  status?: string | null
  is_reviewed?: boolean
  user?: number | null
  created_at: string
  updated_at?: string | null
  guardians?: AdmissionGuardianApi[]
}

const STATUS_FALLBACK = 'pending'

export function formatApplicationNumber(id: number) {
  return `APP-${String(id).padStart(4, '0')}`
}

export function normalizeStatus(value?: string | null) {
  return (value ?? STATUS_FALLBACK).toLowerCase()
}

function mapBatchDetail(detail?: BatchDetailApi | null): BatchDetail | undefined {
  if (!detail) return undefined
  const course = detail.course
  const computedLabel =
    [
      course?.grade_level,
      detail.batch_number ? `Batch ${detail.batch_number}` : null,
      detail.group_name ? `(${detail.group_name})` : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined
  const label = detail.label ?? computedLabel

  return {
    id: detail.id,
    label: label ?? `Batch #${detail.id}`,
    batchNumber: detail.batch_number,
    className: detail.class_name,
    groupName: detail.group_name,
    days: detail.days,
    timeSlot: detail.time_slot,
    courseTitle: course?.title ?? null,
    courseGradeLevel: course?.grade_level ?? null,
  }
}

function mapGuardian(guardian: AdmissionGuardianApi): AdmissionGuardian {
  return {
    id: guardian.id,
    role: guardian.role,
    name: guardian.name,
    occupation: guardian.occupation ?? null,
    contactNumber: guardian.contact_number ?? null,
    email: guardian.email_address ?? null,
    isPrimaryContact: Boolean(guardian.is_primary_contact),
  }
}

export function mapAdmissionApplication(api: AdmissionApplicationApi): AdmissionApplicationRecord {
  const statusRaw = api.status ?? 'PENDING'
  const status = normalizeStatus(api.status)
  const batchDetail = mapBatchDetail(api.batch_detail)
  const school =
    api.jsc_school_name ??
    api.ssc_school_name ??
    api.home_district ??
    null

  return {
    id: api.id,
    applicationNumber: formatApplicationNumber(api.id),
    studentName: api.student_name,
    studentNickName: api.student_nick_name ?? null,
    dateOfBirth: api.date_of_birth,
    sex: api.sex,
    currentClass: api.current_class,
    batch: batchDetail?.label ?? (api.batch ? `Batch #${api.batch}` : null),
    batchDetail,
    jscResult: api.jsc_result ?? null,
    sscResult: api.ssc_result ?? null,
    jscSchoolName: api.jsc_school_name ?? null,
    sscSchoolName: api.ssc_school_name ?? null,
    studentMobile: api.student_mobile ?? null,
    studentEmail: api.student_email ?? null,
    homeLocation: api.home_location ?? null,
    homeDistrict: api.home_district ?? null,
    picture: api.picture ?? null,
    isSubmitted: true,
    isReviewed: Boolean(api.is_reviewed),
    isApproved: status === 'paid',
    status,
    statusRaw,
    school,
    createdAt: api.created_at,
    updatedAt: api.updated_at ?? api.created_at,
    guardians: Array.isArray(api.guardians)
      ? api.guardians.map(mapGuardian)
      : [],
    groupName: api.group_name ?? null,
    subject: api.subject ?? null,
    prevStudent: Boolean(api.prev_student),
    hearAboutUs: api.hear_about_us ?? null,
  }
}
