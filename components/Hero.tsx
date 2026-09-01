'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const trustBadges = [
  'Available 24/7',
  'Built for your business',
  'Designed around your workflow',
];

const recentTasks = [
  'Answered customer enquiry',
  'Captured new lead',
  'Scheduled follow-up',
  'Escalated priority request',
];

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fade = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.6s ease',
  };

  return (
    <section
      style={{
        background: 'var(--bg)',
        paddingTop: '7rem',
        paddingBottom: '5rem',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5rem',
            alignItems: 'center',
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* LEFT */}
          <div style={{ ...fade }}>
            {/* Pill badge */}
            <div className="label-pill" style={{ marginBottom: '2rem' }}>
              <span className="status-dot" />
              <span>AI WORKFORCE FOR MODERN BUSINESSES</span>
            </div>

            {/* Headline */}
            <h1
              className="section-title"
              style={{
                fontSize: 'clamp(3rem, 5.5vw, 4.5rem)',
                marginBottom: '1.5rem',
                letterSpacing: '-0.03em',
              }}
            >
              Hire Your First
              <br />
              <span
                style={{
                  borderBottom: '4px solid var(--accent)',
                  paddingBottom: '2px',
                  display: 'inline-block',
                  lineHeight: 1.15,
                }}
              >
                AI Employee.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="section-subtitle"
              style={{ marginBottom: '2.5rem', maxWidth: '460px' }}
            >
              Give your business an intelligent digital employee that can answer customers,
              capture leads, handle repetitive tasks, and work around the clock.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <button
                id="hero-cta-primary"
                className="btn btn-primary"
                style={{ fontSize: '0.95rem', padding: '0.85rem 1.75rem' }}
                onClick={() => { analytics.heroCTAClick('primary'); document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Build My AI Employee <ArrowRight size={16} />
              </button>
              <button
                id="hero-cta-secondary"
                className="btn btn-secondary"
                style={{ fontSize: '0.95rem', padding: '0.85rem 1.75rem' }}
                onClick={() => { analytics.heroCTAClick('secondary'); document.querySelector('#employees')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Explore AI Employees
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              {trustBadges.map((badge) => (
                <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Dashboard card */}
          <div
            style={{
              ...fade,
              transitionDelay: '0.15s',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '400px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
              }}
            >
              {/* Card header */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>
                    AI EMPLOYEE
                  </div>
                  <div className="font-display" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Customer Support Executive
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  💬
                </div>
              </div>

              {/* Status bar */}
              <div
                style={{
                  padding: '0.65rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--success-bg)',
                }}
              >
                <span className="status-dot" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Active · Working 24/7
                </span>
              </div>

              {/* Stats */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderBottom: '1px solid var(--border)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                }}
              >
                {[
                  { value: '142', label: 'Conversations' },
                  { value: '38', label: 'Leads Captured' },
                  { value: '24/7', label: 'Availability' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div
                      className="font-display"
                      style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent tasks */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  Today's Activity
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {recentTasks.map((task, i) => (
                    <div
                      key={task}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'var(--success-bg)',
                          border: '1px solid rgba(22,163,74,0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                          <path d="M1 3.5L3 5.5L7 1.5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg-subtle)',
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
                  onClick={() => { analytics.heroCTAClick('primary'); document.querySelector('#discover')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Build My AI Employee <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 1024px) {
          .grid-cols-1 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
