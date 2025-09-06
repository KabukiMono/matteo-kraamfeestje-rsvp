'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchRSVPs() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/rsvps', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRsvps(Array.isArray(data?.rsvps) ? data.rsvps : []);
    } catch (e) {
      setError(e?.message || 'Failed to fetch RSVPs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRSVPs(); }, []);

  const isYes = (r) => {
    if (typeof r?.attending === 'boolean') return r.attending;
    const v = String(r?.response ?? r?.status ?? '').toLowerCase().trim();
    return ['ja', 'yes', 'y', 'true', '1'].includes(v);
  };
  const isNo = (r) => {
    if (typeof r?.attending === 'boolean') return !r.attending;
    const v = String(r?.response ?? r?.status ?? '').toLowerCase().trim();
    return ['nee', 'no', 'n', 'false', '0'].includes(v);
  };

  const stats = useMemo(() => {
    const total = rsvps.length;
    let yes = 0, no = 0;
    for (const r of rsvps) { if (isYes(r)) yes++; else if (isNo(r)) no++; }
    return { total, yes, no };
  }, [rsvps]);

  const fmtTime = (r) => {
    const t = r?.timestamp ?? r?.createdAt ?? r?.created_at ?? r?.date;
    try { return t ? new Date(t).toLocaleString('nl-NL') : ''; } catch { return String(t ?? ''); }
  };

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>RSVP Admin</h1>
        <button className={styles.button} onClick={fetchRSVPs} disabled={loading}>
          {loading ? 'Loading…' : 'Reload'}
        </button>
      </header>

      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total</div>
          <div className={styles.statValue}>{stats.total}</div>
        </div>
        <div className={`${styles.statCard} ${styles.yes}`}>
          <div className={styles.statLabel}>Yes</div>
          <div className={styles.statValue}>{stats.yes}</div>
        </div>
        <div className={`${styles.statCard} ${styles.no}`}>
          <div className={styles.statLabel}>No</div>
          <div className={styles.statValue}>{stats.no}</div>
        </div>
      </section>

      {error && <p className={styles.error}>Error: {error}</p>}
      {!error && rsvps.length === 0 && !loading && <p className={styles.muted}>No RSVPs yet.</p>}

      {!loading && !error && (
        <ul className={styles.list}>
          {rsvps.map((r, idx) => {
            const yes = isYes(r), no = isNo(r);
            const name = r.name ?? r.fullname ?? r.firstName ?? r.first_name ?? r.email ?? '—';
            const badge = yes ? 'Ja' : no ? 'Nee' : String(r.response ?? r.status ?? '—');
            return (
              <li key={r.id ?? idx} className={`${styles.item} ${yes ? styles.itemYes : no ? styles.itemNo : ''}`}>
                <div className={styles.itemHead}>
                  <strong className={styles.name}>{name}</strong>
                  <span className={styles.badge}>{badge}</span>
                </div>
                <div className={styles.meta}>
                  {r.email && <span>{r.email}</span>}
                  {r.phone && <span>{r.phone}</span>}
                  {fmtTime(r) && <span>{fmtTime(r)}</span>}
                </div>
                {r.message && <p className={styles.note}>{r.message}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
