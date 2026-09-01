'use client';

import { ArrowRight, Check, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { industriesConfig } from '@/config/industries';

interface BusinessSelectorScreenProps {
  selectedIndustry: string | null;
  businessDescription?: string;
  onSelectIndustry: (id: string) => void;
  onChangeDescription?: (desc: string) => void;
  onNext: () => void;
  /** True while the Continue action is persisting to the database */
  saving?: boolean;
  /** Non-null when a DB save error occurred */
  saveError?: string | null;
  /** Called when the user dismisses or retries after an error */
  onClearError?: () => void;
}

// Crisp custom SVGs matching the exact silhouettes in the design
function IndustryIcon({ id }: { id: string }) {
  switch (id) {
    case 'education':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
          <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3ZM5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
        </svg>
      );
    case 'healthcare':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ color: '#000000' }}>
          <rect width="24" height="24" rx="5" fill="currentColor" />
          <path d="M10.25 5.5H13.75V10.25H18.5V13.75H13.75V18.5H10.25V13.75H5.5V10.25H10.25V5.5Z" fill="white" />
        </svg>
      );
    case 'restaurant':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
          <rect x="3.5" y="2" width="1.5" height="4.5" rx="0.5" />
          <rect x="6.5" y="2" width="1.5" height="4.5" rx="0.5" />
          <path d="M4.5 9V21C4.5 21.55 4.95 22 5.5 22C6.05 22 6.5 21.55 6.5 21V9C5.67 9 5 8.33 5 7.5V7H7V7.5C7 8.33 6.33 9 5.5 9H4.5Z" />
          <path d="M18 2C19.66 2 21 3.34 21 5V11C21 11.55 20.55 12 20 12H18.5V21C18.5 21.55 18.05 22 17.5 22C16.95 22 16.5 21.55 16.5 21V2H18Z" />
        </svg>
      );
    case 'professional_services':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M9 3C9 2.44772 9.44772 2 10 2H14C14.5523 2 15 2.44772 15 3V4.5H19.5C20.8807 4.5 22 5.61929 22 7V18.5C22 19.8807 20.8807 21 19.5 21H4.5C3.11929 21 2 19.8807 2 18.5V7C2 5.61929 3.11929 4.5 4.5 4.5H9V3ZM10.5 3.5H13.5V4.5H10.5V3.5ZM4 7.5V10.5H20V7.5C20 6.94772 19.5523 6.5 19 6.5H5C4.44772 6.5 4 6.94772 4 7.5ZM4 12V18.5C4 19.0523 4.44772 19.5 5 19.5H19C19.5523 19.5 20 19.0523 20 18.5V12H13.5V13.5H10.5V12H4Z" />
        </svg>
      );
    case 'retail':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
          <path d="M19 6H15.5C15.5 4.07 13.93 2.5 12 2.5C10.07 2.5 8.5 4.07 8.5 6H5C3.9 6 3 6.9 3 8V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V8C21 6.9 20.1 6 19 6ZM12 4.5C12.83 4.5 13.5 5.17 13.5 6H10.5C10.5 5.17 11.17 4.5 12 4.5ZM12 12C10.62 12 9.5 10.88 9.5 9.5H11C11 10.05 11.45 10.5 12 10.5C12.55 10.5 13 10.05 13 9.5H14.5C14.5 10.88 13.38 12 12 12Z" />
        </svg>
      );
    case 'technology':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
          <path d="M20 3H4C2.9 3 2 3.9 2 5V15C2 16.1 2.9 17 4 17H10V19H8C7.45 19 7 19.45 7 20C7 20.55 7.45 21 8 21H16C16.55 21 17 20.55 17 20C17 19.45 16.55 19 16 19H14V17H20C21.1 17 22 16.1 22 15V5C22 3.9 21.1 3 20 3ZM20 15H4V5H20V15Z" />
        </svg>
      );
    case 'real_estate':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#000000' }}>
          <path d="M12 3L2 12H5V20C5 20.55 5.45 21 6 21H18C18.55 21 19 20.55 19 20V12H22L12 3ZM13.5 19H10.5V14.5H13.5V19Z" />
        </svg>
      );
    case 'other':
    default:
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ color: '#000000' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <circle cx="8" cy="12" r="1.3" fill="currentColor" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" />
          <circle cx="16" cy="12" r="1.3" fill="currentColor" />
        </svg>
      );
  }
}

export default function BusinessSelectorScreen({
  selectedIndustry,
  businessDescription = '',
  onSelectIndustry,
  onChangeDescription,
  onNext,
  saving = false,
  saveError = null,
  onClearError,
}: BusinessSelectorScreenProps) {
  const isDisabled = !selectedIndustry || saving;

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
            maxWidth: '860px',
            width: '100%',
            padding: '2.25rem 2.25rem 1.75rem 2.25rem',
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
              padding: '0.2rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #E5E7EB',
              background: '#FAFAFA',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#6B7280',
              textTransform: 'uppercase',
              marginBottom: '0.65rem',
            }}
          >
            STEP 1 OF 5
          </div>

          {/* 5 Segmented Progress Bars */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ width: '26px', height: '3px', borderRadius: '2px', background: '#000000' }} />
            <div style={{ width: '26px', height: '3px', borderRadius: '2px', background: '#E5E7EB' }} />
            <div style={{ width: '26px', height: '3px', borderRadius: '2px', background: '#E5E7EB' }} />
            <div style={{ width: '26px', height: '3px', borderRadius: '2px', background: '#E5E7EB' }} />
            <div style={{ width: '26px', height: '3px', borderRadius: '2px', background: '#E5E7EB' }} />
          </div>

          {/* Headline & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', maxWidth: '580px' }}>
            <h2
              className="font-display screen-headline"
              style={{
                fontSize: 'clamp(1.5rem, 2.8vw, 2.15rem)',
                fontWeight: 800,
                color: '#0A0A0A',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                marginBottom: '0.45rem',
              }}
            >
              What type of business<br />do you run?
            </h2>
            <p
              className="screen-subtitle"
              style={{
                fontSize: '0.92rem',
                color: '#6B7280',
                lineHeight: 1.4,
              }}
            >
              Select your business type so we can find the right AI Agent for you.
            </p>
          </div>

          {/* Grid of 8 Cards — responsive via CSS class */}
          <div
            className="biz-grid"
            style={{ maxWidth: '780px', marginBottom: selectedIndustry === 'other' ? '1rem' : '1.5rem' }}
          >
            {industriesConfig.map((opt, i) => {
              const isSelected = selectedIndustry === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.025, duration: 0.2 }}
                  whileHover={{ y: -2, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectIndustry(opt.id)}
                  className="biz-card"
                  style={{
                    background: '#FFFFFF',
                    border: isSelected ? '2px solid #000000' : '1.5px solid #EAEAEA',
                    borderRadius: '16px',
                    padding: '1.25rem 0.85rem 1.15rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    minHeight: '112px',
                    cursor: 'pointer',
                    outline: 'none',
                    boxShadow: isSelected
                      ? '0 6px 18px -4px rgba(0, 0, 0, 0.08)'
                      : '0 2px 5px rgba(0, 0, 0, 0.02)',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
                  }}
                >
                  {/* Selected Top-Right Circular Check Badge */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '-7px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
                        zIndex: 10,
                      }}
                    >
                      <Check size={11} strokeWidth={3.5} color="#FFFFFF" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    style={{
                      marginBottom: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '28px',
                    }}
                  >
                    <IndustryIcon id={opt.id} />
                  </div>

                  {/* Label */}
                  <div
                    className="font-display"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#0A0A0A',
                      textAlign: 'center',
                      lineHeight: 1.25,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {opt.label}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Optional Business Description input if "other" is selected */}
          {selectedIndustry === 'other' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.25 }}
              style={{ width: '100%', maxWidth: '780px', marginBottom: '1.25rem' }}
            >
              <label
                htmlFor="other-business-desc"
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.4rem',
                }}
              >
                What does your business do? <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(Optional)</span>
              </label>
              <input
                id="other-business-desc"
                type="text"
                placeholder="e.g. We are a logistics firm managing freight inquiries and warehouse bookings..."
                value={businessDescription}
                onChange={(e) => onChangeDescription?.(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '0 1rem',
                  fontSize: '0.86rem',
                  color: '#111827',
                  outline: 'none',
                  background: '#FAFAFA',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#111827'; e.target.style.background = '#FFFFFF'; }}
                onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
              />
            </motion.div>
          )}

          {/* Continue Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <motion.button
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              onClick={() => { onClearError?.(); onNext(); }}
              disabled={isDisabled}
              style={{
                width: '100%',
                maxWidth: '320px',
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
                transition: 'opacity 0.2s ease, transform 0.15s ease, background 0.15s ease',
                marginBottom: saveError ? '0.4rem' : '0.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              }}
            >
              {saving ? (
                <><Loader2 size={15} className="animate-spin" /> Saving&hellip;</>
              ) : (
                <>Continue <ArrowRight size={15} /></>
              )}
            </motion.button>

            {/* Non-intrusive save error message */}
            {saveError && (
              <div
                style={{
                  fontSize: '0.73rem',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  marginBottom: '0.6rem',
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
