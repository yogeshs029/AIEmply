'use client';

import { Check } from 'lucide-react';
import { StepId } from '@/types';

interface ProgressBarProps {
  currentStep: StepId;
}

const steps = [
  { id: 'industry', n: '01', label: 'Business' },
  { id: 'challenges', n: '02', label: 'Needs' },
  { id: 'recommendation', n: '03', label: 'AI Employee' },
  { id: 'demo', n: '04', label: 'Try Demo' },
  { id: 'lead_form', n: '05', label: 'Build' },
];

const stepOrder: Record<StepId, number> = {
  welcome: 0,
  industry: 1,
  challenges: 2,
  recommendation: 3,
  demo: 4,
  results: 4,
  lead_form: 5,
  success: 5,
};

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  if (currentStep === 'welcome' || currentStep === 'industry' || currentStep === 'success') return null;

  const currentOrder = stepOrder[currentStep] || 1;

  return (
    <div
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-subtle)',
        padding: '0.65rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          maxWidth: '750px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = currentOrder === stepNum;
          const isDone = currentOrder > stepNum;

          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: idx < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: isDone || isActive ? 'var(--text-primary)' : 'var(--bg)',
                    border: `1.5px solid ${isDone || isActive ? 'var(--text-primary)' : 'var(--border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  {isDone ? (
                    <Check size={11} color="white" />
                  ) : (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: isActive ? 'white' : 'var(--text-muted)',
                      }}
                    >
                      {s.n}
                    </span>
                  )}
                </div>
                <span
                  className="hidden md:inline"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {s.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '1.5px',
                    background: currentOrder > stepNum ? 'var(--text-primary)' : 'var(--border)',
                    margin: '0 0.75rem',
                    transition: 'background 0.3s ease',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
