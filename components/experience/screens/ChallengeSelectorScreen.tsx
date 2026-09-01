'use client';

import { useMemo } from 'react';
import { dynamicOptionsService } from '@/services/dynamicOptionsService';
import { ArrowLeft, ArrowRight, Check, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChallengeSelectorScreenProps {
  industryId?: string | null;
  selectedChallenges: string[];
  onToggleChallenge: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  /** True while the Continue action is persisting to the database */
  saving?: boolean;
  /** Non-null when a DB save error occurred */
  saveError?: string | null;
  /** Called when the user dismisses or retries after an error */
  onClearError?: () => void;
}

// Custom crisp SVG icons matching the exact silhouettes
function NeedIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'chat':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      );
    case 'funnel':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );
    case 'phone':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
        </svg>
      );
    case 'support':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </svg>
      );
    case 'dollar':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'grad_cap':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case 'doc':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case 'bag':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case 'star':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'user':
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
  }
}

export default function ChallengeSelectorScreen({
  industryId = 'other',
  selectedChallenges,
  onToggleChallenge,
  onBack,
  onNext,
  saving = false,
  saveError = null,
  onClearError,
}: ChallengeSelectorScreenProps) {
  // Dynamically load needs specific to the selected industry
  const needs = useMemo(() => {
    return dynamicOptionsService.getNeedsForIndustry(industryId || 'other');
  }, [industryId]);

  const isDisabled = selectedChallenges.length === 0 || saving;

  return (
    <div className="screen-scroll-wrapper">
      <div
        style={{
          margin: 'auto 0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '0.5rem 0',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.99 }}
          transition={{ duration: 0.3 }}
          className="screen-card"
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)',
            maxWidth: '980px',
            width: '100%',
            padding: '2.5rem 2.5rem 2rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Step Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid #E5E7EB',
              background: '#FAFAFA',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#6B7280',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}
          >
            STEP 2 OF 5
          </div>

          {/* Headline & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '640px' }}>
            <h2
              className="font-display screen-headline"
              style={{
                fontSize: 'clamp(1.55rem, 3.2vw, 2.35rem)',
                fontWeight: 800,
                color: '#0A0A0A',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                marginBottom: '0.5rem',
              }}
            >
              What would you like help with?
            </h2>
            <p
              className="screen-subtitle"
              style={{
                fontSize: '0.96rem',
                color: '#6B7280',
                lineHeight: 1.45,
              }}
            >
              Select one or more areas where you need AI support.
            </p>
          </div>

          {/* Grid of Dynamic Need Cards */}
          <div
            className="challenge-grid"
            style={{ maxWidth: '920px', marginBottom: '2rem' }}
          >
            {needs.map((c, i) => {
              const isSelected = selectedChallenges.includes(c.id);
              return (
                <motion.button
                  key={c.id}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.18 }}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    onClearError?.();
                    onToggleChallenge(c.id);
                  }}
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '1.5px solid #000000' : '1.5px solid #EDEDED',
                    borderRadius: '16px',
                    padding: '1.15rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: isSelected
                      ? '0 6px 18px -4px rgba(0, 0, 0, 0.08)'
                      : '0 2px 5px rgba(0, 0, 0, 0.02)',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  {/* Left: Icon */}
                  <div
                    style={{
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <NeedIcon icon={c.icon} />
                  </div>

                  {/* Middle: Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className="font-display"
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#0A0A0A',
                        lineHeight: 1.25,
                        marginBottom: '0.22rem',
                      }}
                    >
                      {c.label}
                    </div>
                    <p
                      style={{
                        fontSize: '0.76rem',
                        color: '#6B7280',
                        lineHeight: 1.35,
                        margin: 0,
                      }}
                    >
                      {c.description}
                    </p>
                  </div>

                  {/* Right: Checkbox */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '5px',
                      border: isSelected ? '1.5px solid #000000' : '1.5px solid #D1D5DB',
                      background: isSelected ? '#000000' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={3.5} color="#FFFFFF" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Action Buttons: Back & Continue */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="action-btn-row">
              {/* Back Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBack}
                disabled={saving}
                style={{
                  width: '140px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  color: '#000000',
                  border: '1.5px solid #E5E7EB',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                  flexShrink: 0,
                }}
              >
                <ArrowLeft size={16} /> Back
              </motion.button>

              {/* Continue Button */}
              <motion.button
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => {
                  onClearError?.();
                  onNext();
                }}
                disabled={isDisabled}
                style={{
                  width: '180px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#000000',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.45 : 1,
                  transition: 'opacity 0.2s ease, transform 0.15s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                  flexShrink: 0,
                }}
              >
                {saving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Saving&hellip;
                  </>
                ) : (
                  <>
                    Continue <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </div>

            {/* Non-intrusive save error message */}
            {saveError && (
              <div
                style={{
                  fontSize: '0.73rem',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginTop: '0.6rem',
                  textAlign: 'center',
                  maxWidth: '320px',
                }}
              >
                <span>⚠ {saveError}</span>
                <button
                  onClick={onClearError}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#DC2626',
                    fontWeight: 700,
                    fontSize: '0.73rem',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Security Note */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.74rem',
                color: '#8E8E93',
                marginTop: saveError ? '0.4rem' : '0.75rem',
              }}
            >
              <Lock size={11} color="#8E8E93" />
              <span>Your information is secure and will never be shared.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
