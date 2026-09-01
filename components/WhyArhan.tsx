'use client';

import { Briefcase, GitBranch, HeartHandshake, BarChart3 } from 'lucide-react';

const principles = [
  {
    icon: Briefcase,
    title: 'Business First',
    description: 'We focus on solving practical business problems — not building technology for its own sake. Everything is grounded in real workflow needs.',
  },
  {
    icon: GitBranch,
    title: 'Custom Workflows',
    description: 'AI Employees are designed around your actual processes, not generic templates. Your business is unique — your AI should be too.',
  },
  {
    icon: HeartHandshake,
    title: 'Human Support',
    description: 'Our team is with you throughout implementation, onboarding, and continuous improvement. You are never left to figure it out alone.',
  },
  {
    icon: BarChart3,
    title: 'Built to Scale',
    description: 'Start with one AI Employee for one specific role. As your business grows, expand your AI workforce without proportional cost increases.',
  },
];

const stats = [
  { value: '24/7', label: 'AI Employee availability' },
  { value: '< 2s', label: 'Average response time' },
  { value: '8+', label: 'Specialized AI roles' },
  { value: '100%', label: 'Custom to your business' },
];

export default function WhyArhan() {
  return (
    <section id="why-arhan" style={{ background: 'var(--bg-subtle)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="section-eyebrow">Why Arhan Enterprises</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Built Around Your Business.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            We work closely with each client to understand their business deeply and build AI Employees that genuinely solve their problems.
          </p>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '3rem',
            overflow: 'hidden',
          }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '2rem 1.5rem',
                textAlign: 'center',
                borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div className="font-display" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Principles grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  display: 'flex',
                  gap: '1.25rem',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = 'var(--shadow-md)';
                  el.style.borderColor = 'var(--border-hover)';
                  el.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = 'var(--shadow-xs)';
                  el.style.borderColor = 'var(--border)';
                  el.style.transform = 'translateY(0)';
                }}
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
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} style={{ color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {principle.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {principle.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
