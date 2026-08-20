import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Role, View } from './types'

interface AppContextType {
  role: Role | null
  setRole: (r: Role | null) => void
  view: View
  setView: (v: View) => void
  selectedPatientId: string | null
  setSelectedPatientId: (id: string | null) => void
  modal: string | null
  setModal: (m: string | null) => void
}

const AppContext = createContext<AppContextType>({
  role: null, setRole: () => {}, view: 'login', setView: () => {},
  selectedPatientId: null, setSelectedPatientId: () => {},
  modal: null, setModal: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [view, setView] = useState<View>('login')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('p1')
  const [modal, setModal] = useState<string | null>(null)

  return (
    <AppContext.Provider value={{ role, setRole, view, setView, selectedPatientId, setSelectedPatientId, modal, setModal }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
