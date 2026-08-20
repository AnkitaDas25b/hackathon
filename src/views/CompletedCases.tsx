import { COMPLETED_CASES } from '../data/mock'
import { useApp } from '../context'
import { PriorityBadge, Card } from '../components/ui'

export function CompletedCases() {
  const { role } = useApp()
  const visibleCases = role === 'doctor' ? COMPLETED_CASES.filter(c => c.assignedDoctor === 'Dr. Arjun Rao') : COMPLETED_CASES
  const total = visibleCases.length
  const agreed = visibleCases.filter(c => c.aiAgreement === 'agreed').length
  const disagreed = visibleCases.filter(c => c.aiAgreement === 'disagreed').length

  return (
    <div className="min-w-0 p-3 sm:p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Completed Cases</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>{total} cases — recent history</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-3">
        <Card style={{ padding: 16, textAlign: 'center' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>{total}</div>
          <div className="text-xs" style={{ color: '#64748B' }}>Total completed</div>
        </Card>
        <Card style={{ padding: 16, textAlign: 'center' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#16A34A', fontFamily: 'var(--font-mono)' }}>
            {Math.round((agreed / total) * 100)}%
          </div>
          <div className="text-xs" style={{ color: '#64748B' }}>AI agreement rate</div>
        </Card>
        <Card style={{ padding: 16, textAlign: 'center' }}>
          <div className="text-2xl font-bold mb-1" style={{ color: '#D97706', fontFamily: 'var(--font-mono)' }}>{disagreed}</div>
          <div className="text-xs" style={{ color: '#64748B' }}>AI corrections submitted</div>
        </Card>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div className="overflow-x-auto"><table className="min-w-[980px] w-full text-sm">
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #F1F5F9' }}>
              {['Patient', 'Imaging', 'Priority', 'Diagnosis', 'Doctor', 'Duration', 'AI Agreement'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleCases.map((c, i) => (
              <tr
                key={c.id}
                className="transition-colors"
                style={{ borderBottom: i < COMPLETED_CASES.length - 1 ? '1px solid #F8FAFC' : 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F8FAFC' }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
              >
                <td className="px-5 py-3.5">
                  <div className="font-medium" style={{ color: '#0F172A' }}>{c.patientName}</div>
                  <div className="text-xs" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{c.age}{c.sex}</div>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: '#475569' }}>
                  {c.modality} · {c.region}
                </td>
                <td className="px-5 py-3.5">
                  <PriorityBadge priority={c.priority} size="xs" />
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-xs max-w-48 leading-relaxed" style={{ color: '#475569' }}>{c.diagnosis}</div>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: '#475569' }}>{c.assignedDoctor}</td>
                <td className="px-5 py-3.5 text-xs" style={{ color: '#0F172A', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.duration || '—'}</td>
                <td className="px-5 py-3.5">
                  {c.aiAgreement === 'agreed' ? (
                    <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: '#F0FDF4', color: '#15803D', fontFamily: 'var(--font-mono)' }}>✓ Agreed</span>
                  ) : c.aiAgreement === 'disagreed' ? (
                    <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: '#FEF2F2', color: '#DC2626', fontFamily: 'var(--font-mono)' }}>✗ Corrected</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-sm" style={{ background: '#F8FAFC', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>— Not reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </Card>
    </div>
  )
}
