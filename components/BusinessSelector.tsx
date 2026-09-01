'use client';

import { useState } from 'react';
import { industries } from '@/data/industries';
import { challenges } from '@/data/challenges';
import { aiEmployees } from '@/data/employees';
import { getRecommendations } from '@/data/recommendations';
import { AIEmployee } from '@/types';
import AIEmployeeCard from '@/components/AIEmployeeCard';
import { analytics } from '@/lib/analytics';
import { ArrowRight, ArrowLeft, RefreshCw, Check } from 'lucide-react';

type Step = 1 | 2 | 3;

export default function BusinessSelector() {
  const [step, setStep] = useState<Step>(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [recommendedEmployees, setRecommendedEmployees] = useState<AIEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const handleIndustrySelect = (id: string) => {
    const industry = industries.find((i) => i.id === id);
    setSelectedIndustry(id);
    if (industry) analytics.industrySelected(id, industry.label);
    setTimeout(() => setStep(2), 250);
  };

  const handleChallengeToggle = (id: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleGetRecommendations = () => {
    analytics.challengeSelected(selectedChallenges);
    const ids = getRecommendations(selectedIndustry ? [selectedIndustry] : [], selectedChallenges);
    const employees = ids.map((id) => aiEmployees.find((e) => e.id === id)).filter(Boolean) as AIEmployee[];
    setRecommendedEmployees(employees);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedIndustry(null);
    setSelectedChallenges([]);
    setRecommendedEmployees([]);
    setSelectedEmployee(null);
  };

  const handleEmployeeSelect = (employee: AIEmployee) => {
    setSelectedEmployee(employee.id);
    analytics.aiEmployeeSelected(employee.id, employee.role);
    setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 400);
  };

  const steps = [
    { n: '01', label: 'Business' },
    { n: '02', label: 'Challenges' },
    { n: '03', label: 'AI Employees' },
  ];

  return (
    <section id="discover" style={{ background: 'var(--bg-subtle)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">Interactive Discovery</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Build Your AI Workforce.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Tell us about your business and discover the AI Employees that can support your team.
          </p>
        </div>

        {/* Step Progress */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Progress bar header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1.5rem' }}>
            {steps.map((s, i) => {
              const isActive = step === i + 1;
              const isDone = step > i + 1;
              return (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isDone ? 'var(--text-primary)' : isActive ? 'var(--text-primary)' : 'var(--bg-subtle)',
                        border: `1.5px solid ${isDone || isActive ? 'var(--text-primary)' : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                      }}
                    >
                      {isDone ? (
                        <Check size={12} color="white" />
                      ) : (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: isActive ? 'white' : 'var(--text-muted)' }}>
                          {s.n}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      style={{
                        flex: 1,
                        height: '1.5px',
                        background: step > i + 1 ? 'var(--text-primary)' : 'var(--border)',
                        margin: '0 0.75rem',
                        transition: 'background 0.3s ease',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress fill bar */}
          <div style={{ background: 'var(--border)', borderRadius: '100px', height: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--text-primary)',
                borderRadius: '100px',
                width: `${((step - 1) / 2) * 100}%`,
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* ---- STEP 1 ---- */}
          {step === 1 && (
            <div>
              <p className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                What type of business do you run?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {industries.map((industry) => (
                  <button
                    key={industry.id}
                    id={`industry-${industry.id}`}
                    onClick={() => handleIndustrySelect(industry.id)}
                    style={{
                      background: selectedIndustry === industry.id ? 'var(--bg-subtle)' : 'var(--bg)',
                      border: `1.5px solid ${selectedIndustry === industry.id ? 'var(--text-primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      if (selectedIndustry !== industry.id) {
                        el.style.borderColor = 'var(--border-hover)';
                        el.style.background = 'var(--bg-subtle)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      if (selectedIndustry !== industry.id) {
                        el.style.borderColor = 'var(--border)';
                        el.style.background = 'var(--bg)';
                      }
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{industry.icon}</div>
                    <div className="font-display" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                      {industry.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {industry.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- STEP 2 ---- */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <p className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    What would you like your AI Employee to help with?
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Select all that apply</p>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => setStep(1)}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.65rem', marginBottom: '1.5rem' }}>
                {challenges.map((challenge) => {
                  const isSelected = selectedChallenges.includes(challenge.id);
                  return (
                    <button
                      key={challenge.id}
                      id={`challenge-${challenge.id}`}
                      onClick={() => handleChallengeToggle(challenge.id)}
                      style={{
                        background: isSelected ? 'var(--bg-subtle)' : 'var(--bg)',
                        border: `1.5px solid ${isSelected ? 'var(--text-primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '1rem 1.25rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: `1.5px solid ${isSelected ? 'var(--text-primary)' : 'var(--border-hover)'}`,
                          background: isSelected ? 'var(--text-primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '1px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isSelected && <Check size={11} color="white" />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {challenge.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {challenge.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-primary"
                  style={{ opacity: selectedChallenges.length === 0 ? 0.4 : 1, cursor: selectedChallenges.length === 0 ? 'not-allowed' : 'pointer' }}
                  disabled={selectedChallenges.length === 0}
                  onClick={handleGetRecommendations}
                >
                  Show My AI Employees <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ---- STEP 3 ---- */}
          {step === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <p className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Recommended AI Employees for you
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Based on your business type and challenges</p>
                </div>
                <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }} onClick={handleReset}>
                  <RefreshCw size={14} /> Start Over
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {recommendedEmployees.map((employee) => (
                  <AIEmployeeCard
                    key={employee.id}
                    employee={employee}
                    onSelect={handleEmployeeSelect}
                    selected={selectedEmployee === employee.id}
                  />
                ))}
              </div>

              {selectedEmployee && (
                <div
                  style={{
                    marginTop: '1.5rem',
                    background: 'var(--bg-subtle)',
                    border: '1.5px solid var(--text-primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <p className="font-display" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    Great choice. Let's build your AI Employee.
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Scroll down to describe your workflow and we'll get started.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Request a Consultation <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
