import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role, View } from './types'

export interface WorkflowState {
  radiologistReviewed: string[]
  uploadedStudies: string[]
  consultantAssignments: Record<string, string>
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
}

const AppContext = createContext<AppContextType>({
  role: null, setRole: () => {}, view: 'login', setView: () => {},
  selectedPatientId: null, setSelectedPatientId: () => {},
  modal: null, setModal: () => {},
  workflow: { radiologistReviewed: [], uploadedStudies: [], consultantAssignments: {} },
  markRadiologistReviewed: () => {}, markStudyUploaded: () => {}, assignConsultant: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [view, setView] = useState<View>('login')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('p1')
  const [modal, setModal] = useState<string | null>(null)
  const [workflow, setWorkflow] = useState<WorkflowState>({ radiologistReviewed: [], uploadedStudies: [], consultantAssignments: {} })
  const markRadiologistReviewed = (patientId: string) => setWorkflow(current => ({ ...current, radiologistReviewed: current.radiologistReviewed.includes(patientId) ? current.radiologistReviewed : [...current.radiologistReviewed, patientId] }))
  const markStudyUploaded = (patientId: string) => setWorkflow(current => ({ ...current, uploadedStudies: current.uploadedStudies.includes(patientId) ? current.uploadedStudies : [...current.uploadedStudies, patientId] }))
  const assignConsultant = (patientId: string, doctorId: string) => setWorkflow(current => ({ ...current, consultantAssignments: { ...current.consultantAssignments, [patientId]: doctorId } }))

  return (
    <AppContext.Provider value={{ role, setRole, view, setView, selectedPatientId, setSelectedPatientId, modal, setModal, workflow, markRadiologistReviewed, markStudyUploaded, assignConsultant }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
