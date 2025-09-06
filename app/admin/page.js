'use client'

import { useEffect, useMemo, useState } from 'react'

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchRSVPs() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/rsvps', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setRsvps(Array.isArray(data?.rsvps) ? data.rsvps : [])
    } catch (e) {
      setError(e?.message || 'Failed to fetch RSVPs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRSVPs()
  }, [])

  // Helpers to interpret “yes/no” regardless of shape
  const isYes = (r) => {
    if (typeof r?.attending === 'boolean') return r.attending
    const v = String(r?.response ?? r?.status ?? '').toLowerCase().trim()
    return ['ja', 'yes', 'y', 'true', '1'].includes(v)
  }
  const isNo = (r) => {
    if (typeof r?.attending === 'boolean') return !r.attending
    const v = String(r?.response ?? r?.status ?? '').toLowerCase().trim()
    return ['nee', 'no', 'n', 'false', '0'].includes(v)
  }

  const stats = useMemo(() => {
    const total = rsvps.length
    let yes = 0, no = 0
    for (const r of rsvps) {
      if (isYes(r)) yes++
      else if (isNo(r)) no++
    }
    return { total, yes, no }
  }, [rsvps])

  return (
    <main className="admin-wrap">
      <header className="admin-header">
        <h1>RSVP Admin</h1>
        <div className="header-actions">
          <button onClick={fetchRSVPs}>Reload</button>
        </div>
      </header>

      <section className="stats">
        <div className="stat">
          <div className="stat-label">Total</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat yes">
          <div className="stat-label">Yes</div>
          <div className="stat-value">{stats.yes}</div>
        </div>
        <div className="stat no">
          <div className="stat-label">No</div>
          <div className="stat-value">{stats.no}</div>
        </div>
      </section>

      {loading && <p className="muted">Loading…</p>}
      {error && <p className="error">Error: {error}</p>}

      {!loading && !error && (
        <ul className="rsvp-list">
          {rsvps.map((r, idx) => {
            const yes = isYes(r)
            const no = isNo(r)
            return (
              <li key={r.id ?? idx} className={`rsvp ${yes ? 'yes' : no ? 'no' : ''}`}>
                <div className="rsvp-head">
                  <strong className="name">{r.name || r.fullname || r.firstName || '—'}</strong>
                  <span className="badge">{yes ? 'Ja' : no ? 'Nee' : (r.response ?? r.status ?? '—')}</span>
                </div>
                <div className="rsvp-meta">
                  {r.email && <span>{r.email}</span>}
                  {r.phone && <span>{r.phone}</span>}
                  {r.timestamp && (
                    <span title={r.timestamp}>
                      {new Date(r.timestamp).toLocaleString?.() || r.timestamp}
                    </span>
                  )}
                </div>
                {r.message && <p className="note">{r.message}</p>}
                {/* Fallback full JSON for debugging */}
                {!r.name && <pre className="raw">{JSON.stringify(r, null, 2)}</pre>}
              </li>
            )
          })}
          {rsvps.length === 0 && <li className="muted">No RSVPs yet.</li>}
        </ul>
      )}

      {/* IMPORTANT: keep this as a static template literal (no function calls) */}
      <style jsx global>{`
        :root {
          --bg: #0f172a;
          --card: #111827;
          --muted: #94a3b8;
          --text: #e5e7eb;
          --yes: #22c55e;
          --no: #ef4444;
          --ring: rgba(255, 255, 255, 0.08);
        }

        .admin-wrap {
          min-height: 100svh;
          background: radial-gradient(1200px 800px at 10% -20%, #1f2937 0%, transparent 50%),
                      radial-gradient(1200px 800px at 110% 120%, #0b3b2a 0%, transparent 50%),
                      var(--bg);
          color: var(--text);
          padding: 32px 16px 60px;
          max-width: 960px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .header-actions button {
          background: transparent;
          border: 1px solid var(--ring);
          color: var(--text);
          border-radius: 10px;
          padding: 8px 14px;
          cursor: pointer;
        }
        .header-actions button:hover { border-color: rgba(255,255,255,0.18); }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat {
          background: var(--card);
          border: 1px solid var(--ring);
          border-radius: 14px;
          padding: 14px;
        }
        .stat-label { font-size: 0.8rem; color: var(--muted); }
        .stat-value { font-size: 1.4rem; font-weight: 700; }
        .stat.yes .stat-value { color: var(--yes); }
        .stat.no .stat-value { color: var(--no); }

        .muted { color: var(--muted); }
        .error { color: #fecaca; }

        .rsvp-list {
          display: grid;
          gap: 12px;
          margin-top: 12px;
        }

        .rsvp {
          list-style: none;
          background: var(--card);
          border: 1px solid var(--ring);
          border-radius: 16px;
          padding: 14px;
        }
        .rsvp.yes { box-shadow: 0 0 0 1px rgba(34,197,94,.15) inset; }
        .rsvp.no  { box-shadow: 0 0 0 1px rgba(239,68,
