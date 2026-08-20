import { useState } from 'react'
import { useApp } from '../context'
import { REFERRALS, DOCTORS, PATIENTS } from '../data/mock'
import { PriorityBadge, AvailabilityDot, Btn, Card } from '../components/ui'

export function AdminReferrals() {
  const { setView, setSelectedPatientId } = useApp()
  const [assignedReferral, setAssignedReferral] = useState<string | null>(null)
  const [expandedReferral, setExpandedReferral] = useState<string | null>(REFERRALS[1].id)

  return (
    <div className="min-w-0 p-3 sm:p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Referral Queue</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>{REFERRALS.filter(r => r.status === 'Pending').length} pending referrals awaiting assignment</p>
        </div>
      </div>

      {/* Critical referral alert */}
      {REFERRALS.some(r => r.urgency === 'CRITICAL' && r.status === 'Pending') && (
        <div
          className="flex items-center gap-3 rounded-md px-4 py-3 mb-5 text-sm font-medium"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}
        >
          <span>▲</span>
          Critical referral awaiting assignment — Kavitha Reddy to Neurosurgery
        </div>
      )}

      <div className="space-y-4">
        {REFERRALS.map(referral => {
          const patient = PATIENTS.find(p => p.id === referral.patientId)!
          const isExpanded = expandedReferral === referral.id
          const isAssigned = assignedReferral === referral.id

          const matchedDoctors = DOCTORS.filter(d =>
            referral.requestedSpecialty.toLowerCase().includes(d.specialty.toLowerCase())
          )
          const fallbackDoctors = DOCTORS.slice(0, 3)
          const doctorList = matchedDoctors.length > 0 ? matchedDoctors : fallbackDoctors

          return (
            <Card key={referral.id} style={{ overflow: 'hidden', border: referral.urgency === 'CRITICAL' ? '1px solid #FECACA' : '1px solid #E2E8F0' }}>
              {/* Header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                style={{ background: isExpanded ? '#F8FAFC' : '#fff' }}
                onClick={() => setExpandedReferral(isExpanded ? null : referral.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm" style={{ color: '#0F172A' }}>{referral.patientName}</span>
                      <PriorityBadge priority={referral.urgency} size="xs" />
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                      From <strong>{referral.fromDoctorName}</strong> → {referral.requestedSpecialty}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-right" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Submitted {referral.submittedAt}
                </div>
                <div
                  className="text-xs px-2.5 py-1 rounded-sm font-medium"
                  style={{
                    background: isAssigned ? '#F0FDF4' : referral.status === 'Pending' ? '#FFFBEB' : '#F0FDF4',
                    color: isAssigned ? '#15803D' : referral.status === 'Pending' ? '#92400E' : '#15803D',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {isAssigned ? '✓ Assigned' : referral.status}
                </div>
                <span style={{ color: '#94A3B8', fontSize: 12 }}>{isExpanded ? '▲' : '▼'}</span>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #E2E8F0' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 0 }}>
                    {/* Referral details */}
                    <div className="p-5" style={{ borderRight: '1px solid #E2E8F0' }}>
                      <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                        Referral Details
                      </div>
                      <div className="space-y-2.5">
                        <Row label="Patient">
                          <div>
                            <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{referral.patientName}</div>
                            <div className="text-xs" style={{ color: '#94A3B8' }}>{patient.age}{patient.sex} · {patient.modality} {patient.region}</div>
                          </div>
                        </Row>
                        <Row label="Referring doctor">
                          <span className="text-sm" style={{ color: '#0F172A' }}>{referral.fromDoctorName}</span>
                        </Row>
                        <Row label="Requested specialty">
                          <span className="text-sm font-medium" style={{ color: '#1D4ED8' }}>{referral.requestedSpecialty}</span>
                        </Row>
                        <Row label="Urgency">
                          <PriorityBadge priority={referral.urgency} size="xs" />
                        </Row>
                        <Row label="Reason">
                          <span className="text-xs" style={{ color: '#475569' }}>{referral.reason}</span>
                        </Row>
                        <Row label="AI Finding">
                          <span className="text-xs" style={{ color: '#475569' }}>{patient.aiSummary} ({patient.aiConfidence}%)</span>
                        </Row>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Btn variant="outline" size="xs" onClick={() => { setSelectedPatientId(referral.patientId); setView('patient-timeline') }}>
                          View Timeline
                        </Btn>
                      </div>
                    </div>

                    {/* Doctor selection */}
                    <div className="p-5">
                      <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                        {matchedDoctors.length > 0 ? `${referral.requestedSpecialty} Doctors` : 'Available Doctors'}
                      </div>
                      <div className="space-y-2">
                        {doctorList.map(d => (
                          <div
                            key={d.id}
                            className="flex items-center gap-3 p-3 rounded-md"
                            style={{ border: '1px solid #E2E8F0' }}
                          >
                            <div
                              className="flex items-center justify-center rounded-full text-white text-xs font-semibold shrink-0"
                              style={{ width: 32, height: 32, background: d.availability === 'Available' ? '#0891B2' : '#64748B', fontSize: 11 }}
                            >
                              {d.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{d.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <AvailabilityDot status={d.availability} />
                                <span className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                                  {d.patientsWaiting}p · {d.criticalPatients}c
                                </span>
                              </div>
                            </div>
                            <Btn
                              variant={d.availability === 'Available' ? 'primary' : 'secondary'}
                              size="xs"
                              onClick={() => setAssignedReferral(referral.id)}
                              disabled={isAssigned}
                            >
                              Assign
                            </Btn>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Workflow diagram */}
      <Card style={{ marginTop: 24, padding: 20 }}>
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
          Referral Workflow
        </div>
        <div className="flex items-center gap-0 overflow-x-auto">
          {['Doctor submits referral', 'Admin Referral Queue', 'Admin assigns doctor', 'Doctor receives patient', 'Shared imaging access'].map((label, i, arr) => (
            <div key={label} className="flex items-center shrink-0">
              <div className="text-center">
                <div
                  className="mx-auto flex items-center justify-center rounded-full text-xs font-bold mb-1"
                  style={{ width: 24, height: 24, background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
                >
                  {i + 1}
                </div>
                <div className="text-xs max-w-20 text-center" style={{ color: '#475569' }}>{label}</div>
              </div>
              {i < arr.length - 1 && (
                <div className="mx-3 shrink-0" style={{ width: 24, height: 1, background: '#CBD5E1' }} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs" style={{ color: '#94A3B8' }}>
          Original imaging study is shared — not duplicated. Both doctors access the same AWS HealthImaging study.
        </div>
      </Card>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs shrink-0 pt-0.5" style={{ color: '#94A3B8', minWidth: 100 }}>{label}</span>
      <div>{children}</div>
    </div>
  )
}
