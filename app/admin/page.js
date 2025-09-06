'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({ total: 0, yes: 0, no: 0 })

  useEffect(() => {
    fetchRSVPs()
  }, [])

  const fetchRSVPs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/rsvps')
      if (!response.ok) throw new Error('Failed to fetch RSVPs')
      
      const data = await response.json()
      setRsvps(data.rsvps || [])
      
      // Calculate stats
      const total = data.rsvps.length
      const yes = data.rsvps.filter(r => r.response === 'Ja').length
      const no = data.rsvps.filter(r => r.response === 'Nee').length
      setStats({ total, yes, no })
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>RSVPs laden...</p>
        </div>
        <style jsx global>{getStyles()}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-card">
          <h2>❌ Fout</h2>
          <p>{error}</p>
          <button onClick={fetchRSVPs} className="retry-btn">
            🔄 Opnieuw proberen
          </button>
        </div>
        <style jsx global>{getStyles()}</style>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <h1>🍼 Matteo's Kraamfeestje Dashboard</h1>
        <p className="subtitle">RSVP Overzicht - Zaterdag 20.09.2025</p>
        <button onClick={fetchRSVPs} className="refresh-btn">
          🔄 Vernieuwen
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Responses</p>
          </div>
        </div>
        
        <div className="stat-card yes">
          <div className="stat-icon">🎉</div>
          <div className="stat-info">
            <h3>{stats.yes}</h3>
            <p>Komen wel</p>
          </div>
        </div>
        
        <div className="stat-card no">
          <div className="stat-icon">😔</div>
          <div className="stat-info">
            <h3>{stats.no}</h3>
            <p>Komen niet</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill yes-fill" 
              style={{ width: `${(stats.yes / stats.total) * 100}%` }}
            ></div>
            <div 
              className="progress-fill no-fill" 
              style={{ width: `${(stats.no / stats.total) * 100}%`, left: `${(stats.yes / stats.total) * 100}%` }}
            ></div>
          </div>
          <div className="progress-labels">
            <span className="yes-label">{stats.yes > 0 && `${Math.round((stats.yes / stats.total) * 100)}% Ja`}</span>
            <span className="no-label">{stats.no > 0 && `${Math.round((stats.no / stats.total) * 100)}% Nee`}</span>
          </div>
        </div>
      )}

      {/* RSVP List */}
      <div className="rsvp-section">
        <h2>📋 Alle Responses ({stats.total})</h2>
        
        {rsvps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Nog geen responses</h3>
            <p>Zodra mensen hun RSVP indienen, verschijnen ze hier!</p>
          </div>
        ) : (
          <div className="rsvp-grid">
            {rsvps.map((rsvp, index) => (
              <div 
                key={rsvp.id || index} 
                className={`rsvp-card ${rsvp.response.toLowerCase()}`}
              >
                <div className="rsvp-header">
                  <div className="response-badge">
                    {rsvp.response === 'Ja' ? '🎉' : '😔'} {rsvp.response}
                  </div>
                  <div className="timestamp">
                    {formatDate(rsvp.timestamp)}
                  </div>
                </div>
                <div className="rsvp-name">
                  {rsvp.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <p>💕 Made with love for Matteo's special day</p>
        <p>Derck, Marie & baby Matteo | +31653283572</p>
      </div>

      <style jsx global>{getStyles()}</style>
    </div>
  )
}

function getStyles() {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #a8c8a8 0%, #c8d8c8 100%);
      min-height: 100vh;
    }
    
    .dashboard-container {
      min-height: 100vh;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
    }
    
    .header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 20px;
    }
    
    .refresh-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: 10px 20px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .refresh-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 30px 20px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    .stat-card.total {
      border-color: rgba(255, 255, 255, 0.4);
    }
    
    .stat-card.yes {
      border-color: rgba(76, 175, 80, 0.5);
    }
    
    .stat-card.no {
      border-color: rgba(255, 152, 0, 0.5);
    }
    
    .stat-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }
    
    .stat-info h3 {
      font-size: 2.2rem;
      font-weight: 700;
      color: white;
      margin-bottom: 5px;
    }
    
    .stat-info p {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }
    
    .progress-section {
      margin-bottom: 40px;
    }
    
    .progress-bar {
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      margin-bottom: 10px;
    }
    
    .progress-fill {
      height: 100%;
      position: absolute;
      top: 0;
      transition: all 0.8s ease;
    }
    
    .yes-fill {
      background: linear-gradient(90deg, #4CAF50, #66BB6A);
    }
    
    .no-fill {
      background: linear-gradient(90deg, #FF9800, #FFB74D);
    }
    
    .progress-labels {
      display: flex;
      justify-content: space-between;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .rsvp-section h2 {
      color: white;
      font-size: 1.8rem;
      margin-bottom: 25px;
      font-weight: 600;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    
    .empty-state p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.1rem;
    }
    
    .rsvp-grid {
      display: grid;
      gap: 15px;
    }
    
    .rsvp-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 15px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      animation: slideInUp 0.5s ease;
    }
    
    .rsvp-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    
    .rsvp-card.ja {
      border-left: 4px solid #4CAF50;
    }
    
    .rsvp-card.nee {
      border-left: 4px solid #FF9800;
    }
    
    .rsvp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .response-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
    }
    
    .rsvp-card.ja .response-badge {
      background: rgba(76, 175, 80, 0.3);
    }
    
    .rsvp-card.nee .response-badge {
      background: rgba(255, 152, 0, 0.3);
    }
    
    .timestamp {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .rsvp-name {
      color: white;
      font-size: 1.2rem;
      font-weight: 600;
    }
    
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      color: white;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    .error-card {
      background: rgba(244, 67, 54, 0.2);
      border: 2px solid rgba(244, 67, 54, 0.4);
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      color: white;
    }
    
    .error-card h2 {
      margin-bottom: 15px;
      font-size: 1.5rem;
    }
    
    .error-card p {
      margin-bottom: 25px;
      font-size: 1.1rem;
    }
    
    .retry-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: 12px 24px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .retry-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    
    .footer {
      text-align: center;
      margin-top: 60px;
      padding: 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.8);
    }
    
    .footer p {
      margin-bottom: 5px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 15px;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .rsvp-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    }
  `
}