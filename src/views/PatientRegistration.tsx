import { useState } from 'react'
import { useApp } from '../context'
import { Btn, Card } from '../components/ui'

type Step = 1 | 2 | 3 | 4

const STEPS = [
  { n: 1, label: 'Patient Info' },
  { n: 2, label: 'Test Order' },
  { n: 3, label: 'Imaging Upload' },
  { n: 4, label: 'Confirmation' },
]

export function PatientRegistration() {
  const { setView } = useApp()
  const [step, setStep] = useState<Step>(1)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'processing' | 'stored' | 'ai' | 'ready'>('idle')

  const simulateUpload = () => {
    setUploadState('uploading')
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setUploadState('processing')
          setTimeout(() => {
            setUploadState('stored')
            setTimeout(() => {
              setUploadState('ai')
              setTimeout(() => setUploadState('ready'), 2000)
            }, 1500)
          }, 1500)
          return 100
        }
        return p + 8
      })
    }, 120)
  }

  const uploadStages = [
    { key: 'uploading', label: 'Uploading DICOM', done: ['processing','stored','ai','ready'].includes(uploadState) || uploadState === 'uploading' && uploadProgress === 100 },
    { key: 'processing', label: 'Processing Study', done: ['stored','ai','ready'].includes(uploadState) },
    { key: 'stored', label: 'Stored in AWS HealthImaging', done: ['ai','ready'].includes(uploadState) },
    { key: 'ai', label: 'AI Analysis', done: uploadState === 'ready' },
    { key: 'ready', label: 'Ready', done: uploadState === 'ready' },
  ]

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('admin-queue')} className="text-sm" style={{ color: '#64748B' }}>← Back</button>
        <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Register Patient</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => {
          const done = step > s.n
          const active = step === s.n
          return (
            <div key={s.n} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    width: 28, height: 28,
                    background: done ? '#1D4ED8' : active ? '#1D4ED8' : '#E2E8F0',
                    color: done || active ? '#fff' : '#94A3B8',
                  }}
                >
                  {done ? '✓' : s.n}
                </div>
                <span className="text-sm" style={{ color: active ? '#0F172A' : done ? '#64748B' : '#94A3B8', fontWeight: active ? 600 : 400 }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-4" style={{ width: 40, height: 2, background: done ? '#1D4ED8' : '#E2E8F0' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Patient Info */}
      {step === 1 && (
        <Card style={{ padding: 24 }}>
          <h2 className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>Patient Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Patient ID" placeholder="Auto-generated or scan barcode" monospace />
            <Field label="Patient Type" type="select" options={['New Patient', 'Existing Patient']} />
            <Field label="Full Name" placeholder="e.g. Ravi Kumar" span2={false} />
            <Field label="Date of Birth" type="date" />
            <Field label="Age" placeholder="45" />
            <Field label="Sex" type="select" options={['Male', 'Female', 'Other']} />
            <Field label="Contact Number" placeholder="+91 98765 43210" />
            <Field label="Emergency Contact" placeholder="Name — Relationship — Number" />
            <Field label="Current Complaint" placeholder="Primary reason for visit" span2 />
            <Field label="Relevant Symptoms" placeholder="Describe symptoms" type="textarea" span2 />
            <Field label="Referring Physician" placeholder="Name — Specialty (if applicable)" span2 />
          </div>
          <div className="flex justify-end mt-6">
            <Btn variant="primary" size="sm" onClick={() => setStep(2)}>Continue to Test Order →</Btn>
          </div>
        </Card>
      )}

      {/* Step 2: Test Order */}
      {step === 2 && (
        <Card style={{ padding: 24 }}>
          <h2 className="text-sm font-semibold mb-5" style={{ color: '#0F172A' }}>Create Imaging Test Order</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Imaging Modality" type="select" options={['CT', 'MRI', 'X-Ray', 'PET', 'Ultrasound']} />
            <Field label="Body Region" type="select" options={['Brain', 'Chest', 'Abdomen & Pelvis', 'Spine (Cervical)', 'Spine (Lumbar)', 'Knee', 'Hip', 'Shoulder', 'Full Body']} />
            <Field label="Reason for Scan" placeholder="Clinical indication" span2 />
            <Field label="Clinical Notes" placeholder="Additional context for radiologist" type="textarea" span2 />
            <Field label="Requested Specialty" type="select" options={['Neurology', 'Pulmonology', 'Cardiology', 'Orthopedics', 'General Surgery', 'General Medicine', 'Oncology', 'Radiology']} />
            <Field label="Clinical Urgency" type="select" options={['Routine', 'Urgent', 'Critical']} />
            <Field label="Contrast Required" type="select" options={['No', 'Yes — with IV contrast', 'Yes — with oral contrast']} />
            <Field label="Known Allergies / Contraindications" placeholder="e.g. contrast allergy" />
          </div>
          <div className="flex justify-between mt-6">
            <Btn variant="secondary" size="sm" onClick={() => setStep(1)}>← Back</Btn>
            <Btn variant="primary" size="sm" onClick={() => setStep(3)}>Continue to Imaging →</Btn>
          </div>
        </Card>
      )}

      {/* Step 3: Imaging Upload */}
      {step === 3 && (
        <Card style={{ padding: 24 }}>
          <h2 className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Imaging Upload / Study Association</h2>
          <p className="text-xs mb-5" style={{ color: '#64748B' }}>
            Imaging files are handled by the radiologist after this test order is submitted.
          </p>
          <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <strong>Radiologist handoff:</strong> The patient and ordered test will be added to the Radiology Queue. Admins cannot upload or associate report files from this workflow.
          </div>

          {false && uploadState === 'idle' && (
            <div className="space-y-4">
              {/* Upload zone */}
              <div
                className="rounded-md border-2 border-dashed p-8 text-center cursor-pointer transition-colors"
                style={{ borderColor: '#CBD5E1' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#1D4ED8'; (e.currentTarget as HTMLDivElement).style.background = '#EFF6FF' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#CBD5E1'; (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                onClick={simulateUpload}
              >
                <div className="text-3xl mb-2">↑</div>
                <div className="text-sm font-medium mb-1" style={{ color: '#0F172A' }}>Upload DICOM Study</div>
                <div className="text-xs" style={{ color: '#64748B' }}>Drag and drop .dcm files or click to browse</div>
                <div className="text-xs mt-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>Supports DICOM 3.0 · CT · MRI · X-Ray · Series sets</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1" style={{ height: 1, background: '#E2E8F0' }} />
                <span className="text-xs" style={{ color: '#94A3B8' }}>or</span>
                <div className="flex-1" style={{ height: 1, background: '#E2E8F0' }} />
              </div>

              {/* Associate existing */}
              <div className="rounded-md p-4" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#475569' }}>Associate Existing Study from PACS / AWS HealthImaging</div>
                <div className="flex gap-2">
                  <input
                    placeholder="Enter AWS HealthImaging Study ID"
                    className="flex-1 text-sm outline-none"
                    style={{ padding: '7px 12px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#fff', fontFamily: 'var(--font-mono)', fontSize: 12 }}
                  />
                  <Btn variant="outline" size="sm">Associate →</Btn>
                </div>
              </div>
            </div>
          )}

          {/* Upload progress */}
          {uploadState !== 'idle' && uploadState !== 'ready' && (
            <div className="space-y-4">
              {uploadState === 'uploading' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: '#475569' }}>Uploading DICOM study...</span>
                    <span className="text-xs" style={{ color: '#1D4ED8', fontFamily: 'var(--font-mono)' }}>{uploadProgress}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 6, background: '#E2E8F0' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${uploadProgress}%`, background: '#1D4ED8' }} />
                  </div>
                </div>
              )}

              <div className="space-y-2 mt-4">
                {uploadStages.map((stage, i) => {
                  const isCurrent = stage.key === uploadState
                  const isPending = !stage.done && !isCurrent
                  return (
                    <div key={stage.key} className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full text-xs shrink-0"
                        style={{
                          width: 22, height: 22,
                          background: stage.done ? '#F0FDF4' : isCurrent ? '#EFF6FF' : '#F8FAFC',
                          color: stage.done ? '#16A34A' : isCurrent ? '#1D4ED8' : '#CBD5E1',
                          border: `1px solid ${stage.done ? '#BBF7D0' : isCurrent ? '#BFDBFE' : '#E2E8F0'}`,
                        }}
                      >
                        {stage.done ? '✓' : isCurrent ? '·' : String(i + 1)}
                      </div>
                      <span className="text-xs" style={{ color: stage.done ? '#16A34A' : isCurrent ? '#1D4ED8' : '#CBD5E1', fontWeight: isCurrent ? 600 : 400 }}>
                        {stage.label}
                        {isCurrent && <span className="ml-1 animate-pulse">...</span>}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ready state */}
          {uploadState === 'ready' && (
            <div className="rounded-md p-5 text-center" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <div className="text-2xl mb-2">✓</div>
              <div className="font-semibold text-sm mb-1" style={{ color: '#14532D' }}>Imaging Study Ready</div>
              <div className="text-xs" style={{ color: '#16A34A' }}>DICOM study stored in AWS HealthImaging · AI analysis complete</div>
              <div className="text-xs mt-2" style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}>STU-20240812-NEW · v1.4 analysis · Priority: Processing</div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Btn variant="secondary" size="sm" onClick={() => setStep(2)}>← Back</Btn>
            <Btn variant="primary" size="sm" onClick={() => setStep(4)} disabled={uploadState !== 'ready' && uploadState !== 'idle'}>
              Continue →
            </Btn>
          </div>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Card style={{ padding: 24 }}>
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div
                className="mx-auto flex items-center justify-center rounded-full mb-4"
                style={{ width: 56, height: 56, background: '#F0FDF4', border: '2px solid #BBF7D0' }}
              >
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="text-base font-semibold mb-1" style={{ color: '#0F172A' }}>Patient Registered Successfully</h2>
              <p className="text-sm mb-4" style={{ color: '#64748B' }}>
                AI analysis is running. The patient will appear in the queue once priority is assigned.
              </p>
              <div
                className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-md mb-6"
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontFamily: 'var(--font-mono)', color: '#475569' }}
              >
                Patient ID: P-20240812-012 · Study: STU-20240812-NEW
              </div>
              <div className="flex gap-3 justify-center">
                <Btn variant="primary" size="sm" onClick={() => setView('admin-queue')}>Go to Patient Queue</Btn>
                <Btn variant="secondary" size="sm" onClick={() => setStep(1)}>Register Another</Btn>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

function Field({
  label, placeholder, type = 'text', options, span2, monospace,
}: {
  label: string; placeholder?: string; type?: 'text' | 'select' | 'date' | 'textarea'; options?: string[]; span2?: boolean; monospace?: boolean
}) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium mb-1" style={{ color: '#475569' }}>{label}</label>
      {type === 'select' ? (
        <select
          className="w-full text-sm outline-none"
          style={{ padding: '7px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', cursor: 'pointer' }}
        >
          <option value="">Select...</option>
          {options?.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          className="w-full text-sm outline-none resize-none"
          style={{ padding: '7px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontFamily: monospace ? 'var(--font-mono)' : 'var(--font-sans)' }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full text-sm outline-none"
          style={{ padding: '7px 10px', borderRadius: 4, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontFamily: monospace ? 'var(--font-mono)' : 'var(--font-sans)' }}
        />
      )}
    </div>
  )
}
