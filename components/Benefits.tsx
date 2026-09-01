'use client';

import { Clock, Zap, TrendingUp, Settings, Target, Users } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Your customers can receive responses even outside working hours — no missed enquiries, no waiting until morning.',
  },
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'Reduce waiting time for common questions from hours to seconds. First impressions matter.',
  },
  {
    icon: TrendingUp,
    title: 'Scalable',
    description: 'Handle more customer interactions as your business grows — without proportionally growing your team.',
  },
  {
    icon: Settings,
    title: 'Custom Workflows',
    description: 'Your AI Employee is designed around your actual business processes, tone of voice, and requirements.',
  },
  {
    icon: Target,
    title: 'Better Lead Capture',
    description: 'Never lose potential customer enquiries. Every conversation is an opportunity to capture and qualify a lead.',
  },
  {
    icon: Users,
    title: 'Human + AI',
    description: 'Let your team focus on important, high-value work while AI handles the repetitive and routine tasks.',
  },
];

export default function Benefits() {
  return (
    <section id="why-ai" style={{ background: 'var(--bg)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5rem', alignItems: 'start' }}>
          {/* Left sticky label */}
          <div style={{ position: 'sticky', top: '5rem' }}>
            <span className="section-eyebrow">Why AI Employees</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
              Build a Smarter Workforce.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              AI Employees support your team — not replace them. They handle the routine so your people can do their best work.
            </p>
          </div>

          {/* Right grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  style={{
                    background: 'var(--bg)',
                    padding: '2rem',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-subtle)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg)'; }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <Icon size={18} style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    {benefit.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '600px', margin: '3rem auto 0', lineHeight: 1.6 }}>
          AI Employees are built to augment your team and support repetitive, customer-facing tasks.
          They are not designed to replace human judgment, complex decision-making, or skilled professional work.
        </p>
      </div>
    </section>
  );
}
