'use client';

import { RotateCcw } from 'lucide-react';
import { StepId } from '@/types';

interface TopBarProps {
  currentStep: StepId;
  onReset: () => void;
}

const steps = [
  { id: 'industry', n: '01', label: 'Business' },
  { id: 'challenges', n: '02', label: 'Needs' },
  { id: 'recommendation', n: '03', label: 'AI Agent' },
  { id: 'demo', n: '04', label: 'Demo' },
  { id: 'lead_form', n: '05', label: 'Build' },
];

const stepOrder: Record<StepId, number> = {
  welcome: 1,
  industry: 1,
  challenges: 2,
  recommendation: 3,
  demo: 4,
  results: 4,
  lead_form: 5,
  success: 5,
};

export default function TopBar({ currentStep, onReset }: TopBarProps) {
  const activeIndex = stepOrder[currentStep] || 1;

  return (
    <header
      style={{
        height: 'var(--topbar-h, 70px)',
        background: '#FFFFFF',
        color: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        zIndex: 50,
        flexShrink: 0,
        borderBottom: '1px solid #EDEDED',
      }}
    >
      {/* Left: Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
        <div style={{ textAlign: 'left' }}>
          <div
            className="font-display"
            style={{
              fontWeight: 800,
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#000000',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            AI Emply
          </div>
          <div
            style={{
              fontSize: '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#71717A',
              textTransform: 'uppercase',
            }}
          >
            AI WORKFORCE
          </div>
        </div>
      </div>

      {/* Center: Step Navigation — hidden on mobile, abbreviated on tablet */}
      <div className="topbar-steps" style={{ alignItems: 'center', gap: '0.5rem' }}>
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = activeIndex === stepNum;
          const isDone = activeIndex > stepNum;

          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                {/* Circle Badge */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isActive ? '#000000' : 'transparent',
                    border: `1.5px solid ${isActive ? '#000000' : isDone ? '#000000' : '#E5E7EB'}`,
                    color: isActive ? '#FFFFFF' : isDone ? '#000000' : '#9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {s.n}
                </div>

                {/* Label Text — hidden on tablet via CSS */}
                <span
                  className="topbar-step-label"
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#000000' : isDone ? '#4B5563' : '#9CA3AF',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </span>
              </div>

              {/* Connector line between steps */}
              {idx < steps.length - 1 && (
                <div
                  style={{
                    width: '28px',
                    height: '1.5px',
                    background: isDone ? '#000000' : '#E5E7EB',
                    marginBottom: '13px',
                    transition: 'background 0.3s ease',
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile step counter — only visible on mobile when .topbar-steps is hidden */}
      <div
        className="font-display topbar-mobile-step"
        style={{
          alignItems: 'center',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: '#4B5563',
        }}
      >
        Step {activeIndex} of 5
      </div>

      {/* Right: Start Over Action */}
      <button
        onClick={onReset}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'transparent',
          border: 'none',
          color: '#4B5563',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '0.4rem 0.65rem',
          borderRadius: '8px',
          transition: 'color 0.15s ease, background 0.15s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#000000';
          e.currentTarget.style.background = '#F3F4F6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#4B5563';
          e.currentTarget.style.background = 'transparent';
        }}
        title="Start Over"
      >
        <RotateCcw size={13} />
        <span style={{ display: 'var(--start-over-text-display, inline)' }}>Start Over</span>
      </button>
    </header>
  );
}
