import { useState } from 'react'
import { useApp } from '../context'
import { PATIENTS, DOCTORS } from '../data/mock'
import { PriorityBadge, AvailabilityDot, Btn, Card } from '../components/ui'

export function DoctorAssignment() {
  const { selectedPatientId, setSelectedPatientId, setView, assignConsultant } = useApp()
  const [assigned, setAssigned] = useState<string | null>(null)

  const patient = PATIENTS.find(p => p.id === selectedPatientId) ?? PATIENTS.find(p => !p.assignedDoctorId)!
  const unassigned = PATIENTS.filter(p => !p.assignedDoctorId && p.status !== 'Completed')

  const specialtyDoctors = DOCTORS.filter(d => patient.suggestedSpecialty.toLowerCase().includes(d.specialty.toLowerCase()))
  const otherDoctors = DOCTORS.filter(d => !patient.suggestedSpecialty.toLowerCase().includes(d.specialty.toLowerCase()))

  const recommended = [...specialtyDoctors].sort((a, b) => {
    if (a.availability === 'Available' && b.availability !== 'Available') return -1
    if (b.availability === 'Available' && a.availability !== 'Available') return 1
    return a.criticalPatients - b.criticalPatients || a.patientsWaiting - b.patientsWaiting
  })[0]

  const handleAssign = (doctorId: string) => {
    assignConsultant(patient.id, doctorId)
    setAssigned(doctorId)
  }

  if (assigned) {
    const doc = DOCTORS.find(d => d.id === assigned)!
    return (
      <div className="p-6 max-w-2xl">
        <Card style={{ padding: 32, textAlign: 'center' }}>
          <div className="flex items-center justify-center rounded-full mx-auto mb-4" style={{ width: 56, height: 56, background: '#F0FDF4', border: '2px solid #BBF7D0' }}>
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#0F172A' }}>Patient Assigned</h2>
          <p className="text-sm mb-2" style={{ color: '#64748B' }}>
            <strong>{patient.name}</strong> has been assigned to <strong>{doc.name}</strong>
          </p>
          <div className="text-xs py-2 px-4 rounded-md inline-block mb-5" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
            {doc.specialty} · {doc.availability} · {doc.patientsWaiting + 1} patients waiting
          </div>
          <div className="flex gap-3 justify-center">
            <Btn variant="primary" size="sm" onClick={() => { setAssigned(null); setView('admin-queue') }}>Back to Queue</Btn>
            <Btn variant="secondary" size="sm" onClick={() => setAssigned(null)}>Assign Another</Btn>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 p-3 sm:p-6 lg:grid-cols-[340px_minmax(0,1fr)]" style={{ alignItems: 'start' }}>
      {/* Left: Patient info + unassigned list */}
      <div className="space-y-4">
        {/* Selected patient */}
        <Card style={{ padding: 20 }}>
          <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
            Selected Patient
          </div>
          <div className="flex items-start gap-3 mb-4">
            <div
              className="flex items-center justify-center rounded text-white font-bold shrink-0"
              style={{ width: 40, height: 40, background: patient.priority === 'CRITICAL' ? '#DC2626' : patient.priority === 'WARNING' ? '#D97706' : '#16A34A', fontSize: 14 }}
            >
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold" style={{ color: '#0F172A' }}>{patient.name}</div>
              <div className="text-xs" style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                {patient.age}{patient.sex} · {patient.modality} {patient.region}
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <Row label="AI Priority"><PriorityBadge priority={patient.priority} size="xs" /></Row>
            <Row label="AI Finding">
              <span className="text-xs" style={{ color: '#0F172A' }}>{patient.aiSummary}</span>
            </Row>
            <Row label="Confidence">
              <div className="flex items-center gap-2">
                <div className="rounded-full overflow-hidden" style={{ width: 60, height: 5, background: '#E2E8F0' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${patient.aiConfidence}%`,
                      background: patient.aiConfidence > 85 ? '#DC2626' : patient.aiConfidence > 65 ? '#D97706' : '#16A34A'
                    }}
                  />
                </div>
                <span className="text-xs font-medium" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{patient.aiConfidence}%</span>
              </div>
            </Row>
            <Row label="Specialty">
              <span className="text-xs" style={{ color: '#0F172A' }}>{patient.suggestedSpecialty}</span>
            </Row>
            <Row label="Waiting">
              <span className="text-xs font-medium" style={{ color: patient.waitingMinutes < 5 ? '#DC2626' : '#64748B', fontFamily: 'var(--font-mono)' }}>
                {patient.waitingMinutes} min
              </span>
            </Row>
          </div>

          <div className="mt-4 p-3 rounded-sm text-xs" style={{ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#92400E' }}>
            <strong>AI Reason:</strong> {patient.aiReason}
          </div>
        </Card>

        {/* Other unassigned patients */}
        {unassigned.length > 1 && (
          <div>
            <div className="text-xs font-semibold mb-2" style={{ color: '#64748B' }}>Other Unassigned ({unassigned.length - 1})</div>
            <div className="space-y-1.5">
              {unassigned.filter(p => p.id !== patient.id).slice(0, 4).map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className="w-full text-left rounded-md p-3 transition-colors"
                  style={{ background: '#fff', border: '1px solid #E2E8F0' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1D4ED8' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: '#0F172A' }}>{p.name}</span>
                    <PriorityBadge priority={p.priority} size="xs" />
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{p.modality} {p.region} · {p.waitingMinutes}m</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Doctor cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#0F172A' }}>
            Available Doctors — <span style={{ color: '#1D4ED8' }}>{patient.suggestedSpecialty}</span>
          </h2>
          <span className="text-xs" style={{ color: '#64748B' }}>Select a doctor to assign</span>
        </div>

        {/* Specialty-matched doctors */}
        {specialtyDoctors.length > 0 && (
          <>
            <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
              Specialty Match
            </div>
            <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2">
              {specialtyDoctors.map(d => (
                <DoctorCard key={d.id} doctor={d} isRecommended={d.id === recommended?.id} onAssign={handleAssign} />
              ))}
            </div>
          </>
        )}

        {/* Other doctors */}
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
          All Doctors
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {otherDoctors.map(d => (
            <DoctorCard key={d.id} doctor={d} isRecommended={false} onAssign={handleAssign} />
          ))}
        </div>
      </div>
    </div>
  )
}

function DoctorCard({ doctor: d, isRecommended, onAssign }: {
  doctor: typeof DOCTORS[0]; isRecommended: boolean; onAssign: (id: string) => void
}) {
  const workloadColor = d.patientsWaiting > 4 ? '#DC2626' : d.patientsWaiting > 2 ? '#D97706' : '#16A34A'

  return (
    <Card style={{ padding: 16, position: 'relative', border: isRecommended ? '2px solid #1D4ED8' : '1px solid #E2E8F0' }}>
      {isRecommended && (
        <div
          className="absolute top-0 right-0 text-xs px-2 py-0.5 rounded-bl-sm rounded-tr-sm font-semibold"
          style={{ background: '#1D4ED8', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 10 }}
        >
          ★ Recommended
        </div>
      )}

      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="flex items-center justify-center rounded-full text-white text-xs font-semibold shrink-0"
          style={{ width: 36, height: 36, background: d.availability === 'Available' ? '#0891B2' : '#64748B', fontSize: 12 }}
        >
          {d.initials}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{d.name}</div>
          <div className="text-xs" style={{ color: '#64748B' }}>{d.specialty}</div>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#94A3B8' }}>Status</span>
          <AvailabilityDot status={d.availability} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#94A3B8' }}>Patients waiting</span>
          <span className="text-xs font-medium" style={{ color: workloadColor, fontFamily: 'var(--font-mono)' }}>{d.patientsWaiting}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: '#94A3B8' }}>Critical assigned</span>
          <span className="text-xs font-medium" style={{ color: d.criticalPatients > 0 ? '#DC2626' : '#16A34A', fontFamily: 'var(--font-mono)' }}>{d.criticalPatients}</span>
        </div>
        {d.currentPatient && (
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: '#94A3B8' }}>Current patient</span>
            <span className="text-xs truncate max-w-24" style={{ color: '#475569' }}>{d.currentPatient}</span>
          </div>
        )}
      </div>

      <Btn
        variant={d.availability === 'Available' ? 'primary' : 'secondary'}
        size="xs"
        className="w-full"
        onClick={() => onAssign(d.id)}
      >
        {d.availability === 'Available' ? 'Assign →' : `Assign (${d.availability})`}
      </Btn>
    </Card>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs shrink-0" style={{ color: '#94A3B8' }}>{label}</span>
      <div className="text-right">{children}</div>
    </div>
  )
}
