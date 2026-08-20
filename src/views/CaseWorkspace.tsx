import { useState } from 'react'
import { useApp } from '../context'
import { PATIENTS, DOCTORS } from '../data/mock'
import { PriorityBadge, StatusPill, Btn, Card } from '../components/ui'

const MY_DOCTOR_ID = 'd1'

type RightPanel = 'info' | 'ai' | 'notes' | 'feedback'

export function CaseWorkspace() {
  const { selectedPatientId, setSelectedPatientId, setView, confirmDiagnosis } = useApp()
  const [rightPanel, setRightPanel] = useState<RightPanel>('ai')
  const [slice, setSlice] = useState(24)
  const [series, setSeries] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [tool, setTool] = useState<'scroll' | 'zoom' | 'pan' | 'measure'>('scroll')
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [notes, setNotes] = useState('')
  const [feedbackState, setFeedbackState] = useState<'idle' | 'disagree-form' | 'submitted'>('idle')
  const [correctFinding, setCorrectFinding] = useState('')
  const [doctorComment, setDoctorComment] = useState('')
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [referralSubmitted, setReferralSubmitted] = useState(false)
  const [showImagingRequest, setShowImagingRequest] = useState(false)
  const [imagingRequested, setImagingRequested] = useState(false)
  const [urgency, setUrgency] = useState<'CRITICAL' | 'WARNING' | 'ROUTINE'>('ROUTINE')

  const myPatients = PATIENTS.filter(p => p.assignedDoctorId === MY_DOCTOR_ID && p.status !== 'Completed')
  const patient = PATIENTS.find(p => p.id === selectedPatientId) ?? myPatients[0]!

  if (!patient) return (
    <div className="flex items-center justify-center h-full" style={{ color: '#94A3B8' }}>
      No case selected.
    </div>
  )

  const maxSlice = 48

  return (
    <div className="flex min-w-0 h-full flex-col overflow-y-auto lg:flex-row" style={{ minHeight: 'calc(100vh - 52px)' }}>
      {/* LEFT: Queue sidebar */}
      <div
        className="hidden md:flex flex-col shrink-0 overflow-y-auto"
        style={{ width: 200, borderRight: '1px solid #E2E8F0', background: '#F8FAFC' }}
      >
        <div className="px-3 py-3 text-xs font-semibold uppercase tracking-widest" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)', borderBottom: '1px solid #E2E8F0' }}>
          My Queue
        </div>
        {myPatients.map(p => {
          const isActive = p.id === patient.id
          const accent = p.priority === 'CRITICAL' ? '#DC2626' : p.priority === 'WARNING' ? '#D97706' : '#16A34A'
          return (
            <button
              key={p.id}
              onClick={() => { setSelectedPatientId(p.id); setSeries(0); setSlice(24) }}
              className="w-full text-left px-3 py-3 transition-colors"
              style={{
                background: isActive ? '#fff' : 'transparent',
                borderBottom: '1px solid #F1F5F9',
                borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#F1F5F9' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <div className="text-xs font-medium truncate" style={{ color: '#0F172A' }}>{p.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs" style={{ color: accent, fontFamily: 'var(--font-mono)' }}>
                  {p.priority === 'CRITICAL' ? '▲' : p.priority === 'WARNING' ? '◆' : '●'}
                </span>
                <span className="text-xs truncate" style={{ color: '#94A3B8' }}>{p.modality} {p.region}</span>
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>{p.waitingMinutes}m</div>
            </button>
          )
        })}
      </div>

      {/* CENTER: DICOM Viewer */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background: '#070A0D', position: 'relative' }}>
        {/* Viewer toolbar */}
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#0F172A', borderBottom: '1px solid #1E293B' }}>
          {/* Tools */}
          {(['scroll', 'zoom', 'pan', 'measure'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className="text-xs px-2.5 py-1 rounded transition-colors"
              style={{
                background: tool === t ? '#1D4ED8' : 'transparent',
                color: tool === t ? '#fff' : '#64748B',
                fontFamily: 'var(--font-mono)',
                border: `1px solid ${tool === t ? '#1D4ED8' : '#1E293B'}`,
              }}
            >
              {t === 'scroll' ? '↕ Scroll' : t === 'zoom' ? '⊕ Zoom' : t === 'pan' ? '⤢ Pan' : '◫ Measure'}
            </button>
          ))}

          <div className="flex-1" />

          {/* Zoom control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
              className="text-xs px-2 py-1 rounded"
              style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
            >−</button>
            <span className="text-xs" style={{ color: '#64748B', fontFamily: 'var(--font-mono)', minWidth: 36, textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(4, z + 0.25))}
              className="text-xs px-2 py-1 rounded"
              style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
            >+</button>
          </div>

          {/* Window/Level */}
          <div
            className="text-xs px-3 py-1 rounded"
            style={{ background: '#1E293B', color: '#64748B', border: '1px solid #334155', fontFamily: 'var(--font-mono)' }}
          >
            W:80 L:40
          </div>

          {/* Fullscreen */}
          <button
            className="text-xs px-2 py-1 rounded"
            style={{ background: '#1E293B', color: '#64748B', border: '1px solid #334155' }}
          >
            ⛶
          </button>
        </div>

        {/* Scan area */}
        <div className="flex min-h-[420px] min-w-0 flex-1 overflow-hidden lg:min-h-0">
          {/* Series thumbnails */}
          <div
            className="flex flex-col gap-2 p-2 overflow-y-auto"
            style={{ width: 72, background: '#0A0D10', borderRight: '1px solid #1E293B' }}
          >
            {['Series 1\nAxial', 'Series 2\nCoronal', 'Series 3\nSagittal'].map((s, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Select ${s.replace('\n', ' ')}`}
                onClick={() => { setSeries(i); setSlice(24) }}
                className="rounded cursor-pointer overflow-hidden"
                style={{ border: i === series ? '1px solid #1D4ED8' : '1px solid #1E293B', aspectRatio: '1' }}
              >
                <div
                  style={{
                    background: `radial-gradient(ellipse ${55 + i * 8}% ${70 + i * 6}% at ${50 + i * 5}% 45%, #2a2a2a 0%, #1a1a1a 60%, #0a0a0a 100%)`,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '2px 3px',
                  }}
                >
                  <span style={{ color: '#475569', fontSize: 8, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-line', lineHeight: 1.2 }}>{s}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Main scan viewport */}
          <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-auto" onWheel={e => { e.preventDefault(); if (tool === 'scroll') setSlice(s => Math.min(maxSlice, Math.max(1, s + (e.deltaY > 0 ? 1 : -1)))); if (tool === 'zoom') setZoom(z => Math.min(4, Math.max(0.5, z + (e.deltaY > 0 ? -0.1 : 0.1)))) }}>

            {/* CT Scan illustration */}
            <div style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`, transition: 'transform 0.1s', position: 'relative', cursor: tool === 'pan' ? 'grab' : 'default' }} onClick={() => { if (tool === 'measure') setDoctorComment('Measurement placed: 42 mm') }} onPointerMove={event => { if (tool === 'pan' && event.buttons === 1) setPanOffset(current => ({ x: current.x + event.movementX, y: current.y + event.movementY })) }}>

              <svg width="380" height="380" viewBox="0 0 380 380" style={{ display: 'block', maxWidth: 'min(380px, 78vw)', height: 'auto' }}>
                {/* Outer skull */}
                <ellipse cx="190" cy="185" rx="155" ry="165" fill="none" stroke="#C8C8C8" strokeWidth="12" />
                {/* Skull interior (bone) */}
                <ellipse cx="190" cy="185" rx="143" ry="153" fill="#1A1A1A" stroke="#A0A0A0" strokeWidth="3" />
                {/* Brain parenchyma */}
                <ellipse cx="190" cy="192" rx="128" ry="138" fill="#242424" />
                {/* Falx cerebri */}
                <line x1="190" y1="60" x2="190" y2="310" stroke="#181818" strokeWidth="2" />
                {/* Gyri pattern — left hemisphere */}
                <path d="M 100 170 Q 120 155 140 170 Q 155 155 170 170" fill="none" stroke="#2d2d2d" strokeWidth="3" />
                <path d="M 90 200 Q 115 185 140 200 Q 160 182 180 200" fill="none" stroke="#2d2d2d" strokeWidth="3" />
                <path d="M 95 230 Q 120 215 145 230 Q 160 215 178 230" fill="none" stroke="#2d2d2d" strokeWidth="3" />
                {/* Gyri — right hemisphere */}
                <path d="M 210 170 Q 230 155 250 170 Q 265 155 280 170" fill="none" stroke="#2d2d2d" strokeWidth="3" />
                <path d="M 202 200 Q 225 185 250 200 Q 268 183 288 200" fill="none" stroke="#2d2d2d" strokeWidth="3" />
                <path d="M 204 230 Q 228 215 252 230 Q 268 215 286 230" fill="none" stroke="#2d2d2d" strokeWidth="3" />
                {/* Ventricles */}
                <ellipse cx="172" cy="190" rx="14" ry="22" fill="#0D0D0D" stroke="#111" strokeWidth="1" />
                <ellipse cx="208" cy="190" rx="14" ry="22" fill="#0D0D0D" stroke="#111" strokeWidth="1" />
                {/* Third ventricle */}
                <rect x="183" y="176" width="14" height="28" rx="3" fill="#0A0A0A" />
                {/* AI-detected abnormality — hemorrhage — right temporal */}
                <ellipse cx="268" cy="210" rx="18" ry="14" fill="#FF4444" opacity="0.9" />
                <ellipse cx="268" cy="210" rx="18" ry="14" fill="none" stroke="#FF6666" strokeWidth="1.5" strokeDasharray="3,2" />
                {/* AI annotation label */}
                <line x1="286" y1="205" x2="310" y2="188" stroke="#FF4444" strokeWidth="1" strokeDasharray="2,2" />
                <rect x="312" y="180" width="56" height="16" rx="2" fill="#FF4444" opacity="0.9" />
                <text x="340" y="191" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">AI: 94%</text>
                {/* Overlay info */}
                <text x="8" y="18" fill="#4A6070" fontSize="9" fontFamily="monospace">CT BRAIN</text>
                <text x="8" y="30" fill="#4A6070" fontSize="9" fontFamily="monospace">{series === 0 ? 'AXIAL' : series === 1 ? 'CORONAL' : 'SAGITTAL'}</text>
                <text x="8" y="364" fill="#4A6070" fontSize="9" fontFamily="monospace">WW:80 WL:40</text>
                <text x="340" y="18" fill="#4A6070" fontSize="9" fontFamily="monospace" textAnchor="end">STU-001</text>
                <text x="340" y="30" fill="#4A6070" fontSize="9" fontFamily="monospace" textAnchor="end">1.5T</text>
                {/* L/R markers */}
                <text x="16" y="196" fill="#557080" fontSize="10" fontFamily="monospace" fontWeight="bold">R</text>
                <text x="358" y="196" fill="#557080" fontSize="10" fontFamily="monospace" fontWeight="bold">L</text>
                {/* Anterior/Posterior */}
                <text x="190" y="14" fill="#557080" fontSize="9" fontFamily="monospace" textAnchor="middle">A</text>
                <text x="190" y="376" fill="#557080" fontSize="9" fontFamily="monospace" textAnchor="middle">P</text>
                {/* Slice number overlay */}
                <text x="372" y="196" fill="#557080" fontSize="9" fontFamily="monospace" textAnchor="end">{slice}/{maxSlice}</text>
              </svg>
            </div>

            {/* CRITICAL overlay badge */}
            <div
              className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded"
              style={{ background: '#DC2626', color: '#fff', fontFamily: 'var(--font-mono)' }}
            >
              ▲ AI CRITICAL
            </div>

            {/* Bottom: Slice navigation */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-4 py-3" style={{ background: 'linear-gradient(transparent, #070A0D)' }}>
              <button
                onClick={() => setSlice(s => Math.max(1, s - 1))}
                className="text-xs px-2.5 py-1 rounded"
                style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
              >◀</button>
              <input
                type="range" min={1} max={maxSlice} value={slice}
onChange={e => { const next = +e.target.value; setSlice(next); setZoom(0.5 + (next / maxSlice) * 3.5) }}
              className="flex-1"
                style={{ accentColor: '#1D4ED8' }}
              />
              <button
                onClick={() => setSlice(s => Math.min(maxSlice, s + 1))}
                className="text-xs px-2.5 py-1 rounded"
                style={{ background: '#1E293B', color: '#94A3B8', border: '1px solid #334155' }}
              >▶</button>
              <span className="text-xs" style={{ color: '#475569', fontFamily: 'var(--font-mono)', minWidth: 44 }}>
                {slice} / {maxSlice}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Info panel */}
      <div
        className="flex w-full flex-col shrink-0 overflow-y-auto lg:w-[300px]"
        style={{ width: '100%', background: '#FFFFFF', borderLeft: '1px solid #E2E8F0' }}
      >
        {/* Panel tabs */}
        <div className="flex" style={{ borderBottom: '1px solid #E2E8F0' }}>
          {([
            { id: 'info', label: 'Patient' },
            { id: 'ai', label: 'AI Results' },
            { id: 'notes', label: 'Notes' },
            { id: 'feedback', label: 'Feedback' },
          ] as { id: RightPanel; label: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setRightPanel(tab.id)}
              className="flex-1 py-2.5 text-xs font-medium transition-colors"
              style={{
                color: rightPanel === tab.id ? '#1D4ED8' : '#64748B',
                borderBottom: rightPanel === tab.id ? '2px solid #1D4ED8' : '2px solid transparent',
                background: 'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {rightPanel === 'info' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Demographics
                </div>
                <div className="space-y-1.5">
                  <InfoRow label="Name" value={patient.name} />
                  <InfoRow label="Age / Sex" value={`${patient.age} / ${patient.sex === 'M' ? 'Male' : 'Female'}`} />
                  <InfoRow label="DOB" value={patient.dob} mono />
                  <InfoRow label="Phone" value={patient.phone} mono />
                  <InfoRow label="Patient ID" value={patient.id.toUpperCase()} mono />
                  <InfoRow label="Study ID" value={patient.studyId} mono />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Clinical
                </div>
                <div className="space-y-1.5">
                  <InfoRow label="Modality" value={`${patient.modality} · ${patient.region}`} />
                  <InfoRow label="Symptoms" value={patient.symptoms} wrap />
                  <InfoRow label="Scan reason" value={patient.scanReason} wrap />
                  {patient.isReferral && <InfoRow label="Referred from" value={patient.referredFrom!} wrap />}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Status
                </div>
                <StatusPill status={patient.status} />
              </div>
            </div>
          )}

          {rightPanel === 'ai' && (
            <div className="space-y-4">
              {/* Triage result */}
              <div className="rounded-md p-3" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#991B1B', fontFamily: 'var(--font-mono)' }}>
                  AI TRIAGE
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={patient.priority} size="sm" />
                  <span className="text-xs" style={{ color: '#991B1B', fontFamily: 'var(--font-mono)' }}>{patient.aiConfidence}% confidence</span>
                </div>
              </div>

              {/* Potential findings */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Potential Findings
                </div>
                <div className="space-y-2">
                  {patient.aiFindings.map(f => (
                    <div key={f.finding} className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="text-xs" style={{ color: '#0F172A' }}>{f.finding}</div>
                        <div className="rounded-full overflow-hidden mt-1" style={{ height: 4, background: '#F1F5F9' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${f.confidence}%`,
                              background: f.confidence > 80 ? '#DC2626' : f.confidence > 55 ? '#D97706' : '#CBD5E1',
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium shrink-0" style={{ fontFamily: 'var(--font-mono)', color: '#475569', width: 34 }}>
                        {f.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Reason for Priority
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{patient.aiReason}</p>
              </div>

              {/* Suggested specialty */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Suggested Specialty
                </div>
                <span className="text-xs font-medium" style={{ color: '#1D4ED8' }}>{patient.suggestedSpecialty}</span>
              </div>

              {/* Model version */}
              <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                Model: {patient.aiModelVersion} · Study: {patient.studyId}
              </div>

              {/* Disclaimer */}
              <div
                className="text-xs p-3 rounded-sm leading-relaxed"
                style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}
              >
                AI-generated decision-support output. Final clinical assessment must be performed by a qualified clinician.
              </div>
            </div>
          )}

          {rightPanel === 'notes' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                Clinical Notes
              </div>
              <textarea
                rows={8}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add clinical observations, findings, and assessment..."
                className="w-full text-sm outline-none resize-none"
                style={{ padding: 10, borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', lineHeight: 1.6 }}
              />
              <div className="grid grid-cols-2 gap-2">
                <Btn variant="secondary" size="xs" onClick={() => {
                  const safe = (value: string) => value.replace(/[\\()]/g, '\\$&').replace(/\n/g, ' ')
                  const lines = [`Patient: ${patient.name}`, `Patient ID: ${patient.id}`, `Study: ${patient.studyId}`, `Saved: ${new Date().toLocaleString()}`, '', 'Clinical notes:', safe(notes || 'No notes entered.')]
                  const stream = `BT /F1 12 Tf 54 740 Td ${lines.map((line, index) => `${index ? '0 -22 Td ' : ''}(${safe(line)}) Tj`).join(' ')} ET`
                  const objects = [`<< /Type /Catalog /Pages 2 0 R >>`, `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`]
                  let pdf = '%PDF-1.4\n'
                  const offsets = [0]
                  objects.forEach((object, index) => { offsets[index + 1] = pdf.length; pdf += `${index + 1} 0 obj\n${object}\nendobj\n` })
                  const xref = pdf.length
                  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
                  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
                  const link = document.createElement('a')
                  link.href = url
                  link.download = `${patient.id}-draft.pdf`
                  link.click()
                  URL.revokeObjectURL(url)
                }}>Save Draft</Btn>
                <Btn variant="primary" size="xs" onClick={() => confirmDiagnosis(patient.id)}>Confirm Diagnosis</Btn>
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12 }}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  Actions
                </div>
                <div className="space-y-1.5">
                  <Btn variant="outline" size="xs" className="w-full" onClick={() => setShowReferralModal(true)}>→ Refer Patient</Btn>
                  <Btn variant="outline" size="xs" className="w-full" onClick={() => setShowImagingRequest(true)}>+ Request Additional Imaging</Btn>
                  <Btn variant="outline" size="xs" className="w-full">▤ View Previous Scans</Btn>
                  <Btn variant="ghost" size="xs" className="w-full" onClick={() => { setSelectedPatientId(patient.id); setView('patient-timeline') }}>
                    ◌ View Patient Timeline
                  </Btn>
                  <Btn variant="danger" size="xs" className="w-full" onClick={() => confirmDiagnosis(patient.id)}>✓ Complete Case</Btn>
                </div>
              </div>
            </div>
          )}

          {rightPanel === 'feedback' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                AI Assessment Feedback
              </div>

              {/* AI prediction recap */}
              <div className="rounded-sm p-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#475569' }}>AI Prediction</div>
                <div className="text-xs" style={{ color: '#0F172A' }}>{patient.aiSummary}</div>
                <div className="text-xs mt-0.5" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{patient.aiConfidence}% confidence · {patient.aiModelVersion}</div>
              </div>

              {feedbackState === 'idle' && (
                <div>
                  <div className="text-xs mb-3" style={{ color: '#475569' }}>Was the AI assessment accurate?</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Btn variant="secondary" size="sm" onClick={() => setFeedbackState('submitted')}>
                      ✓ Agree
                    </Btn>
                    <Btn variant="outline" size="sm" onClick={() => setFeedbackState('disagree-form')}>
                      ✗ Disagree
                    </Btn>
                  </div>
                </div>
              )}

              {feedbackState === 'disagree-form' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: '#475569' }}>Correct Finding</label>
                    <input
                      value={correctFinding}
                      onChange={e => setCorrectFinding(e.target.value)}
                      placeholder="e.g. Normal — no hemorrhage"
                      className="w-full text-xs outline-none"
                      style={{ padding: '7px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: '#475569' }}>Doctor Comments</label>
                    <textarea
                      rows={3}
                      value={doctorComment}
                      onChange={e => setDoctorComment(e.target.value)}
                      placeholder="Explain the discrepancy..."
                      className="w-full text-xs outline-none resize-none"
                      style={{ padding: '7px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A' }}
                    />
                  </div>
                  <Btn variant="primary" size="sm" className="w-full" onClick={() => setFeedbackState('submitted')}>
                    Submit AI Feedback
                  </Btn>
                </div>
              )}

              {feedbackState === 'submitted' && (
                <div className="rounded-md p-4 text-center" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div className="text-sm font-medium mb-1" style={{ color: '#14532D' }}>✓ Feedback submitted</div>
                  <div className="text-xs" style={{ color: '#16A34A' }}>Added to feedback dataset for review</div>
                </div>
              )}

              {feedbackState !== 'submitted' && (
                <div className="text-xs p-3 rounded-sm" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B' }}>
                  Feedback is reviewed manually. Model updates follow offline validation and controlled deployment.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showImagingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" style={{ background: 'rgba(15,23,42,0.6)' }} onClick={() => setShowImagingRequest(false)}>
          <div className="w-full max-w-md rounded-lg bg-white p-5" onClick={e => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between"><div className="font-semibold" style={{ color: '#0F172A' }}>Request Additional Imaging</div><button onClick={() => setShowImagingRequest(false)} style={{ color: '#94A3B8', fontSize: 18 }}>×</button></div>
            {imagingRequested ? <div className="rounded-md p-4 text-center" style={{ background: '#F0FDF4', color: '#166534' }}>Imaging request sent to the radiology queue.</div> : <div className="space-y-3"><textarea rows={4} placeholder="Describe the additional views or images required..." className="w-full resize-none rounded border p-2 text-sm" /><Btn variant="primary" size="sm" className="w-full" onClick={() => setImagingRequested(true)}>Submit Imaging Request</Btn></div>}
          </div>
        </div>
      )}

      {/* Referral modal */}
      {showReferralModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(15,23,42,0.6)' }}
          onClick={() => setShowReferralModal(false)}
        >
          <div
            className="rounded-lg w-full"
            style={{ maxWidth: 440, background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <div className="font-semibold" style={{ color: '#0F172A' }}>Refer Patient</div>
                <div className="text-xs" style={{ color: '#64748B' }}>{patient.name} · {patient.modality} {patient.region}</div>
              </div>
              <button onClick={() => setShowReferralModal(false)} style={{ color: '#94A3B8', fontSize: 18 }}>×</button>
            </div>
            {referralSubmitted ? (
              <div className="p-6 text-center">
                <div className="text-2xl mb-2">✓</div>
                <div className="font-semibold mb-1" style={{ color: '#0F172A' }}>Referral submitted</div>
                <div className="text-xs mb-4" style={{ color: '#64748B' }}>Sent to admin referral queue for assignment.</div>
                <Btn variant="primary" size="sm" onClick={() => { setShowReferralModal(false); setReferralSubmitted(false) }}>Close</Btn>
              </div>
            ) : (
              <div className="p-5 space-y-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#475569' }}>Required Specialty</label>
                  <select className="w-full text-sm outline-none" style={{ padding: '7px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                    <option>Cardiology</option><option>Neurosurgery</option><option>Oncology</option>
                    <option>General Surgery</option><option>Pulmonology</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#475569' }}>Reason for Referral</label>
                  <textarea rows={3} placeholder="Clinical justification for referral..." className="w-full text-sm outline-none resize-none" style={{ padding: '7px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC' }} />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: '#475569' }}>Urgency</label>
                  <div className="flex gap-2">
                    {(['CRITICAL', 'WARNING', 'ROUTINE'] as const).map(u => (
                      <button key={u} type="button" onClick={() => setUrgency(u)} className="text-xs px-3 py-1.5 rounded-sm" style={{ border: `1px solid ${urgency === u ? '#1D4ED8' : '#E2E8F0'}`, background: urgency === u ? '#EFF6FF' : '#F8FAFC', color: urgency === u ? '#1D4ED8' : '#475569' }}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-xs p-2.5 rounded-sm" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8' }}>
                  Selected urgency: {urgency}
                  Original imaging study will be shared. No duplication of DICOM data.
                </div>
                <div className="flex gap-2 pt-1">
                  <Btn variant="secondary" size="sm" onClick={() => setShowReferralModal(false)}>Cancel</Btn>
                  <Btn variant="primary" size="sm" className="flex-1" onClick={() => setReferralSubmitted(true)}>Submit Referral →</Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, mono, wrap }: { label: string; value: string; mono?: boolean; wrap?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs shrink-0" style={{ color: '#94A3B8' }}>{label}</span>
      <span
        className={`text-xs text-right ${wrap ? '' : 'truncate'}`}
        style={{ color: '#0F172A', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', maxWidth: 170 }}
      >
        {value}
      </span>
    </div>
  )
}
