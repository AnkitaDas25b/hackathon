import { useApp } from '../context'
import { PATIENTS, DOCTORS } from '../data/mock'
import { PriorityBadge, Btn, Card } from '../components/ui'
import type { Priority } from '../types'

const MY_DOCTOR_ID = 'd1'

const PRIORITY_ORDER: Priority[] = ['CRITICAL', 'WARNING', 'ROUTINE']

export function DoctorDashboard() {
  const { setView, setSelectedPatientId } = useApp()

  const myDoctor = DOCTORS.find(d => d.id === MY_DOCTOR_ID)!
  const myPatients = PATIENTS.filter(
    p => p.assignedDoctorId === MY_DOCTOR_ID && p.status !== 'Completed'
  )

  const grouped = PRIORITY_ORDER.reduce((acc, p) => {
    acc[p] = myPatients.filter(pt => pt.priority === p)
    return acc
  }, {} as Record<Priority, typeof myPatients>)

  const priorityConfig = {
    CRITICAL: { bg: '#FEF2F2', border: '#FECACA', icon: '▲', label: 'Critical', accent: '#DC2626' },
    WARNING:  { bg: '#FFFBEB', border: '#FDE68A', icon: '◆', label: 'Warning / Early Signs', accent: '#D97706' },
    ROUTINE:  { bg: '#F0FDF4', border: '#BBF7D0', icon: '●', label: 'Routine', accent: '#16A34A' },
  }

  return (
    <div className="min-w-0 p-3 sm:p-6 max-w-3xl">
      {/* Doctor header */}
      <Card style={{ padding: 16, marginBottom: 20 }}>
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="flex items-center justify-center rounded-full text-white font-bold"
            style={{ width: 44, height: 44, background: '#0891B2', fontSize: 14 }}
          >
            {myDoctor.initials}
          </div>
          <div className="flex-1">
            <div className="font-semibold" style={{ color: '#0F172A' }}>{myDoctor.name}</div>
            <div className="text-xs" style={{ color: '#64748B' }}>{myDoctor.specialty}</div>
          </div>
          <div className="text-right text-xs space-y-0.5">
            <div style={{ color: '#64748B' }}>
              <span style={{ color: '#0F172A', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{myPatients.length}</span> patients in queue
            </div>
            <div style={{ color: '#64748B' }}>
              <span style={{ color: grouped.CRITICAL.length > 0 ? '#DC2626' : '#16A34A', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                {grouped.CRITICAL.length}
              </span> critical
            </div>
          </div>
        </div>
      </Card>

      {/* Priority sections */}
      {PRIORITY_ORDER.map(priority => {
        const patients = grouped[priority]
        const cfg = priorityConfig[priority]
        if (patients.length === 0) return null
        return (
          <div key={priority} className="mb-6">
            {/* Section header */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-sm mb-3"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <span style={{ color: cfg.accent }}>{cfg.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: cfg.accent, fontFamily: 'var(--font-mono)' }}>
                {cfg.label}
              </span>
              <span
                className="ml-auto text-xs font-bold rounded-full flex items-center justify-center"
                style={{ width: 20, height: 20, background: cfg.accent, color: '#fff', fontFamily: 'var(--font-mono)' }}
              >
                {patients.length}
              </span>
            </div>

            {/* Patient cards */}
            <div className="space-y-2">
              {patients.map((p, idx) => (
                <Card key={p.id} style={{ padding: 0, overflow: 'hidden', borderLeft: `3px solid ${cfg.accent}` }}>
                  <div className="flex flex-wrap items-center gap-3 px-3 py-3.5 sm:px-4">
                    {/* Index */}
                    <div
                      className="shrink-0 text-xs font-bold"
                      style={{ width: 22, height: 22, borderRadius: '50%', background: cfg.bg, color: cfg.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${cfg.border}`, fontFamily: 'var(--font-mono)' }}
                    >
                      {idx + 1}
                    </div>

                    {/* Patient info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-sm" style={{ color: '#0F172A' }}>{p.name}</span>
                        <span className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{p.age}{p.sex}</span>
                        {p.isReferral && (
                          <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background: '#FFF7ED', color: '#EA580C', fontFamily: 'var(--font-mono)' }}>
                            Referral
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: '#64748B' }}>
                        <span>{p.modality} {p.region}</span>
                        <span style={{ color: '#CBD5E1' }}>·</span>
                        <span>{p.aiSummary}</span>
                        <span style={{ color: '#CBD5E1' }}>·</span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>AI {p.aiConfidence}%</span>
                      </div>
                    </div>

                    {/* Waiting time */}
                    <div className="text-right shrink-0">
                      <div
                        className="text-sm font-semibold"
                        style={{ color: p.waitingMinutes < 5 ? '#DC2626' : '#64748B', fontFamily: 'var(--font-mono)' }}
                      >
                        {p.waitingMinutes} min
                      </div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>waiting</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 shrink-0">
                      <Btn
                        variant="primary"
                        size="xs"
                        onClick={() => { setSelectedPatientId(p.id); setView('doctor-case') }}
                      >
                        Open Case →
                      </Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {myPatients.length === 0 && (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div className="text-3xl mb-2">✓</div>
          <div className="text-sm font-medium" style={{ color: '#0F172A' }}>Queue clear</div>
          <div className="text-xs" style={{ color: '#64748B' }}>No patients currently assigned to you.</div>
        </Card>
      )}
    </div>
  )
}
