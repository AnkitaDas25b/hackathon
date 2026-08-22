import { useApp } from '../context'
import { PATIENTS } from '../data/mock'
import { TIMELINE_EVENTS } from '../data/mock'
import { PriorityBadge, StatusPill, Card } from '../components/ui'
import type { TimelineEvent } from '../types'

const TYPE_CONFIG: Record<TimelineEvent['type'], { color: string; icon: string; bg: string }> = {
  registration: { color: '#1D4ED8', icon: '⊞', bg: '#EFF6FF' },
  order:        { color: '#7C3AED', icon: '📋', bg: '#F5F3FF' },
  imaging:      { color: '#0891B2', icon: '⊕', bg: '#ECFEFF' },
  ai:           { color: '#EA580C', icon: '◎', bg: '#FFF7ED' },
  assignment:   { color: '#D97706', icon: '→', bg: '#FFFBEB' },
  clinical:     { color: '#16A34A', icon: '✓', bg: '#F0FDF4' },
  referral:     { color: '#DC2626', icon: '⇄', bg: '#FEF2F2' },
  completion:   { color: '#16A34A', icon: '★', bg: '#F0FDF4' },
}

export function PatientTimeline() {
  const { selectedPatientId, setView, workflow, role, setTimelineReturnPanel } = useApp()
  const patient = PATIENTS.find(p => p.id === selectedPatientId) ?? PATIENTS[0]

  return (
    <div className="min-w-0 p-3 sm:p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => { if (role === 'doctor') { setTimelineReturnPanel('notes'); setView('doctor-case') } else setView('admin-queue') }} className="text-sm" style={{ color: '#64748B' }}>← Back</button>
        <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Patient Timeline</h1>
      </div>

      {/* Patient card */}
      <Card style={{ padding: 16, marginBottom: 24 }}>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded text-white font-bold shrink-0"
            style={{
              width: 44, height: 44,
              background: patient.priority === 'CRITICAL' ? '#DC2626' : patient.priority === 'WARNING' ? '#D97706' : '#16A34A',
              fontSize: 14,
            }}
          >
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="font-semibold" style={{ color: '#0F172A' }}>{patient.name}</div>
            <div className="text-xs" style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}>
              {patient.age}{patient.sex} · {patient.modality} {patient.region} · {patient.studyId}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={patient.priority} size="xs" />
            <StatusPill status={patient.status} />
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute"
          style={{ left: 19, top: 0, bottom: 0, width: 2, background: '#E2E8F0' }}
        />

        <div className="space-y-0">
          {TIMELINE_EVENTS.filter(event => event.type !== 'completion' || workflow.completedCases.includes(patient.id)).map((event, i) => {
            const patientEvent = event.type === 'registration' ? { ...event, label: `${patient.name} registered`, actor: 'Reception' } : event.type === 'assignment' ? { ...event, label: workflow.consultantAssignments[patient.id] ? `Assigned to ${workflow.consultantAssignments[patient.id]}` : patient.assignedDoctorId ? 'Assigned to consultant doctor' : 'Awaiting doctor assignment' } : event.type === 'completion' ? { ...event, label: 'Case completed by clinician' } : event
            event = patientEvent
            const cfg = TYPE_CONFIG[event.type]
            return (
              <div key={event.id} className="flex gap-4 relative pb-0">
                {/* Dot */}
                <div
                  className="flex items-center justify-center rounded-full shrink-0 z-10 mt-1"
                  style={{
                    width: 38, height: 38,
                    background: cfg.bg,
                    border: `2px solid ${cfg.color}40`,
                    fontSize: 14,
                  }}
                >
                  <span style={{ fontSize: 13 }}>{cfg.icon}</span>
                </div>

                {/* Content */}
                <div
                  className="flex-1 pb-5"
                  style={{ borderBottom: i < TIMELINE_EVENTS.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-bold"
                      style={{ color: cfg.color, fontFamily: 'var(--font-mono)' }}
                    >
                      {event.time}
                    </span>
                    {event.type === 'ai' && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-sm"
                        style={{ background: '#FFF7ED', color: '#EA580C', fontFamily: 'var(--font-mono)' }}
                      >
                        AI
                      </span>
                    )}
                    {event.type === 'referral' && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-sm"
                        style={{ background: '#FEF2F2', color: '#DC2626', fontFamily: 'var(--font-mono)' }}
                      >
                        Referral
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{event.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{event.actor}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <Card style={{ padding: 16, marginTop: 16 }}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
          Case Summary
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <div className="text-xs" style={{ color: '#64748B' }}>Registered</div>
            <div className="text-sm font-semibold" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
              {TIMELINE_EVENTS[0].time}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: '#64748B' }}>AI Triage</div>
            <div className="text-sm font-semibold" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
              {TIMELINE_EVENTS[5].time}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: '#64748B' }}>{workflow.completedCases.includes(patient.id) ? 'Completed' : workflow.consultantAssignments[patient.id] || patient.assignedDoctorId ? 'Assigned' : 'Status'}</div>
            <div className="text-sm font-semibold" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
              {workflow.diagnosisConfirmed.includes(patient.id) ? TIMELINE_EVENTS[TIMELINE_EVENTS.length - 1].time : 'In progress'}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: '#64748B' }}>Total events</div>
            <div className="text-sm font-semibold" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
              {TIMELINE_EVENTS.length}
            </div>
          </div>
          <div>
            <div className="text-xs" style={{ color: '#64748B' }}>AI Priority</div>
            <PriorityBadge priority={patient.priority} size="xs" />
          </div>
          <div>
            <div className="text-xs" style={{ color: '#64748B' }}>Duration</div>
            <div className="text-sm font-semibold" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>1h 00m</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
