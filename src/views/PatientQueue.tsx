import { useState } from 'react'
import { useApp } from '../context'
import { PATIENTS, DOCTORS } from '../data/mock'
import { PriorityBadge, StatusPill, ImagingStatusBadge, Btn, Card } from '../components/ui'
import type { Priority, ImagingModality } from '../types'

type FilterPriority = Priority | 'ALL'
type FilterAssigned = 'ALL' | 'ASSIGNED' | 'UNASSIGNED'

export function PatientQueue() {
  const { role, setView, setSelectedPatientId, registeredPatients } = useApp()
  const patients = [...PATIENTS, ...registeredPatients]
  if (role === 'doctor') return null
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('ALL')
  const [filterAssigned, setFilterAssigned] = useState<FilterAssigned>('ALL')
  const [filterModality, setFilterModality] = useState<string>('ALL')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'priority' | 'waiting'>('priority')

  const filtered = patients
    .filter(p => p.status !== 'Completed')
    .filter(p => filterPriority === 'ALL' || p.priority === filterPriority)
    .filter(p => filterAssigned === 'ALL' || (filterAssigned === 'ASSIGNED' ? !!p.assignedDoctorId : !p.assignedDoctorId))
    .filter(p => filterModality === 'ALL' || p.modality === filterModality)
    .filter(p =>
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search.toLowerCase()) ||
      p.studyId.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order = { CRITICAL: 0, WARNING: 1, ROUTINE: 2 }
        const d = order[a.priority] - order[b.priority]
        return d !== 0 ? d : a.waitingMinutes - b.waitingMinutes
      }
      return a.waitingMinutes - b.waitingMinutes
    })

  const priorityCounts = {
    CRITICAL: PATIENTS.filter(p => p.priority === 'CRITICAL' && p.status !== 'Completed').length,
    WARNING: PATIENTS.filter(p => p.priority === 'WARNING' && p.status !== 'Completed').length,
    ROUTINE: PATIENTS.filter(p => p.priority === 'ROUTINE' && p.status !== 'Completed').length,
  }

  const pillStyle = (active: boolean, color = '#1D4ED8') => ({
    padding: '4px 12px',
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    border: `1px solid ${active ? color : '#E2E8F0'}`,
    background: active ? color : '#fff',
    color: active ? '#fff' : '#475569',
    fontWeight: active ? 600 : 400,
  })

  return (
    <div className="min-w-0 p-3 sm:p-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Patient Queue</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>{filtered.length} of {patients.filter(p => p.status !== 'Completed').length} patients</p>
        </div>
        <Btn variant="primary" size="sm" onClick={() => setView('admin-registration')}>+ Register Patient</Btn>
      </div>

      {/* Filters */}
      <Card style={{ padding: 14, marginBottom: 16 }}>
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient, ID, study..."
            className="text-sm outline-none"
            style={{
              padding: '6px 12px', borderRadius: 4, border: '1px solid #E2E8F0',
              width: 220, color: '#0F172A', background: '#F8FAFC',
            }}
          />

          <div className="w-px h-6" style={{ background: '#E2E8F0' }} />

          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <button style={pillStyle(filterPriority === 'ALL')} onClick={() => setFilterPriority('ALL')}>All</button>
            <button style={pillStyle(filterPriority === 'CRITICAL', '#DC2626')} onClick={() => setFilterPriority('CRITICAL')}>
              ▲ Critical ({priorityCounts.CRITICAL})
            </button>
            <button style={pillStyle(filterPriority === 'WARNING', '#D97706')} onClick={() => setFilterPriority('WARNING')}>
              ◆ Warning ({priorityCounts.WARNING})
            </button>
            <button style={pillStyle(filterPriority === 'ROUTINE', '#16A34A')} onClick={() => setFilterPriority('ROUTINE')}>
              ● Routine ({priorityCounts.ROUTINE})
            </button>
          </div>

          <div className="w-px h-6" style={{ background: '#E2E8F0' }} />

          {/* Assigned filter */}
          <div className="flex items-center gap-1.5">
            <button style={pillStyle(filterAssigned === 'ALL')} onClick={() => setFilterAssigned('ALL')}>All</button>
            <button style={pillStyle(filterAssigned === 'UNASSIGNED', '#7C3AED')} onClick={() => setFilterAssigned('UNASSIGNED')}>Unassigned</button>
            <button style={pillStyle(filterAssigned === 'ASSIGNED')} onClick={() => setFilterAssigned('ASSIGNED')}>Assigned</button>
          </div>

          <div className="w-px h-6" style={{ background: '#E2E8F0' }} />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'priority' | 'waiting')}
            className="text-xs outline-none"
            style={{
              padding: '5px 10px', borderRadius: 4, border: '1px solid #E2E8F0',
              background: '#F8FAFC', color: '#475569', cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <option value="priority">Sort: Priority</option>
            <option value="waiting">Sort: Waiting time</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ overflow: 'hidden' }}>
        <div className="w-full overflow-x-auto">
        <table className="min-w-[1180px] w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
              {['Patient', 'Age/Gender', 'Imaging Test', 'Study Status', 'AI Priority', 'AI Finding', 'Specialty', 'Assigned Doctor', 'Waiting', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const doctor = DOCTORS.find(d => d.id === p.assignedDoctorId)
              return (
                <tr
                  key={p.id}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F8FAFC' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: '#0F172A' }}>{p.name}</div>
                    <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{p.studyId}</div>
                    {p.isReferral && (
                      <span className="text-xs px-1.5 py-0.5 rounded-sm" style={{ background: '#FFF7ED', color: '#EA580C', fontFamily: 'var(--font-mono)' }}>
                        Referral
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}>
                    {p.age}{p.sex}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#475569' }}>
                    {p.modality} · {p.region}
                  </td>
                  <td className="px-4 py-3">
                    <ImagingStatusBadge status={p.imagingStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={p.priority} size="xs" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs max-w-36 truncate" style={{ color: '#475569' }}>{p.aiSummary}</div>
                    <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{p.aiConfidence}%</div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#475569' }}>{p.suggestedSpecialty}</td>
                  <td className="px-4 py-3">
                    {doctor ? (
                      <div>
                        <div className="text-xs font-medium" style={{ color: '#0F172A' }}>{doctor.name}</div>
                        <div className="text-xs" style={{ color: '#64748B' }}>{doctor.specialty}</div>
                      </div>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-sm font-medium" style={{ background: '#FEF3C7', color: '#92400E' }}>
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: p.waitingMinutes < 5 ? '#DC2626' : '#64748B', fontFamily: 'var(--font-mono)', fontWeight: p.waitingMinutes < 5 ? 600 : 400 }}>
                    {p.waitingMinutes} min
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {!p.assignedDoctorId && (
                        <Btn variant="primary" size="xs" onClick={() => { setSelectedPatientId(p.id); setView('admin-assignment') }}>
                          Assign
                        </Btn>
                      )}
                      <Btn variant="ghost" size="xs" onClick={() => { setSelectedPatientId(p.id); setView('patient-timeline') }}>
                        Timeline
                      </Btn>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12" style={{ color: '#94A3B8' }}>
            <div className="text-3xl mb-2">⊘</div>
            <div className="text-sm">No patients match the current filters.</div>
          </div>
        )}
      </Card>
    </div>
  )
}
