'use client';

import { useEffect, useRef, useState } from 'react';
import { analytics } from '@/lib/analytics';
import { RotateCcw } from 'lucide-react';

interface Message {
  id: number;
  sender: 'customer' | 'ai';
  text: string;
  delay: number;
}

const conversation: Message[] = [
  { id: 1, sender: 'customer', text: 'Hi, I want to know more about your services.', delay: 600 },
  {
    id: 2,
    sender: 'ai',
    text: "Hello! I'd be happy to help.\n\nWe provide AI Employees designed to handle customer enquiries, leads, appointments, and repetitive business tasks — available 24/7.\n\nWhat type of business do you run?",
    delay: 1800,
  },
  { id: 3, sender: 'customer', text: "We're an education institute. We get a lot of admission enquiries.", delay: 4000 },
  {
    id: 4,
    sender: 'ai',
    text: "Great. For educational institutions, our AI Admission Counselor is a strong fit.\n\nIt can answer course and eligibility questions, collect student details, follow up with prospective admissions, and route serious enquiries to your counselors.\n\nWould you like to explore this for your institution?",
    delay: 5500,
  },
  { id: 5, sender: 'customer', text: 'Yes, definitely! How do we get started?', delay: 8000 },
  {
    id: 6,
    sender: 'ai',
    text: "The next step is a short consultation with our team.\n\nWe'll understand your admission workflow, the common questions you receive, and design an AI Employee built around your specific process.\n\nWould you like to schedule that call?",
    delay: 9500,
  },
];

function formatText(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

export default function LiveDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [typingId, setTypingId] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started) return;
    const timers: NodeJS.Timeout[] = [];

    conversation.forEach((msg) => {
      if (msg.sender === 'ai') {
        timers.push(
          setTimeout(() => setTypingId(msg.id), msg.delay - 900)
        );
      }
      timers.push(
        setTimeout(() => {
          setTypingId(null);
          setVisibleMessages((prev) => [...prev, msg.id]);
          setTimeout(() => {
            chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
          }, 40);
        }, msg.delay)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [started]);

  const handleStart = () => {
    setStarted(true);
    setVisibleMessages([]);
    setTypingId(null);
    analytics.demoStarted();
  };

  const handleReset = () => {
    setStarted(false);
    setVisibleMessages([]);
    setTypingId(null);
  };

  return (
    <section
      id="demo"
      style={{ background: 'var(--bg-dark)', padding: 'var(--section-pad) 0' }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left — text */}
          <div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                display: 'block',
                marginBottom: '1rem',
              }}
            >
              Live Demo
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
              }}
            >
              Meet Your
              <br />
              AI Employee.
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '380px' }}>
              See how an AI Admission Counselor handles a real customer conversation — instantly,
              professionally, and around the clock.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Responds in under 2 seconds',
                'Handles unlimited conversations simultaneously',
                'Available 24 hours, 7 days a week',
              ].map((point) => (
                <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.55)' }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — chat window */}
          <div>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}
            >
              {/* Chat header */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    🎓
                  </div>
                  <div>
                    <div className="font-display" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      AI Admission Counselor
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span className="status-dot" />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--success)' }}>Online</span>
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Demo
                </span>
              </div>

              {/* Messages */}
              <div
                ref={chatRef}
                style={{
                  minHeight: '340px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  scrollbarWidth: 'thin',
                }}
              >
                {!started && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '280px', gap: '1rem' }}>
                    <div style={{ fontSize: '2.5rem' }}>💬</div>
                    <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                      Watch a live AI Employee conversation
                    </p>
                    <button className="btn btn-primary" onClick={handleStart}>
                      Start Demo
                    </button>
                  </div>
                )}

                {started && conversation.map((msg) => {
                  const isVisible = visibleMessages.includes(msg.id);
                  const isTyping = typingId === msg.id;
                  if (!isVisible && !isTyping) return null;

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'customer' ? 'flex-end' : 'flex-start',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '78%',
                          padding: '0.75rem 1rem',
                          borderRadius: msg.sender === 'customer' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: msg.sender === 'customer' ? 'var(--text-primary)' : 'var(--bg-subtle)',
                          border: msg.sender === 'ai' ? '1px solid var(--border)' : 'none',
                          fontSize: '0.855rem',
                          color: msg.sender === 'customer' ? 'white' : 'var(--text-primary)',
                          lineHeight: 1.65,
                        }}
                      >
                        {isTyping ? (
                          <div style={{ display: 'flex', gap: '3px', alignItems: 'center', padding: '0.1rem 0' }}>
                            {[0, 0.15, 0.3].map((delay, i) => (
                              <div
                                key={i}
                                style={{
                                  width: '5px',
                                  height: '5px',
                                  borderRadius: '50%',
                                  background: 'var(--text-muted)',
                                  animation: `status-pulse 1.2s ease ${delay}s infinite`,
                                }}
                              />
                            ))}
                          </div>
                        ) : formatText(msg.text)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '0.75rem 1.25rem',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-subtle)',
                }}
              >
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Scripted demonstration. Actual responses vary.
                </p>
                {started && visibleMessages.length === conversation.length && (
                  <button
                    onClick={handleReset}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.3rem 0.6rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <RotateCcw size={11} /> Replay
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          #demo > div > div { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}
