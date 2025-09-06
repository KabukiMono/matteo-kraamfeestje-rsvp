'use client'

import { useState } from 'react'

export default function RSVPPage() {
  const [currentStep, setCurrentStep] = useState('welcome')
  const [name, setName] = useState('')
  const [response, setResponse] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !response) return
    
    setIsSubmitting(true)
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          response,
          timestamp: new Date().toISOString()
        }),
      })
      setSubmitted(true)
      setCurrentStep('thanks')
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderWelcome = () => (
    <div className="typeform-container">
      <div className="content-wrapper">
        <div className="step-indicator">1 → 3</div>
        
        <div className="question-section">
          <h1 className="main-question">
            Hallo! Ik ben zo blij dat je er bent! ✨
          </h1>
          <p className="sub-text">
            Voordat we beginnen, wat is je naam?
          </p>
          
          <div className="input-section">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type je naam hier..."
              className="name-input"
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && setCurrentStep('question')}
            />
          </div>
        </div>

        <div className="navigation">
          <button 
            onClick={() => name.trim() && setCurrentStep('question')}
            disabled={!name.trim()}
            className="continue-btn"
          >
            OK ✓
          </button>
          <p className="hint">druk op Enter ↵</p>
        </div>
      </div>
    </div>
  )

  const renderQuestion = () => (
    <div className="typeform-container">
      <div className="content-wrapper">
        <div className="step-indicator">2 → 3</div>
        
        <div className="question-section">
          <h1 className="main-question">
            Hoi {name}! 👋
          </h1>
          <h2 className="sub-question">
            Kom je op mijn kraamfeestje?
          </h2>
          
          <div className="baby-info">
            <div className="baby-details">
              <h3>🍼 MATTEO</h3>
              <p>📍 Strandpaviljoen Reuring (Hoorn, NH)</p>
              <p>📅 Zaterdag 20.09.2025</p>
              <p>🕐 Tijd: 13:00 - 16:00</p>
            </div>
          </div>
          
          <div className="answer-options">
            <button
              onClick={() => setResponse('Ja')}
              className={`option-btn yes-btn ${response === 'Ja' ? 'selected' : ''}`}
            >
              <span className="option-letter">A</span>
              <span className="option-text">Ja! Ik kom graag! 🎉</span>
            </button>
            
            <button
              onClick={() => setResponse('Nee')}
              className={`option-btn no-btn ${response === 'Nee' ? 'selected' : ''}`}
            >
              <span className="option-letter">B</span>
              <span className="option-text">Nee, helaas kan ik niet 😔</span>
            </button>
          </div>
        </div>

        <div className="navigation">
          <button 
            onClick={() => setCurrentStep('welcome')}
            className="back-btn"
          >
            ← Terug
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!response || isSubmitting}
            className="continue-btn"
          >
            {isSubmitting ? 'Versturen...' : 'Verstuur ✓'}
          </button>
        </div>
      </div>
    </div>
  )

  const renderThanks = () => (
    <div className="typeform-container">
      <div className="content-wrapper">
        <div className="step-indicator">3 → 3</div>
        
        <div className="question-section thank-you">
          <div className="celebration">
            {response === 'Ja' ? '🎉' : '💙'}
          </div>
          <h1 className="main-question">
            {response === 'Ja' 
              ? `Geweldig, ${name}!` 
              : `Bedankt, ${name}!`
            }
          </h1>
          <p className="sub-text">
            {response === 'Ja' 
              ? 'We kunnen niet wachten om je te zien op het kraamfeestje! Tot dan! 💕'
              : 'Bedankt voor je eerlijke antwoord. We zullen je missen, maar we begrijpen het! 💙'
            }
          </p>
          
          <div className="final-message">
            <p>Voor vragen, bel: +31653283572</p>
            <p className="signature">💕 Derck, Marie en kleine Matteo</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: linear-gradient(135deg, #a8c8a8 0%, #c8d8c8 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }
        
        .typeform-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #a8c8a8 0%, #c8d8c8 100%);
        }
        
        .content-wrapper {
          width: 100%;
          max-width: 600px;
          animation: fadeIn 0.6s ease-out;
        }
        
        .step-indicator {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          margin-bottom: 40px;
          font-weight: 500;
        }
        
        .question-section {
          margin-bottom: 60px;
        }
        
        .main-question {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        
        .sub-question {
          font-size: 1.8rem;
          font-weight: 600;
          color: white;
          line-height: 1.3;
          margin-bottom: 30px;
        }
        
        .sub-text {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.5;
          margin-bottom: 30px;
        }
        
        .input-section {
          margin: 30px 0;
        }
        
        .name-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 3px solid rgba(255, 255, 255, 0.3);
          padding: 15px 0;
          font-size: 1.3rem;
          color: white;
          outline: none;
          transition: all 0.3s ease;
        }
        
        .name-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .name-input:focus {
          border-bottom-color: white;
        }
        
        .baby-info {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .baby-details h3 {
          font-size: 1.5rem;
          color: white;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .baby-details p {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 8px;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .answer-options {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 40px;
        }
        
        .option-btn {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 20px 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }
        
        .option-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
        }
        
        .option-btn.selected {
          background: rgba(255, 255, 255, 0.25);
          border-color: white;
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
        }
        
        .option-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: white;
          font-weight: 700;
          margin-right: 20px;
          font-size: 14px;
        }
        
        .option-text {
          color: white;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }
        
        .continue-btn, .back-btn {
          background: white;
          color: #2d5a2d;
          border: none;
          border-radius: 12px;
          padding: 15px 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .continue-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .continue-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .back-btn {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .hint {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          font-style: italic;
        }
        
        .thank-you {
          text-align: center;
        }
        
        .celebration {
          font-size: 4rem;
          margin-bottom: 30px;
          animation: bounce 1s ease-in-out;
        }
        
        .final-message {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          margin-top: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .final-message p {
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 10px;
          font-weight: 500;
        }
        
        .signature {
          font-style: italic;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 20px !important;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
        
        @media (max-width: 768px) {
          .main-question {
            font-size: 2rem;
          }
          
          .sub-question {
            font-size: 1.5rem;
          }
          
          .content-wrapper {
            padding: 0 10px;
          }
          
          .navigation {
            flex-direction: column;
            gap: 15px;
          }
          
          .continue-btn, .back-btn {
            width: 100%;
          }
        }
      `}</style>

      {currentStep === 'welcome' && renderWelcome()}
      {currentStep === 'question' && renderQuestion()}
      {currentStep === 'thanks' && renderThanks()}
    </>
  )
}