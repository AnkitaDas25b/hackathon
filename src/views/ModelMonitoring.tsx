import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MODEL_TREND_DATA, MODEL_MODALITY_DATA } from '../data/mock'
import { Card } from '../components/ui'

const METRICS = [
  { label: 'Total Scans Analyzed', value: '2,049', sub: 'All time', color: '#1D4ED8' },
  { label: 'Doctor Agreement Rate', value: '91.2%', sub: '+2.1% vs last month', color: '#16A34A', trend: 'up' },
  { label: 'Disagreement Rate', value: '8.8%', sub: '-2.1% vs last month', color: '#D97706', trend: 'down' },
  { label: 'False Positive Rate', value: '4.3%', sub: 'Model v1.4', color: '#DC2626' },
  { label: 'False Negative Rate', value: '3.1%', sub: 'Model v1.4', color: '#DC2626' },
  { label: 'Sensitivity', value: '96.9%', sub: 'True positive rate', color: '#0891B2' },
  { label: 'Specificity', value: '90.4%', sub: 'True negative rate', color: '#0891B2' },
  { label: 'Precision', value: '92.1%', sub: 'Positive predictive value', color: '#7C3AED' },
]

export function ModelMonitoring() {
  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>AI Model Monitoring</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>Performance metrics for AI imaging triage — Model v1.4</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="text-xs px-3 py-1.5 rounded-sm font-medium"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', fontFamily: 'var(--font-mono)' }}
          >
            ● Active · v1.4
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-sm"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', fontFamily: 'var(--font-mono)' }}
          >
            Last updated: Aug 12, 2026
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="text-xs px-4 py-3 rounded-md mb-5 flex items-start gap-2"
        style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E' }}
      >
        <span>◆</span>
        <div>
          <strong>Model governance:</strong> This dashboard reflects aggregate feedback from clinical review. AI model updates undergo offline validation and controlled deployment. Feedback does not trigger automatic model updates.
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {METRICS.map(m => (
          <Card key={m.label} style={{ padding: 16 }}>
            <div className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>{m.label}</div>
            <div className="text-2xl font-bold tracking-tight mb-1" style={{ color: m.color, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
            <div className="text-xs flex items-center gap-1" style={{ color: '#94A3B8' }}>
              {m.trend === 'up' && <span style={{ color: '#16A34A' }}>↑</span>}
              {m.trend === 'down' && <span style={{ color: '#DC2626' }}>↓</span>}
              {m.sub}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Performance trend */}
        <Card style={{ padding: 20 }}>
          <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Performance Trend</div>
          <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>Monthly agreement rate, sensitivity & specificity</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MODEL_TREND_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-mono)' }} />
              <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-mono)' }} />
              <Tooltip
                contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)' }}
                formatter={(v) => [`${v}%`]}
              />
              <Legend iconType="line" wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
              <Line type="monotone" dataKey="agreement" name="Agreement" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="sensitivity" name="Sensitivity" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="specificity" name="Specificity" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Cases per month */}
        <Card style={{ padding: 20 }}>
          <div className="text-sm font-semibold mb-1" style={{ color: '#0F172A' }}>Cases Analyzed</div>
          <div className="text-xs mb-4" style={{ color: '#94A3B8' }}>Monthly case volume</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MODEL_TREND_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-mono)' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-mono)' }} />
              <Tooltip
                contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)' }}
              />
              <Bar dataKey="cases" name="Cases" fill="#1D4ED8" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance by modality */}
      <Card style={{ marginBottom: 20 }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #E2E8F0' }}>
          <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>Performance by Imaging Modality</div>
          <div className="text-xs" style={{ color: '#94A3B8' }}>Agreement rate, sensitivity, and specificity per modality</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Modality', 'Cases', 'Agreement Rate', 'Sensitivity', 'Specificity', 'Trend'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODEL_MODALITY_DATA.map((row, i) => (
              <tr key={row.modality} style={{ borderTop: '1px solid #F1F5F9' }}>
                <td className="px-5 py-3 text-sm font-medium" style={{ color: '#0F172A' }}>{row.modality}</td>
                <td className="px-5 py-3 text-xs" style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}>{row.cases.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <PercentBar value={row.agreement} color="#1D4ED8" />
                </td>
                <td className="px-5 py-3">
                  <PercentBar value={row.sensitivity} color="#16A34A" />
                </td>
                <td className="px-5 py-3">
                  <PercentBar value={row.specificity} color="#D97706" />
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs" style={{ color: '#16A34A' }}>↑ Improving</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Feedback pipeline */}
      <Card style={{ padding: 20 }}>
        <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Feedback & Retraining Pipeline</div>
        <div className="flex items-center gap-0 overflow-x-auto">
          {[
            { label: 'Doctor Feedback', sub: 'Agree / Disagree', color: '#1D4ED8' },
            { label: 'Feedback Dataset', sub: '244 records pending', color: '#7C3AED' },
            { label: 'Manual Review & Curation', sub: 'QA team', color: '#D97706' },
            { label: 'Offline Retraining', sub: 'Controlled environment', color: '#EA580C' },
            { label: 'Model Validation', sub: 'Held-out test set', color: '#0891B2' },
            { label: 'Controlled Deployment', sub: 'v1.5 (pending)', color: '#16A34A' },
          ].map((stage, i, arr) => (
            <div key={stage.label} className="flex items-center shrink-0">
              <div className="text-center" style={{ minWidth: 100 }}>
                <div
                  className="mx-auto flex items-center justify-center rounded text-xs font-bold mb-1"
                  style={{ width: 28, height: 28, background: stage.color + '18', color: stage.color, border: `1px solid ${stage.color}40` }}
                >
                  {i + 1}
                </div>
                <div className="text-xs font-medium" style={{ color: '#0F172A' }}>{stage.label}</div>
                <div className="text-xs" style={{ color: '#94A3B8' }}>{stage.sub}</div>
              </div>
              {i < arr.length - 1 && (
                <div className="mx-2 shrink-0 text-xs" style={{ color: '#CBD5E1' }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs p-3 rounded-sm" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B' }}>
          <strong style={{ color: '#0F172A' }}>No automatic online learning.</strong> Feedback is collected and reviewed manually. Model updates are validated and deployed in controlled releases.
        </div>
      </Card>
    </div>
  )
}

function PercentBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full overflow-hidden" style={{ width: 80, height: 5, background: '#E2E8F0' }}>
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color: '#475569', fontFamily: 'var(--font-mono)' }}>{value}%</span>
    </div>
  )
}
