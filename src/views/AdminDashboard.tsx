import { useApp } from '../context'
import { PATIENTS, DOCTORS, REFERRALS } from '../data/mock'
import { PriorityBadge, StatusPill, AvailabilityDot, Card, Btn } from '../components/ui'

export function AdminDashboard() {
  const { setView, setSelectedPatientId } = useApp()

  const critical = PATIENTS.filter(p => p.priority === 'CRITICAL' && p.status !== 'Completed')
  const warning = PATIENTS.filter(p => p.priority === 'WARNING' && p.status !== 'Completed')
  const routine = PATIENTS.filter(p => p.priority === 'ROUTINE' && p.status !== 'Completed')
  const unassigned = PATIENTS.filter(p => !p.assignedDoctorId && p.status !== 'Completed')
  const available = DOCTORS.filter(d => d.availability === 'Available')
  const processing = PATIENTS.filter(p => p.aiStatus === 'Analyzing' || p.imagingStatus === 'Processing')

  const stats = [
    { label: 'Waiting', value: critical.length + warning.length + routine.length, icon: '⊞', color: '#1D4ED8', sub: 'Active patients' },
    { label: 'Critical', value: critical.length, icon: '▲', color: '#DC2626', sub: 'Require immediate attention' },
    { label: 'Warning', value: warning.length, icon: '◆', color: '#D97706', sub: 'Early signs detected' },
    { label: 'Routine', value: routine.length, icon: '●', color: '#16A34A', sub: 'Normal priority' },
    { label: 'Unassigned', value: unassigned.length, icon: '○', color: '#7C3AED', sub: 'Awaiting doctor' },
    { label: 'Available Doctors', value: available.length, icon: '+', color: '#0891B2', sub: `of ${DOCTORS.length} total` },
    { label: 'Pending Referrals', value: REFERRALS.filter(r => r.status === 'Pending').length, icon: '⇄', color: '#EA580C', sub: 'Need assignment' },
    { label: 'AI Processing', value: processing.length, icon: '◎', color: '#7C3AED', sub: 'Scans in queue' },
  ]

  const urgentPatients = PATIENTS.filter(p => p.priority === 'CRITICAL' || (p.priority === 'WARNING' && !p.assignedDoctorId)).sort((a, b) => {
    if (a.priority === 'CRITICAL' && b.priority !== 'CRITICAL') return -1
    if (b.priority === 'CRITICAL' && a.priority !== 'CRITICAL') return 1
    return a.waitingMinutes - b.waitingMinutes
  }).slice(0, 6)

  return (
    <div className="p-6 max-w-6xl">
      {/* Alert bar */}
      {critical.some(p => !p.assignedDoctorId) && (
        <div
          className="flex items-center gap-3 rounded-md px-4 py-3 mb-5 text-sm font-medium"
          style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}
        >
          <span>▲</span>
          <span>
            {critical.filter(p => !p.assignedDoctorId).length} critical patient(s) awaiting doctor assignment.
          </span>
          <button
            onClick={() => setView('admin-assignment')}
            className="ml-auto text-xs font-semibold underline"
            style={{ color: '#DC2626' }}
          >
            Assign now →
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <Card key={s.label} style={{ padding: 16 }}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </span>
              <span style={{ color: s.color, fontSize: 14 }}>{s.icon}</span>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-1" style={{ color: s.color, fontFamily: 'var(--font-mono)' }}>
              {s.value}
            </div>
            <div className="text-xs" style={{ color: '#94A3B8' }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Urgent patients */}
        <div className="col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: '#0F172A' }}>Urgent Patients</h2>
            <Btn variant="ghost" size="xs" onClick={() => setView('admin-queue')}>View all →</Btn>
          </div>
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Patient', 'Scan', 'AI Priority', 'AI Finding', 'Assigned', 'Waiting'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {urgentPatients.map((p, i) => {
                  const doctor = DOCTORS.find(d => d.id === p.assignedDoctorId)
                  return (
                    <tr
                      key={p.id}
                      className="transition-colors cursor-pointer"
                      style={{ borderBottom: i < urgentPatients.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F8FAFC' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
                      onClick={() => { setSelectedPatientId(p.id); setView('admin-assignment') }}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm" style={{ color: '#0F172A' }}>{p.name}</div>
                        <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                          {p.age}{p.sex} · {p.id.toUpperCase()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#475569' }}>
                        {p.modality} {p.region}
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={p.priority} size="xs" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs" style={{ color: '#475569' }}>{p.aiSummary}</div>
                        <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                          {p.aiConfidence}% conf.
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {doctor ? (
                          <span className="text-xs" style={{ color: '#475569' }}>{doctor.name}</span>
                        ) : (
                          <span
                            className="text-xs font-semibold rounded-sm px-2 py-0.5"
                            style={{ background: '#FEF3C7', color: '#92400E' }}
                          >
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs" style={{ color: p.waitingMinutes < 5 ? '#DC2626' : '#64748B', fontFamily: 'var(--font-mono)' }}>
                          {p.waitingMinutes} min
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Doctor availability */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold" style={{ color: '#0F172A' }}>Doctor Availability</h2>
          </div>
          <div className="space-y-2">
            {DOCTORS.map(d => (
              <Card key={d.id} style={{ padding: '10px 14px' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full text-white text-xs font-semibold shrink-0"
                    style={{ width: 32, height: 32, background: d.availability === 'Available' ? '#16A34A' : '#64748B', fontSize: 11 }}
                  >
                    {d.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#0F172A' }}>{d.name}</div>
                    <div className="text-xs" style={{ color: '#64748B' }}>{d.specialty}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <AvailabilityDot status={d.availability} />
                    <div className="text-xs mt-0.5" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                      {d.patientsWaiting}p · {d.criticalPatients}c
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-5 flex gap-3">
        <Btn variant="primary" size="sm" onClick={() => setView('admin-registration')}>+ Register Patient</Btn>
        <Btn variant="outline" size="sm" onClick={() => setView('admin-queue')}>View Patient Queue</Btn>
        <Btn variant="outline" size="sm" onClick={() => setView('admin-referrals')}>Referral Queue ({REFERRALS.filter(r => r.status === 'Pending').length})</Btn>
        <Btn variant="outline" size="sm" onClick={() => setView('admin-model-monitoring')}>AI Model Status</Btn>
      </div>
    </div>
  )
}
