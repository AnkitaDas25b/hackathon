import type { Priority, ImagingStatus, AIStatus, DoctorAvailability, PatientStatus } from '../types'

export function PriorityBadge({ priority, size = 'sm' }: { priority: Priority; size?: 'xs' | 'sm' | 'md' }) {
  const cfg = {
    CRITICAL: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#DC2626', label: 'Critical', icon: '▲' },
    WARNING:  { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', dot: '#D97706', label: 'Warning', icon: '◆' },
    ROUTINE:  { bg: '#F0FDF4', text: '#14532D', border: '#BBF7D0', dot: '#16A34A', label: 'Routine', icon: '●' },
  }[priority]

  const pad = size === 'xs' ? '2px 7px' : size === 'md' ? '5px 12px' : '3px 9px'
  const fs = size === 'xs' ? 10 : size === 'md' ? 13 : 11

  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm font-semibold uppercase tracking-wide"
      style={{
        background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
        padding: pad, fontSize: fs, fontFamily: 'var(--font-mono)',
      }}
    >
      <span style={{ color: cfg.dot, fontSize: fs - 1 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}

export function StatusPill({ status }: { status: PatientStatus }) {
  const color = {
    'Registered': '#64748B', 'Test Ordered': '#64748B',
    'Imaging Pending': '#2563EB', 'Imaging Processing': '#2563EB',
    'AI Processing': '#7C3AED', 'Awaiting Assignment': '#D97706',
    'Assigned': '#2563EB', 'Under Review': '#0891B2',
    'Referral Requested': '#EA580C', 'Reassigned': '#0891B2',
    'Completed': '#16A34A',
  }[status] ?? '#64748B'

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium"
      style={{ color, fontFamily: 'var(--font-mono)' }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 6, height: 6, background: color }}
      />
      {status}
    </span>
  )
}

export function ImagingStatusBadge({ status }: { status: ImagingStatus }) {
  const cfg = {
    Uploading:  { bg: '#EFF6FF', text: '#1D4ED8', dot: '#93C5FD' },
    Processing: { bg: '#EFF6FF', text: '#1D4ED8', dot: '#60A5FA' },
    Ready:      { bg: '#F0FDF4', text: '#15803D', dot: '#4ADE80' },
    Failed:     { bg: '#FEF2F2', text: '#DC2626', dot: '#FCA5A5' },
  }[status]

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium rounded-sm px-2 py-0.5"
      style={{ background: cfg.bg, color: cfg.text, fontFamily: 'var(--font-mono)' }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 5, height: 5, background: cfg.dot }}
      />
      {status}
    </span>
  )
}

export function AIStatusBadge({ status }: { status: AIStatus }) {
  const cfg = {
    Pending:     { bg: '#F8FAFC', text: '#64748B', dot: '#CBD5E1' },
    Analyzing:   { bg: '#F5F3FF', text: '#7C3AED', dot: '#C4B5FD' },
    Complete:    { bg: '#F0FDF4', text: '#15803D', dot: '#4ADE80' },
    Failed:      { bg: '#FEF2F2', text: '#DC2626', dot: '#FCA5A5' },
    'Needs Review': { bg: '#FFFBEB', text: '#D97706', dot: '#FCD34D' },
  }[status] ?? { bg: '#F8FAFC', text: '#64748B', dot: '#CBD5E1' }

  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium rounded-sm px-2 py-0.5"
      style={{ background: cfg.bg, color: cfg.text, fontFamily: 'var(--font-mono)' }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 5, height: 5, background: cfg.dot }}
      />
      {status}
    </span>
  )
}

export function AvailabilityDot({ status }: { status: DoctorAvailability }) {
  const color = {
    Available:    '#16A34A',
    Busy:         '#D97706',
    Away:         '#64748B',
    'In Procedure': '#DC2626',
  }[status] ?? '#64748B'

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <span className="inline-block rounded-full" style={{ width: 7, height: 7, background: color }} />
      {status}
    </span>
  )
}

export function Btn({
  children, onClick, variant = 'primary', size = 'sm', disabled, className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md'
  disabled?: boolean
  className?: string
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none'

  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: '#1D4ED8', color: '#FFFFFF', border: '1px solid #1D4ED8' },
    secondary: { background: '#F1F5F9', color: '#0F172A', border: '1px solid #E2E8F0' },
    danger:    { background: '#DC2626', color: '#FFFFFF', border: '1px solid #DC2626' },
    ghost:     { background: 'transparent', color: '#64748B', border: '1px solid transparent' },
    outline:   { background: 'transparent', color: '#1D4ED8', border: '1px solid #1D4ED8' },
  }

  const pads = { xs: '4px 10px', sm: '6px 14px', md: '8px 18px' }
  const fonts = { xs: 11, sm: 12, md: 14 }

  return (
    <button
      className={`${base} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles[variant], padding: pads[size], fontSize: fonts[size] }}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-md ${className}`}
      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', ...style }}
    >
      {children}
    </div>
  )
}

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold" style={{ color: '#0F172A' }}>
      {children}
    </h2>
  )
}

export function Divider() {
  return <div className="my-4" style={{ borderTop: '1px solid #E2E8F0' }} />
}
