import { useState } from 'react'
import { useApp } from '../context'
import { PATIENTS } from '../data/mock'
import { PriorityBadge, ImagingStatusBadge, Btn, Card } from '../components/ui'

export function RadiologistDashboard() {
  const { workflow, markRadiologistReviewed, markStudyUploaded, setSelectedPatientId, setView } = useApp()
  const [selected, setSelected] = useState(PATIENTS.find(p => p.imagingStatus !== 'Ready')?.id ?? PATIENTS[0].id)
  const patient = PATIENTS.find(p => p.id === selected) ?? PATIENTS[0]
  const pending = PATIENTS.filter(p => p.status !== 'Completed')
  const reviewed = workflow.radiologistReviewed.includes(patient.id)
  const uploaded = workflow.uploadedStudies.includes(patient.id)

  return <div className="p-3 sm:p-6">
    <div className="mb-5"><h1 className="text-lg font-semibold text-slate-900">Radiology Queue</h1><p className="text-sm text-slate-500">Review ordered studies and upload the associated patient files.</p></div>
    <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <Card style={{ padding: 16 }}><div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Studies awaiting review</div><div className="flex flex-col gap-2">{pending.map(p => <button key={p.id} onClick={() => setSelected(p.id)} className={`rounded-md border p-3 text-left ${selected === p.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-slate-900">{p.name}</span><PriorityBadge priority={p.priority} size="xs" /></div><div className="mt-1 text-xs text-slate-500">{p.modality} · {p.region} · {p.studyId}</div><div className="mt-2"><ImagingStatusBadge status={p.imagingStatus} /></div></button>)}</div></Card>
      <Card style={{ padding: 20 }}><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-xs font-semibold uppercase tracking-widest text-slate-400">Selected study</div><h2 className="mt-1 text-base font-semibold text-slate-900">{patient.name}</h2><p className="text-xs text-slate-500">{patient.age}{patient.sex} · {patient.modality} {patient.region} · {patient.studyId}</p></div><PriorityBadge priority={patient.priority} size="sm" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="text-xs text-slate-400">Ordered test</div><div className="mt-1 text-sm font-medium text-slate-900">{patient.scanReason}</div><div className="mt-1 text-xs text-slate-500">Requested specialty: {patient.suggestedSpecialty}</div></div><div className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="text-xs text-slate-400">AI status</div><div className="mt-1 text-sm font-medium text-slate-900">{patient.aiStatus}</div><div className="mt-1 text-xs text-slate-500">Finding: {patient.aiSummary}</div></div></div><div className="mt-5 rounded-md border border-dashed border-blue-300 bg-blue-50 p-5 text-center"><div className="text-sm font-semibold text-slate-900">{uploaded ? 'Study uploaded and associated' : 'Upload patient report files'}</div><p className="mt-1 text-xs text-slate-500">Only the radiologist can complete this imaging handoff.</p><Btn variant="primary" size="sm" className="mt-4" onClick={() => { markRadiologistReviewed(patient.id); markStudyUploaded(patient.id) }}>{uploaded ? 'Files uploaded' : 'Upload files'}</Btn></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-slate-500">{reviewed ? 'Report reviewed' : 'Review severity before consultant assignment'}</span><Btn variant="secondary" size="sm" disabled={!uploaded} onClick={() => { setSelectedPatientId(patient.id); setView('admin-assignment') }}>Send to consultant assignment →</Btn></div></Card>
    </div>
  </div>
}

export default RadiologistDashboard
