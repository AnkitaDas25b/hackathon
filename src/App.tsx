import { AppProvider, useApp } from './context'
import { Shell } from './components/Shell'
import { Login } from './views/Login'
import { AdminDashboard } from './views/AdminDashboard'
import { PatientQueue } from './views/PatientQueue'
import { PatientRegistration } from './views/PatientRegistration'
import { DoctorAssignment } from './views/DoctorAssignment'
import { AdminReferrals } from './views/AdminReferrals'
import { ModelMonitoring } from './views/ModelMonitoring'
import { DoctorDashboard } from './views/DoctorDashboard'
import { CaseWorkspace } from './views/CaseWorkspace'
import { PatientTimeline } from './views/PatientTimeline'
import { NotificationsView } from './views/Notifications'
import { CompletedCases } from './views/CompletedCases'
import { RadiologistDashboard } from './views/RadiologistDashboard'

function ViewRouter() {
  const { view } = useApp()
  switch (view) {
    case 'admin-dashboard':     return <AdminDashboard />
    case 'admin-queue':         return <PatientQueue />
    case 'admin-registration':  return <PatientRegistration />
    case 'admin-assignment':    return <DoctorAssignment />
    case 'admin-referrals':     return <AdminReferrals />
    case 'admin-model-monitoring': return <ModelMonitoring />
    case 'radiologist-dashboard': return <RadiologistDashboard />
    case 'doctor-dashboard':    return <DoctorDashboard />
    case 'doctor-case':         return <CaseWorkspace />
    case 'patient-timeline':    return <PatientTimeline />
    case 'notifications':       return <NotificationsView />
    case 'completed-cases':     return <CompletedCases />
    default:                    return <AdminDashboard />
  }
}

function AppInner() {
  const { role } = useApp()
  if (!role) return <Login />
  return (
    <Shell>
      <ViewRouter />
    </Shell>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
