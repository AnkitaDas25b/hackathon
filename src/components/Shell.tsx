import type { ReactNode } from 'react'
import { useState } from 'react'
import { useApp } from '../context'
import type { View } from '../types'
import { NOTIFICATIONS } from '../data/mock'

interface NavItem { label: string; view: View; icon: string }

const ADMIN_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', view: 'admin-dashboard', icon: '▦' }],
  },
  {
    section: 'Patients',
    items: [
      { label: 'Patient Queue', view: 'admin-queue', icon: '⊞' },
      { label: 'Register Patient', view: 'admin-registration', icon: '+' },
    ],
  },
  {
    section: 'Assignments',
    items: [
      { label: 'Doctor Assignment', view: 'admin-assignment', icon: '→' },
      { label: 'Referral Queue', view: 'admin-referrals', icon: '⇄' },
    ],
  },
  {
    section: 'AI & Analytics',
    items: [{ label: 'Model Monitoring', view: 'admin-model-monitoring', icon: '◎' }],
  },
  {
    section: 'Account',
    items: [
      { label: 'Notifications', view: 'notifications', icon: '◉' },
      { label: 'Completed Cases', view: 'completed-cases', icon: '✓' },
    ],
  },
]

const RADIOLOGIST_NAV: { section: string; items: NavItem[] }[] = [
  { section: 'Imaging Work', items: [{ label: 'Radiology Queue', view: 'radiologist-dashboard', icon: '◉' }] },
  { section: 'Account', items: [{ label: 'Notifications', view: 'notifications', icon: '◉' }, { label: 'Completed Cases', view: 'completed-cases', icon: '✓' }] },
]

const DOCTOR_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'My Work',
    items: [
      { label: 'My Queue', view: 'doctor-dashboard', icon: '⊞' },
      { label: 'Active Case', view: 'doctor-case', icon: '▦' },
    ],
  },
  {
    section: 'Reviews',
    items: [
      { label: 'Patient Timeline', view: 'patient-timeline', icon: '◌' },
    ],
  },
  {
    section: 'Account',
    items: [
      { label: 'Notifications', view: 'notifications', icon: '◉' },
      { label: 'Completed Cases', view: 'completed-cases', icon: '✓' },
    ],
  },
]

export function Shell({ children }: { children: ReactNode }) {
  const { role, setRole, view, setView, readNotifications } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = role === 'doctor' ? DOCTOR_NAV : role === 'radiologist' ? RADIOLOGIST_NAV : ADMIN_NAV
  const roleLabel = role === 'doctor' ? 'Doctor View' : role === 'radiologist' ? 'Radiologist View' : 'Admin / Reception'
  const unread = NOTIFICATIONS.filter(n => !n.read && !readNotifications.includes(n.id) && (n.forRole === role || n.forRole === 'both')).length

  return (
    <div className="flex h-full" style={{ background: '#F1F5F9' }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col shrink-0"
        style={{ width: 232, background: '#0F172A', borderRight: '1px solid #1E293B' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: '#1E293B' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded text-white text-xs font-bold"
              style={{ width: 28, height: 28, background: '#1D4ED8', fontFamily: 'var(--font-mono)' }}
            >
              AI
            </div>
            <div>
              <div className="text-white font-semibold text-sm tracking-tight leading-none">MediTriage</div>
              <div className="text-xs mt-0.5" style={{ color: '#64748B', fontFamily: 'var(--font-mono)' }}>AI Imaging Platform</div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-4 py-3 border-b" style={{ borderColor: '#1E293B' }}>
          <div
            className="text-xs px-2.5 py-1 rounded-sm font-medium inline-flex items-center gap-1.5"
            style={{ background: '#1E293B', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 6, height: 6, background: role === 'doctor' ? '#16A34A' : '#1D4ED8' }}
            />
            {roleLabel}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {nav.map(({ section, items }) => (
            <div key={section} className="mb-4">
              <div
                className="text-xs font-semibold uppercase tracking-widest px-2 mb-1"
                style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: 9 }}
              >
                {section}
              </div>
              {items.map(item => {
                const active = view === item.view
                const isNotif = item.view === 'notifications'
                return (
                  <button
                    key={item.view}
                    onClick={() => setView(item.view)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-sm text-left transition-colors"
                    style={{
                      background: active ? '#1D4ED8' : 'transparent',
                      color: active ? '#FFFFFF' : '#94A3B8',
                      fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = '#1E293B' }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                  >
                    <span className="text-base leading-none" style={{ opacity: 0.7, width: 16, textAlign: 'center' }}>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {isNotif && unread > 0 && (
                      <span
                        className="text-xs rounded-full flex items-center justify-center"
                        style={{ background: '#DC2626', color: '#fff', width: 18, height: 18, fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }}
                      >
                        {unread}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: logout */}
        <div className="border-t p-3 space-y-1" style={{ borderColor: '#1E293B' }}>
          <button
            onClick={() => { setRole(null); setView('login') }}
            className="w-full text-xs px-2.5 py-2 rounded text-left transition-colors"
            style={{ color: '#64748B' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#64748B' }}
          >
            ← Sign out
          </button>
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className={`md:hidden fixed inset-0 z-40 ${menuOpen ? 'block' : 'hidden'}`}>
        <button aria-label="Close navigation" className="absolute inset-0 bg-slate-950/40" onClick={() => setMenuOpen(false)} />
        <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-[#0F172A] shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E293B] px-5 py-5"><span className="text-sm font-semibold text-white">MediTriage</span><button aria-label="Close menu" className="text-xl text-slate-400" onClick={() => setMenuOpen(false)}>×</button></div>
          <nav className="flex-1 overflow-y-auto px-3 py-3">{nav.map(({ section, items }) => <div key={section} className="mb-4"><div className="px-2 mb-1 text-[9px] font-semibold uppercase tracking-widest text-slate-600">{section}</div>{items.map(item => <button key={item.view} onClick={() => { setView(item.view); setMenuOpen(false) }} className={`flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-sm ${view === item.view ? 'bg-blue-700 text-white' : 'text-slate-400'}`}><span>{item.icon}</span><span>{item.label}</span></button>)}</div>)}</nav>
        </aside>
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header
          className="flex min-w-0 items-center justify-between px-3 sm:px-6 shrink-0"
          style={{ height: 52, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center gap-2">
            <button aria-label="Open navigation" className="mr-1 rounded p-1 text-lg text-slate-600 md:hidden" onClick={() => setMenuOpen(true)}>☰</button>
            <span className="text-sm font-medium" style={{ color: '#0F172A' }}>
              {getViewTitle(view)}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setView('notifications')}
              className="relative flex items-center justify-center rounded-full transition-colors"
              style={{ width: 32, height: 32 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F1F5F9' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
            >
              <span style={{ fontSize: 16 }}>🔔</span>
              {unread > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 rounded-full flex items-center justify-center"
                  style={{ width: 14, height: 14, background: '#DC2626', color: '#fff', fontSize: 8, fontFamily: 'var(--font-mono)', fontWeight: 700 }}
                >
                  {unread}
                </span>
              )}
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <button className="rounded border border-slate-200 px-2 py-1 text-[11px] text-slate-600" onClick={() => { setRole(null); setView('login') }}>Sign out</button>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full text-white text-xs font-semibold"
                style={{ width: 30, height: 30, background: role === 'doctor' ? '#16A34A' : '#1D4ED8' }}
              >
                {role === 'doctor' ? 'AR' : 'PM'}
              </div>
              <div className="text-right">
                <div className="text-xs font-medium" style={{ color: '#0F172A' }}>
                  {role === 'doctor' ? 'Dr. Arjun Rao' : role === 'radiologist' ? 'Dr. Nisha Kapoor' : 'Priya Mehta'}
                </div>
                <div className="text-xs" style={{ color: '#64748B' }}>
                  {role === 'doctor' ? 'Neurology' : role === 'radiologist' ? 'Radiology' : 'Admin / Reception'}
                </div>
              </div>
            </div>
            <div className="flex sm:hidden">
              <button className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600" onClick={() => { setRole(null); setView('login') }}>Logout</button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function getViewTitle(view: View): string {
  const titles: Record<View, string> = {
    'login': 'Login',
    'admin-dashboard': 'Overview Dashboard',
    'admin-queue': 'Patient Queue',
    'admin-registration': 'Register Patient',
    'admin-assignment': 'Doctor Assignment',
    'admin-referrals': 'Referral Queue',
    'admin-model-monitoring': 'AI Model Monitoring',
    'radiologist-dashboard': 'Radiology Queue',
    'doctor-dashboard': 'My Patient Queue',
    'doctor-case': 'Case Workspace',
    'patient-timeline': 'Patient Timeline',
    'notifications': 'Notifications',
    'completed-cases': 'Completed Cases',
  }
  return titles[view] ?? ''
}
