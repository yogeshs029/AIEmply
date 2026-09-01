'use client';

const steps = [
  {
    number: '01',
    title: 'Understand Your Business',
    description: 'We learn about your workflow, your customers, and the tasks that take up the most time in your team.',
  },
  {
    number: '02',
    title: 'Choose Your AI Employee',
    description: 'Select the role your AI Employee will perform — from receptionist and sales assistant to admission counselor and more.',
  },
  {
    number: '03',
    title: 'We Build Your Workflow',
    description: 'Our team customizes the AI Employee around your business processes, language, and requirements.',
  },
  {
    number: '04',
    title: 'Your AI Employee Starts Working',
    description: 'Your digital employee is deployed, tested, and continuously improved to serve your business better over time.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: 'var(--bg)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ marginBottom: '4rem' }}>
          <span className="section-eyebrow">The Process</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            From Idea to AI Employee.
          </h2>
          <p className="section-subtitle">
            A simple, structured process to get your AI Employee working for your business.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0' }}>
          {steps.map((step, i) => (
            <div
              key={step.number}
              style={{
                padding: '2.5rem 2rem 2.5rem',
                borderRight: i < steps.length - 1 ? '1px solid var(--border)' : 'none',
                borderTop: '1px solid var(--border)',
                position: 'relative',
              }}
            >
              <div
                className="font-display"
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  color: 'var(--border)',
                  lineHeight: 1,
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.03em',
                }}
              >
                {step.number}
              </div>
              <h3
                className="font-display"
                style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.6rem', lineHeight: 1.3 }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {step.description}
              </p>

              {i < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '2.75rem',
                    right: '-0.65rem',
                    width: '1.25rem',
                    height: '1.25rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                  className="hidden lg:flex"
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M2 4H6M6 4L4 2M6 4L4 6" stroke="var(--text-muted)" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
