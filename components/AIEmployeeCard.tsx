'use client';

import { CheckCircle2, ArrowRight } from 'lucide-react';
import { AIEmployee } from '@/types';
import { analytics } from '@/lib/analytics';

interface AIEmployeeCardProps {
  employee: AIEmployee;
  compact?: boolean;
  onSelect?: (employee: AIEmployee) => void;
  selected?: boolean;
  dark?: boolean;
}

export default function AIEmployeeCard({
  employee,
  compact = false,
  onSelect,
  selected = false,
  dark = false,
}: AIEmployeeCardProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selected) {
      const el = e.currentTarget as HTMLDivElement;
      el.style.boxShadow = 'var(--shadow-md)';
      el.style.borderColor = 'var(--border-hover)';
      el.style.transform = 'translateY(-2px)';
    }
    analytics.aiEmployeeViewed(employee.id, employee.role);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selected) {
      const el = e.currentTarget as HTMLDivElement;
      el.style.boxShadow = 'var(--shadow-sm)';
      el.style.borderColor = 'var(--border)';
      el.style.transform = 'translateY(0)';
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: selected ? 'var(--bg-subtle)' : 'var(--card)',
        border: selected ? '2px solid var(--text-primary)' : '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: compact ? '1.25rem' : '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxShadow: selected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: compact ? '36px' : '44px',
              height: compact ? '36px' : '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: compact ? '1rem' : '1.25rem',
              flexShrink: 0,
            }}
          >
            {employee.icon}
          </div>
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>
              AI EMPLOYEE
            </div>
            <h3
              className="font-display"
              style={{ fontSize: compact ? '0.88rem' : '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}
            >
              {employee.role}
            </h3>
          </div>
        </div>
        {employee.badge && (
          <span className="badge">{employee.badge}</span>
        )}
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '0.83rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          marginBottom: '1rem',
        }}
      >
        {compact ? employee.tagline : employee.description}
      </p>

      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', margin: '0.5rem 0 1rem' }} />

      {/* Capabilities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1, marginBottom: '1.25rem' }}>
        {(compact ? employee.capabilities.slice(0, 3) : employee.capabilities).map((cap) => (
          <div key={cap} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <CheckCircle2
              size={13}
              style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{cap}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      {employee.disclaimer && !compact && (
        <div
          style={{
            fontSize: '0.72rem',
            color: '#92400E',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.75rem',
            marginBottom: '1rem',
            lineHeight: 1.5,
          }}
        >
          ⚠️ {employee.disclaimer}
        </div>
      )}

      {/* CTA */}
      <div style={{ marginTop: 'auto' }}>
        {onSelect ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
            onClick={() => { analytics.aiEmployeeSelected(employee.id, employee.role); onSelect(employee); }}
          >
            {selected ? '✓ Selected' : 'Select This Employee'}
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
            onClick={() => { analytics.aiEmployeeViewed(employee.id, employee.role); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Explore Role <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
