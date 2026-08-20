import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Patient, Role, View } from './types'

export interface WorkflowState {
  radiologistReviewed: string[]
  uploadedStudies: string[]
  consultantAssignments: Record<string, string>
  diagnosisConfirmed: string[]
}

interface AppContextType {
  role: Role | null
  setRole: (r: Role | null) => void
  view: View
  setView: (v: View) => void
  selectedPatientId: string | null
  setSelectedPatientId: (id: string | null) => void
  modal: string | null
  setModal: (m: string | null) => void
  workflow: WorkflowState
  markRadiologistReviewed: (patientId: string) => void
  markStudyUploaded: (patientId: string) => void
  assignConsultant: (patientId: string, doctorId: string) => void
  confirmDiagnosis: (patientId: string) => void
  registeredPatients: Patient[]
  registerPatient: (patient: Patient) => void
  readNotifications: string[]
  markNotificationsRead: (ids: string[]) => void
}

const AppContext = createContext<AppContextType>({
  role: null, setRole: () => {}, view: 'login', setView: () => {},
  selectedPatientId: null, setSelectedPatientId: () => {},
  modal: null, setModal: () => {},
  workflow: { radiologistReviewed: [], uploadedStudies: [], consultantAssignments: {}, diagnosisConfirmed: [] },
  markRadiologistReviewed: () => {}, markStudyUploaded: () => {}, assignConsultant: () => {},   confirmDiagnosis: () => {}, registeredPatients: [], registerPatient: () => {}, readNotifications: [], markNotificationsRead: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [view, setView] = useState<View>('login')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('p1')
  const [modal, setModal] = useState<string | null>(null)
  const [workflow, setWorkflow] = useState<WorkflowState>(() => JSON.parse(localStorage.getItem('meditriage-workflow') || '{"radiologistReviewed":[],"uploadedStudies":[],"consultantAssignments":{},"diagnosisConfirmed":[]}'))
  const [registeredPatients, setRegisteredPatients] = useState<Patient[]>(() => JSON.parse(localStorage.getItem('meditriage-registered-patients') || '[]'))
  const [readNotifications, setReadNotifications] = useState<string[]>(() => JSON.parse(localStorage.getItem('meditriage-read-notifications') || '[]'))
  useEffect(() => { localStorage.setItem('meditriage-workflow', JSON.stringify(workflow)) }, [workflow])
  useEffect(() => { localStorage.setItem('meditriage-registered-patients', JSON.stringify(registeredPatients)) }, [registeredPatients])
  useEffect(() => { localStorage.setItem('meditriage-read-notifications', JSON.stringify(readNotifications)) }, [readNotifications])
  const registerPatient = (patient: Patient) => setRegisteredPatients(current => [...current, patient])
  const markNotificationsRead = (ids: string[]) => setReadNotifications(current => Array.from(new Set([...current, ...ids])))
  const confirmDiagnosis = (patientId: string) => setWorkflow(current => ({ ...current, diagnosisConfirmed: current.diagnosisConfirmed.includes(patientId) ? current.diagnosisConfirmed : [...current.diagnosisConfirmed, patientId] }))
  const markRadiologistReviewed = (patientId: string) => setWorkflow(current => ({ ...current, radiologistReviewed: current.radiologistReviewed.includes(patientId) ? current.radiologistReviewed : [...current.radiologistReviewed, patientId] }))
  const markStudyUploaded = (patientId: string) => setWorkflow(current => ({ ...current, uploadedStudies: current.uploadedStudies.includes(patientId) ? current.uploadedStudies : [...current.uploadedStudies, patientId] }))
  const assignConsultant = (patientId: string, doctorId: string) => setWorkflow(current => ({ ...current, consultantAssignments: { ...current.consultantAssignments, [patientId]: doctorId } }))

  return (
    <AppContext.Provider value={{ role, setRole, view, setView, selectedPatientId, setSelectedPatientId, modal, setModal, workflow, markRadiologistReviewed, markStudyUploaded, assignConsultant, confirmDiagnosis, registeredPatients, registerPatient, readNotifications, markNotificationsRead }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
