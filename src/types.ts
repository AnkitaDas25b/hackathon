export type Priority = 'CRITICAL' | 'WARNING' | 'ROUTINE'
export type ImagingModality = 'CT' | 'MRI' | 'X-Ray' | 'PET' | 'Ultrasound'
export type PatientStatus =
  | 'Registered' | 'Test Ordered' | 'Imaging Pending' | 'Imaging Processing'
  | 'AI Processing' | 'Awaiting Assignment' | 'Assigned' | 'Under Review'
  | 'Referral Requested' | 'Reassigned' | 'Completed'
export type ImagingStatus = 'Uploading' | 'Processing' | 'Ready' | 'Failed'
export type AIStatus = 'Pending' | 'Analyzing' | 'Complete' | 'Failed' | 'Needs Review'
export type DoctorAvailability = 'Available' | 'Busy' | 'Away' | 'In Procedure'

export interface AIFinding {
  finding: string
  confidence: number
}

export interface Patient {
  id: string
  name: string
  age: number
  sex: 'M' | 'F'
  phone: string
  dob: string
  symptoms: string
  scanReason: string
  modality: ImagingModality
  region: string
  priority: Priority
  aiSummary: string
  aiFindings: AIFinding[]
  aiConfidence: number
  aiReason: string
  aiModelVersion: string
  suggestedSpecialty: string
  assignedDoctorId: string | null
  waitingMinutes: number
  status: PatientStatus
  imagingStatus: ImagingStatus
  aiStatus: AIStatus
  studyId: string
  referredFrom?: string
  referralUrgency?: Priority
  referralReason?: string
  isReferral?: boolean
  
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  availability: DoctorAvailability
  currentPatient?: string
  patientsWaiting: number
  criticalPatients: number
  initials: string
}

export interface Referral {
  id: string
  patientId: string
  patientName: string
  fromDoctorId: string
  fromDoctorName: string
  requestedSpecialty: string
  reason: string
  urgency: Priority
  submittedAt: string
  assignedDoctorId: string | null
  status: 'Pending' | 'Assigned' | 'Completed'
}

export interface Notification {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  forRole: 'admin' | 'doctor' | 'both'
}

export interface TimelineEvent {
  id: string
  time: string
  label: string
  actor: string
  type: 'registration' | 'order' | 'imaging' | 'ai' | 'assignment' | 'clinical' | 'referral' | 'completion'
}

export interface CompletedCase {
  id: string
  patientName: string
  age: number
  sex: 'M' | 'F'
  modality: ImagingModality
  region: string
  priority: Priority
  diagnosis: string
  assignedDoctor: string
  completedAt: string
  duration: string
  aiAgreement: 'agreed' | 'disagreed' | 'not_reviewed'
}

export type View =
  | 'login'
  | 'admin-dashboard'
  | 'admin-queue'
  | 'admin-registration'
  | 'admin-assignment'
  | 'admin-referrals'
  | 'admin-model-monitoring'
  | 'radiologist-dashboard'
  | 'doctor-dashboard'
  | 'doctor-case'
  | 'patient-timeline'
  | 'notifications'
  | 'completed-cases'

export type Role = 'admin' | 'doctor' | 'radiologist'
