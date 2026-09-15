// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react"
// import type {
//   ConsentRecord,
//   Patient,
//   PatientIntakeSession,
//   PatientLanguage,
//   Role,
//   VerifiedPatientIdentity,
//   View,
// } from "./types"

// export interface WorkflowState {
//   radiologistReviewed: string[]
//   uploadedStudies: string[]
//   consultantAssignments: Record<string, string>
//   abhaLinks: Record<string, string>
//   savedSummaries: Record<string, string>
//   hisPushedSummaries: string[]
//   digitalRecordsUpdated: string[]
//   diagnosisConfirmed: string[]
//   completedCases: string[]
//   previousScansViewed: string[]
// }

// interface AppContextType {
//   role: Role | null
//   setRole: (r: Role | null) => void
//   view: View
//   setView: (v: View) => void
//   selectedPatientId: string | null
//   setSelectedPatientId: (id: string | null) => void
//   timelineReturnPanel: "info" | "ai" | "notes" | "feedback" | null
//   setTimelineReturnPanel: (
//     panel: "info" | "ai" | "notes" | "feedback" | null,
//   ) => void
//   modal: string | null
//   setModal: (m: string | null) => void
//   workflow: WorkflowState
//   markRadiologistReviewed: (patientId: string) => void
//   markStudyUploaded: (patientId: string) => void
//   assignConsultant: (patientId: string, doctorId: string) => void
//   linkPatientToAbha: (patientId: string, abhaId: string) => void
//   savePatientSummary: (patientId: string, summary: string) => void
//   pushSummaryToHis: (patientId: string) => void
//   updateDigitalRecord: (patientId: string) => void
//   confirmDiagnosis: (patientId: string) => void
//   completeCase: (patientId: string) => void
//   viewPreviousScan: (patientId: string) => void
//   registeredPatients: Patient[]
//   registerPatient: (patient: Patient) => void
//   readNotifications: string[]
//   markNotificationsRead: (ids: string[]) => void
//   patientKioskOpen: boolean
//   setPatientKioskOpen: (open: boolean) => void
//   patientLanguage: PatientLanguage
//   setPatientLanguage: (language: PatientLanguage) => void
//   verifiedPatient: VerifiedPatientIdentity | null
//   setVerifiedPatient: (patient: VerifiedPatientIdentity | null) => void
//   intakeSession: PatientIntakeSession | null
//   consentRecords: ConsentRecord[]
//   createIntakeSession: (
//     patient: VerifiedPatientIdentity,
//     language: PatientLanguage,
//   ) => PatientIntakeSession
//   recordConsent: (record: ConsentRecord) => void
//   resetPatientIntake: () => void
// }

// const AppContext = createContext<AppContextType>({
//   role: null,
//   setRole: () => {},
//   view: "login",
//   setView: () => {},
//   selectedPatientId: null,
//   setSelectedPatientId: () => {},
//   timelineReturnPanel: null,
//   setTimelineReturnPanel: () => {},
//   modal: null,
//   setModal: () => {},
//   workflow: {
//     radiologistReviewed: [],
//     uploadedStudies: [],
//     consultantAssignments: {},
//     abhaLinks: {},
//     savedSummaries: {},
//     hisPushedSummaries: [],
//     digitalRecordsUpdated: [],
//     diagnosisConfirmed: [],
//     completedCases: [],
//     previousScansViewed: [],
//   },
//   markRadiologistReviewed: () => {},
//   markStudyUploaded: () => {},
//   assignConsultant: () => {},
//   confirmDiagnosis: () => {},
//   completeCase: () => {},
//   viewPreviousScan: () => {},
//   registeredPatients: [],
//   registerPatient: () => {},
//   readNotifications: [],
//   markNotificationsRead: () => {},
//   patientKioskOpen: false,
//   setPatientKioskOpen: () => {},
//   patientLanguage: "en",
//   setPatientLanguage: () => {},
//   verifiedPatient: null,
//   setVerifiedPatient: () => {},
//   intakeSession: null,
//   consentRecords: [],
//   createIntakeSession: () => ({
//     sessionId: "",
//     patientId: "",
//     language: "en",
//     status: "ready_for_history",
//     consentStatus: "granted",
//     createdAt: "",
//   }),
//   recordConsent: () => {},
//   resetPatientIntake: () => {},
// })

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [role, setRole] = useState<Role | null>(null)
//   const [view, setView] = useState<View>("login")
//   const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
//     "p1",
//   )
//   const [timelineReturnPanel, setTimelineReturnPanel] =
//     useState<"info" | "ai" | "notes" | "feedback" | null>(null)
//   const [modal, setModal] = useState<string | null>(null)
//   const [workflow, setWorkflow] = useState<WorkflowState>(() => ({
//       radiologistReviewed: [],
//       uploadedStudies: [],
//       consultantAssignments: {},
//       abhaLinks: {},
//       savedSummaries: {},
//       hisPushedSummaries: [],
//       digitalRecordsUpdated: [],
//       diagnosisConfirmed: [],
//       completedCases: [],
//       previousScansViewed: [],
//       ...JSON.parse(localStorage.getItem("meditriage-workflow") || "{}"),
//     }))
//   const [registeredPatients, setRegisteredPatients] = useState<Patient[]>(() =>
//     JSON.parse(localStorage.getItem("meditriage-registered-patients") || "[]"),
//   )
//   const [readNotifications, setReadNotifications] = useState<string[]>(() =>
//     JSON.parse(localStorage.getItem("meditriage-read-notifications") || "[]"),
//   )
//   const [patientKioskOpen, setPatientKioskOpen] = useState(false)
//   const [patientLanguage, setPatientLanguage] = useState<PatientLanguage>("en")
//   const [verifiedPatient, setVerifiedPatient] =
//     useState<VerifiedPatientIdentity | null>(null)
//   const [intakeSession, setIntakeSession] =
//     useState<PatientIntakeSession | null>(() =>
//       JSON.parse(localStorage.getItem("medikiosk-intake-session") || "null"),
//     )
//   const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>(() =>
//     JSON.parse(localStorage.getItem("medikiosk-consent-records") || "[]"),
//   )
//   useEffect(() => {
//     localStorage.setItem("meditriage-workflow", JSON.stringify(workflow))
//   }, [workflow])
//   useEffect(() => {
//     localStorage.setItem(
//       "meditriage-registered-patients",
//       JSON.stringify(registeredPatients),
//     )
//   }, [registeredPatients])
//   useEffect(() => {
//     localStorage.setItem(
//       "meditriage-read-notifications",
//       JSON.stringify(readNotifications),
//     )
//   }, [readNotifications])
//   useEffect(() => {
//     localStorage.setItem(
//       "medikiosk-intake-session",
//       JSON.stringify(intakeSession),
//     )
//   }, [intakeSession])
//   useEffect(() => {
//     localStorage.setItem(
//       "medikiosk-consent-records",
//       JSON.stringify(consentRecords),
//     )
//   }, [consentRecords])
//   useEffect(() => {
//     document.documentElement.lang = patientLanguage
//   }, [patientLanguage])
//   const registerPatient = (patient: Patient) =>
//     setRegisteredPatients((current) => [...current, patient])
//   const markNotificationsRead = (ids: string[]) =>
//     setReadNotifications((current) => Array.from(new Set([...current, ...ids])))
//   const confirmDiagnosis = (patientId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       diagnosisConfirmed: current.diagnosisConfirmed.includes(patientId)
//         ? current.diagnosisConfirmed
//         : [...current.diagnosisConfirmed, patientId],
//     }))
//   const markRadiologistReviewed = (patientId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       radiologistReviewed: current.radiologistReviewed.includes(patientId)
//         ? current.radiologistReviewed
//         : [...current.radiologistReviewed, patientId],
//     }))
//   const markStudyUploaded = (patientId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       uploadedStudies: current.uploadedStudies.includes(patientId)
//         ? current.uploadedStudies
//         : [...current.uploadedStudies, patientId],
//     }))
//   const assignConsultant = (patientId: string, doctorId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       consultantAssignments: {
//         ...current.consultantAssignments,
//         [patientId]: doctorId,
//       },
//     }))
//   const linkPatientToAbha = (patientId: string, abhaId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       abhaLinks: { ...current.abhaLinks, [patientId]: abhaId },
//     }))
//   const savePatientSummary = (patientId: string, summary: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       savedSummaries: { ...current.savedSummaries, [patientId]: summary },
//     }))
//   const pushSummaryToHis = (patientId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       hisPushedSummaries: current.hisPushedSummaries.includes(patientId)
//         ? current.hisPushedSummaries
//         : [...current.hisPushedSummaries, patientId],
//     }))
//   const updateDigitalRecord = (patientId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       digitalRecordsUpdated: current.digitalRecordsUpdated.includes(patientId)
//         ? current.digitalRecordsUpdated
//         : [...current.digitalRecordsUpdated, patientId],
//     }))
//   const completeCase = (patientId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       completedCases: current.completedCases.includes(patientId)
//         ? current.completedCases
//         : [...current.completedCases, patientId],
//     }))
//   const viewPreviousScan = (patientId: string) =>
//     setWorkflow((current) => ({
//       ...current,
//       previousScansViewed: current.previousScansViewed.includes(patientId)
//         ? current.previousScansViewed
//         : [...current.previousScansViewed, patientId],
//     }))
//   const recordConsent = (record: ConsentRecord) =>
//     setConsentRecords((current) => [...current, record])
//   const createIntakeSession = (
//     patient: VerifiedPatientIdentity,
//     language: PatientLanguage,
//   ) => {
//     const session = {
//       sessionId: `MK-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
//       patientId: patient.patientId,
//       language,
//       status: "ready_for_history" as const,
//       consentStatus: "granted" as const,
//       createdAt: new Date().toISOString(),
//     }
//     setIntakeSession(session)
//     return session
//   }
//   const resetPatientIntake = () => {
//     setPatientLanguage("en")
//     setVerifiedPatient(null)
//     setIntakeSession(null)
//   }

//   return (
//     <AppContext.Provider
//       value={{
//         role,
//         setRole,
//         view,
//         setView,
//         selectedPatientId,
//         setSelectedPatientId,
//         timelineReturnPanel,
//         setTimelineReturnPanel,
//         modal,
//         setModal,
//         workflow,
//         markRadiologistReviewed,
//         markStudyUploaded,
//         assignConsultant,
//         linkPatientToAbha,
//         savePatientSummary,
//         pushSummaryToHis,
//         updateDigitalRecord,
//         confirmDiagnosis,
//         completeCase,
//         viewPreviousScan,
//         registeredPatients,
//         registerPatient,
//         readNotifications,
//         markNotificationsRead,
//         patientKioskOpen,
//         setPatientKioskOpen,
//         patientLanguage,
//         setPatientLanguage,
//         verifiedPatient,
//         setVerifiedPatient,
//         intakeSession,
//         consentRecords,
//         createIntakeSession,
//         recordConsent,
//         resetPatientIntake,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   )
// }

// export const useApp = () => useContext(AppContext)














import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type {
  ConsentRecord,
  Patient,
  PatientIntakeSession,
  PatientLanguage,
  Role,
  VerifiedPatientIdentity,
  View,
} from "./types"

export interface WorkflowState {
  radiologistReviewed: string[]
  uploadedStudies: string[]
  consultantAssignments: Record<string, string>
  abhaLinks: Record<string, string>
  savedSummaries: Record<string, string>
  hisPushedSummaries: string[]
  digitalRecordsUpdated: string[]
  diagnosisConfirmed: string[]
  completedCases: string[]
  previousScansViewed: string[]
}

interface AppContextType {
  role: Role | null
  setRole: (r: Role | null) => void
  view: View
  setView: (v: View) => void
  selectedPatientId: string | null
  setSelectedPatientId: (id: string | null) => void
  timelineReturnPanel: "info" | "ai" | "notes" | "feedback" | null
  setTimelineReturnPanel: (
    panel: "info" | "ai" | "notes" | "feedback" | null,
  ) => void
  modal: string | null
  setModal: (m: string | null) => void
  workflow: WorkflowState
  markRadiologistReviewed: (patientId: string) => void
  markStudyUploaded: (patientId: string) => void
  assignConsultant: (patientId: string, doctorId: string) => void
  linkPatientToAbha: (patientId: string, abhaId: string) => void
  savePatientSummary: (patientId: string, summary: string) => void
  pushSummaryToHis: (patientId: string) => void
  updateDigitalRecord: (patientId: string) => void
  confirmDiagnosis: (patientId: string) => void
  completeCase: (patientId: string) => void
  viewPreviousScan: (patientId: string) => void
  registeredPatients: Patient[]
  registerPatient: (patient: Patient) => void
  readNotifications: string[]
  markNotificationsRead: (ids: string[]) => void
  patientKioskOpen: boolean
  setPatientKioskOpen: (open: boolean) => void
  patientLanguage: PatientLanguage
  setPatientLanguage: (language: PatientLanguage) => void
  verifiedPatient: VerifiedPatientIdentity | null
  setVerifiedPatient: (patient: VerifiedPatientIdentity | null) => void
  intakeSession: PatientIntakeSession | null
  consentRecords: ConsentRecord[]
  createIntakeSession: (
    patient: VerifiedPatientIdentity,
    language: PatientLanguage,
  ) => PatientIntakeSession
  recordConsent: (record: ConsentRecord) => void
  resetPatientIntake: () => void
}

const AppContext = createContext<AppContextType>({
  role: null,
  setRole: () => {},
  view: "login",
  setView: () => {},
  selectedPatientId: null,
  setSelectedPatientId: () => {},
  timelineReturnPanel: null,
  setTimelineReturnPanel: () => {},
  modal: null,
  setModal: () => {},
  workflow: {
    radiologistReviewed: [],
    uploadedStudies: [],
    consultantAssignments: {},
    abhaLinks: {},
    savedSummaries: {},
    hisPushedSummaries: [],
    digitalRecordsUpdated: [],
    diagnosisConfirmed: [],
    completedCases: [],
    previousScansViewed: [],
  },
  markRadiologistReviewed: () => {},
  markStudyUploaded: () => {},
  assignConsultant: () => {},
  linkPatientToAbha: () => {},
  savePatientSummary: () => {},
  pushSummaryToHis: () => {},
  updateDigitalRecord: () => {},
  confirmDiagnosis: () => {},
  completeCase: () => {},
  viewPreviousScan: () => {},
  registeredPatients: [],
  registerPatient: () => {},
  readNotifications: [],
  markNotificationsRead: () => {},
  patientKioskOpen: false,
  setPatientKioskOpen: () => {},
  patientLanguage: "en",
  setPatientLanguage: () => {},
  verifiedPatient: null,
  setVerifiedPatient: () => {},
  intakeSession: null,
  consentRecords: [],
  createIntakeSession: () => ({
    sessionId: "",
    patientId: "",
    language: "en",
    status: "ready_for_history",
    consentStatus: "granted",
    createdAt: "",
  }),
  recordConsent: () => {},
  resetPatientIntake: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [view, setView] = useState<View>("login")
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    "p1",
  )
  const [timelineReturnPanel, setTimelineReturnPanel] =
    useState<"info" | "ai" | "notes" | "feedback" | null>(null)
  const [modal, setModal] = useState<string | null>(null)
  const [workflow, setWorkflow] = useState<WorkflowState>(() => ({
    radiologistReviewed: [],
    uploadedStudies: [],
    consultantAssignments: {},
    abhaLinks: {},
    savedSummaries: {},
    hisPushedSummaries: [],
    digitalRecordsUpdated: [],
    diagnosisConfirmed: [],
    completedCases: [],
    previousScansViewed: [],
    ...JSON.parse(localStorage.getItem("meditriage-workflow") || "{}"),
  }))
  const [registeredPatients, setRegisteredPatients] = useState<Patient[]>(() =>
    JSON.parse(localStorage.getItem("meditriage-registered-patients") || "[]"),
  )
  const [readNotifications, setReadNotifications] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("meditriage-read-notifications") || "[]"),
  )
  const [patientKioskOpen, setPatientKioskOpen] = useState(false)
  const [patientLanguage, setPatientLanguage] = useState<PatientLanguage>("en")
  const [verifiedPatient, setVerifiedPatient] =
    useState<VerifiedPatientIdentity | null>(null)
  const [intakeSession, setIntakeSession] =
    useState<PatientIntakeSession | null>(() =>
      JSON.parse(localStorage.getItem("medikiosk-intake-session") || "null"),
    )
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>(() =>
    JSON.parse(localStorage.getItem("medikiosk-consent-records") || "[]"),
  )

  useEffect(() => {
    localStorage.setItem("meditriage-workflow", JSON.stringify(workflow))
  }, [workflow])
  useEffect(() => {
    localStorage.setItem(
      "meditriage-registered-patients",
      JSON.stringify(registeredPatients),
    )
  }, [registeredPatients])
  useEffect(() => {
    localStorage.setItem(
      "meditriage-read-notifications",
      JSON.stringify(readNotifications),
    )
  }, [readNotifications])
  useEffect(() => {
    localStorage.setItem(
      "medikiosk-intake-session",
      JSON.stringify(intakeSession),
    )
  }, [intakeSession])
  useEffect(() => {
    localStorage.setItem(
      "medikiosk-consent-records",
      JSON.stringify(consentRecords),
    )
  }, [consentRecords])
  useEffect(() => {
    document.documentElement.lang = patientLanguage
  }, [patientLanguage])

  const registerPatient = (patient: Patient) =>
    setRegisteredPatients((current) => [...current, patient])
  const markNotificationsRead = (ids: string[]) =>
    setReadNotifications((current) => Array.from(new Set([...current, ...ids])))
  const confirmDiagnosis = (patientId: string) =>
    setWorkflow((current) => ({
      ...current,
      diagnosisConfirmed: current.diagnosisConfirmed.includes(patientId)
        ? current.diagnosisConfirmed
        : [...current.diagnosisConfirmed, patientId],
    }))
  const markRadiologistReviewed = (patientId: string) =>
    setWorkflow((current) => ({
      ...current,
      radiologistReviewed: current.radiologistReviewed.includes(patientId)
        ? current.radiologistReviewed
        : [...current.radiologistReviewed, patientId],
    }))
  const markStudyUploaded = (patientId: string) =>
    setWorkflow((current) => ({
      ...current,
      uploadedStudies: current.uploadedStudies.includes(patientId)
        ? current.uploadedStudies
        : [...current.uploadedStudies, patientId],
    }))
  const assignConsultant = (patientId: string, doctorId: string) =>
    setWorkflow((current) => ({
      ...current,
      consultantAssignments: {
        ...current.consultantAssignments,
        [patientId]: doctorId,
      },
    }))
  const linkPatientToAbha = (patientId: string, abhaId: string) =>
    setWorkflow((current) => ({
      ...current,
      abhaLinks: { ...current.abhaLinks, [patientId]: abhaId },
    }))
  const savePatientSummary = (patientId: string, summary: string) =>
    setWorkflow((current) => ({
      ...current,
      savedSummaries: { ...current.savedSummaries, [patientId]: summary },
    }))
  const pushSummaryToHis = (patientId: string) =>
    setWorkflow((current) => ({
      ...current,
      hisPushedSummaries: current.hisPushedSummaries.includes(patientId)
        ? current.hisPushedSummaries
        : [...current.hisPushedSummaries, patientId],
    }))
  const updateDigitalRecord = (patientId: string) =>
    setWorkflow((current) => ({
      ...current,
      digitalRecordsUpdated: current.digitalRecordsUpdated.includes(patientId)
        ? current.digitalRecordsUpdated
        : [...current.digitalRecordsUpdated, patientId],
    }))
  const completeCase = (patientId: string) =>
    setWorkflow((current) => ({
      ...current,
      completedCases: current.completedCases.includes(patientId)
        ? current.completedCases
        : [...current.completedCases, patientId],
    }))
  const viewPreviousScan = (patientId: string) =>
    setWorkflow((current) => ({
      ...current,
      previousScansViewed: current.previousScansViewed.includes(patientId)
        ? current.previousScansViewed
        : [...current.previousScansViewed, patientId],
    }))
  const recordConsent = (record: ConsentRecord) =>
    setConsentRecords((current) => [...current, record])
  const createIntakeSession = (
    patient: VerifiedPatientIdentity,
    language: PatientLanguage,
  ) => {
    const session = {
      sessionId: `MK-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      patientId: patient.patientId,
      language,
      status: "ready_for_history" as const,
      consentStatus: "granted" as const,
      createdAt: new Date().toISOString(),
    }
    setIntakeSession(session)
    return session
  }
  const resetPatientIntake = () => {
    setPatientLanguage("en")
    setVerifiedPatient(null)
    setIntakeSession(null)
  }

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        view,
        setView,
        selectedPatientId,
        setSelectedPatientId,
        timelineReturnPanel,
        setTimelineReturnPanel,
        modal,
        setModal,
        workflow,
        markRadiologistReviewed,
        markStudyUploaded,
        assignConsultant,
        linkPatientToAbha,
        savePatientSummary,
        pushSummaryToHis,
        updateDigitalRecord,
        confirmDiagnosis,
        completeCase,
        viewPreviousScan,
        registeredPatients,
        registerPatient,
        readNotifications,
        markNotificationsRead,
        patientKioskOpen,
        setPatientKioskOpen,
        patientLanguage,
        setPatientLanguage,
        verifiedPatient,
        setVerifiedPatient,
        intakeSession,
        consentRecords,
        createIntakeSession,
        recordConsent,
        resetPatientIntake,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)