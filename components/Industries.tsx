'use client';

const industries = [
  {
    icon: '🏫',
    name: 'Education',
    roles: ['AI Admission Counselor', 'Student Support Assistant'],
    description: 'Handle admissions, student enquiries, and course information around the clock.',
  },
  {
    icon: '🏥',
    name: 'Healthcare',
    roles: ['AI Appointment Coordinator', 'AI Receptionist'],
    description: 'Manage appointment bookings and basic patient enquiries professionally.',
    disclaimer: 'Does not provide medical diagnosis or emergency advice.',
  },
  {
    icon: '🍽️',
    name: 'Restaurant',
    roles: ['AI Customer Assistant', 'AI Reservation Assistant'],
    description: 'Answer menu questions, handle reservations, and collect customer feedback.',
  },
  {
    icon: '🏠',
    name: 'Real Estate',
    roles: ['AI Lead Qualification Agent', 'AI Sales Assistant'],
    description: 'Qualify property enquiries, capture leads, and schedule viewings.',
  },
  {
    icon: '🏢',
    name: 'Professional Services',
    roles: ['AI Sales Assistant', 'AI Receptionist'],
    description: 'Handle client enquiries, generate leads, and manage appointment bookings.',
  },
  {
    icon: '🛍️',
    name: 'Retail',
    roles: ['AI Customer Support Executive', 'AI Sales Assistant'],
    description: 'Provide product information, support customers, and drive conversions.',
  },
  {
    icon: '💻',
    name: 'Technology',
    roles: ['AI Customer Support Executive', 'AI HR Assistant'],
    description: 'Automate support, onboard customers, and handle internal team queries.',
  },
];

export default function Industries() {
  return (
    <section id="industries" style={{ background: 'var(--bg-subtle)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Industries We Serve</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Built for Businesses of Every Kind.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            AI Employees designed and deployed across a wide range of industries and business types.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          {industries.map((industry, i) => (
            <div
              key={industry.name}
              style={{
                background: 'var(--card)',
                padding: '1.75rem',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-subtle)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--card)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}
                >
                  {industry.icon}
                </div>
                <h3 className="font-display" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {industry.name}
                </h3>
              </div>

              <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                {industry.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {industry.roles.map((role) => (
                  <span
                    key={role}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {role}
                  </span>
                ))}
              </div>

              {industry.disclaimer && (
                <p style={{ fontSize: '0.7rem', color: '#92400E', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.6rem', marginTop: '0.75rem', lineHeight: 1.5 }}>
                  ⚠️ {industry.disclaimer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
