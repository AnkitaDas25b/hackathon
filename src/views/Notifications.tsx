import { useState } from 'react'
import { useApp } from '../context'
import { NOTIFICATIONS } from '../data/mock'
import { Card } from '../components/ui'

export function NotificationsView() {
  const { role } = useApp()
  const [readAll, setReadAll] = useState(false)

  const relevant = NOTIFICATIONS.filter(n => n.forRole === role || n.forRole === 'both')
  const unread = relevant.filter(n => !n.read && !readAll)

  const typeConfig = {
    critical: { bg: '#FEF2F2', border: '#FECACA', iconBg: '#FEE2E2', icon: '▲', color: '#991B1B', dot: '#DC2626' },
    warning:  { bg: '#FFFBEB', border: '#FDE68A', iconBg: '#FEF3C7', icon: '◆', color: '#92400E', dot: '#D97706' },
    info:     { bg: '#EFF6FF', border: '#BFDBFE', iconBg: '#DBEAFE', icon: 'ℹ', color: '#1E40AF', dot: '#2563EB' },
    success:  { bg: '#F0FDF4', border: '#BBF7D0', iconBg: '#DCFCE7', icon: '✓', color: '#14532D', dot: '#16A34A' },
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: '#0F172A' }}>Notifications</h1>
          <p className="text-sm" style={{ color: '#64748B' }}>
            {unread.length > 0 ? `${unread.length} unread` : 'All caught up'}
          </p>
        </div>
        {unread.length > 0 && (
          <button
            onClick={() => setReadAll(true)}
            className="text-xs font-medium"
            style={{ color: '#1D4ED8' }}
          >
            Mark all read
          </button>
        )}
      </div>

      {unread.length > 0 && (
        <div className="mb-2">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
            Unread
          </div>
          <div className="space-y-2">
            {unread.map(n => {
              const cfg = typeConfig[n.type]
              return (
                <div
                  key={n.id}
                  className="flex gap-3 rounded-md p-4"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  <div
                    className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
                    style={{ width: 28, height: 28, background: cfg.iconBg, color: cfg.color, fontSize: 12 }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold" style={{ color: cfg.color }}>{n.title}</span>
                      <span
                        className="inline-block rounded-full"
                        style={{ width: 6, height: 6, background: cfg.dot }}
                      />
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{n.message}</p>
                    <span className="text-xs mt-1 block" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>{n.timestamp}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
          Earlier
        </div>
        <Card>
          {relevant.filter(n => n.read || readAll).map((n, i, arr) => {
            const cfg = typeConfig[n.type]
            return (
              <div
                key={n.id}
                className="flex gap-3 px-4 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid #F8FAFC' : 'none' }}
              >
                <div
                  className="flex items-center justify-center rounded-full shrink-0 mt-0.5"
                  style={{ width: 26, height: 26, background: '#F8FAFC', color: cfg.dot, fontSize: 11 }}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: '#475569' }}>{n.title}</div>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{n.message}</p>
                  <span className="text-xs mt-0.5 block" style={{ color: '#CBD5E1', fontFamily: 'var(--font-mono)' }}>{n.timestamp}</span>
                </div>
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}
