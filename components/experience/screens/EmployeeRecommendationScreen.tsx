'use client';

import { useState } from 'react';
import { AIAgent } from '@/types/aiAgent';
import { agentCatalog } from '@/config/agentCatalog';
import { ArrowLeft, ArrowRight, Check, Lock, Loader2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface EmployeeRecommendationScreenProps {
  agent: AIAgent;
  alternativeAgents?: AIAgent[];
  whyPoints?: string[];
  recommendationSummary?: string;
  onTryDemo: () => void;
  onSelectDifferentAgent: (agent: AIAgent) => void;
  onBack?: () => void;
  saving?: boolean;
  saveError?: string | null;
  onClearError?: () => void;
}

// Crisp custom icons for capabilities
function CapabilityIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'chat':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 2v4" />
          <path d="M16 2v4" />
        </svg>
      );
    case 'grad_cap':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case 'funnel':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
      );
    case 'user':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'doc':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#000000' }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
  }
}

const defaultWhyPoints = [
  'Specifically designed for your industry workflow',
  'Addresses your selected operational needs effectively',
  'Equipped with automated 24/7 lead qualification and contact capture',
];

const CheckBullet = ({ text }: { text: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
    <div
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px',
      }}
    >
      <Check size={10} strokeWidth={3.5} color="#FFFFFF" />
    </div>
    <span style={{ fontSize: '0.75rem', color: '#4B5563', lineHeight: 1.35 }}>{text}</span>
  </div>
);

export default function EmployeeRecommendationScreen({
  agent,
  alternativeAgents = [],
  whyPoints = defaultWhyPoints,
  recommendationSummary,
  onTryDemo,
  onSelectDifferentAgent,
  onBack,
  saving = false,
  saveError = null,
  onClearError,
}: EmployeeRecommendationScreenProps) {
  const [showSelectorModal, setShowSelectorModal] = useState(false);

  const capabilitiesToDisplay =
    agent.detailedCapabilities && agent.detailedCapabilities.length > 0
      ? agent.detailedCapabilities
      : agent.capabilities.map((cap, i) => ({
          title: cap,
          subtitle: 'Automates customer communications with speed.',
          icon: ['chat', 'calendar', 'grad_cap', 'funnel', 'user', 'doc'][i % 6],
        }));

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
            maxWidth: '1040px',
            width: '100%',
            padding: '2.5rem 2.25rem 2rem 2.25rem',
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
            STEP 3 OF 5
          </div>

          {/* Headline & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem', maxWidth: '680px' }}>
            <h2
              className="font-display screen-headline"
              style={{
                fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)',
                fontWeight: 800,
                color: '#0A0A0A',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                marginBottom: '0.5rem',
              }}
            >
              Here&apos;s your recommended AI Agent
            </h2>
            <p
              className="screen-subtitle"
              style={{
                fontSize: '0.94rem',
                color: '#6B7280',
                lineHeight: 1.45,
              }}
            >
              {recommendationSummary ||
                'Based on your business type and needs, we recommend this AI Agent to help your business grow.'}
            </p>
          </div>

          {/* Main 3-Column Card Layout */}
          <div
            className="rec-grid"
            style={{ marginBottom: '1.5rem' }}
          >
            {/* Left Column: Portrait Photo */}
            <div
              className="rec-photo-col"
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#F3F4F6',
                minHeight: '340px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              }}
            >
              <Image
                src={agent.avatar || '/agents/admission_counselor.jpg'}
                alt={agent.role}
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 100vw, 260px"
              />

              {/* Status Pill Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.78)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#22C55E',
                    boxShadow: '0 0 8px #22C55E',
                    display: 'inline-block',
                  }}
                />
                Available 24/7
              </div>
            </div>

            {/* Middle Column: Agent Details & Capabilities */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                padding: '0.25rem 0',
              }}
            >
              {/* Top Pill Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                <span
                  style={{
                    background: '#111827',
                    color: '#FFFFFF',
                    fontSize: '0.63rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles size={11} color="#FBBF24" /> BEST MATCH
                </span>
                {agent.badge && (
                  <span
                    style={{
                      background: '#F3F4F6',
                      color: '#4B5563',
                      fontSize: '0.63rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '5px',
                    }}
                  >
                    {agent.badge}
                  </span>
                )}
              </div>

              {/* Role Title */}
              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
                  fontWeight: 800,
                  color: '#0A0A0A',
                  letterSpacing: '-0.02em',
                  marginBottom: '0.4rem',
                  lineHeight: 1.2,
                }}
              >
                {agent.role}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '0.84rem',
                  color: '#6B7280',
                  lineHeight: 1.45,
                  marginBottom: '1rem',
                }}
              >
                {agent.description}
              </p>

              {/* Divider */}
              <div style={{ width: '100%', height: '1px', background: '#EDEDED', marginBottom: '0.9rem' }} />

              {/* Capabilities Header */}
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  marginBottom: '0.8rem',
                }}
              >
                Can help your business with:
              </div>

              {/* 2-Column Capabilities Grid */}
              <div className="cap-grid">
                {capabilitiesToDisplay.map((cap) => (
                  <div key={cap.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: '#F8F9FA',
                        border: '1px solid #EDEDED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      <CapabilityIcon icon={cap.icon} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#0A0A0A',
                          lineHeight: 1.25,
                          marginBottom: '2px',
                        }}
                      >
                        {cap.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.71rem',
                          color: '#6B7280',
                          lineHeight: 1.35,
                        }}
                      >
                        {cap.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Why this AI Agent box & Actions */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              {/* Why this AI Agent Box */}
              <div
                style={{
                  background: '#F8F9FA',
                  border: '1px solid #EDEDED',
                  borderRadius: '16px',
                  padding: '1.2rem 1.1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#0A0A0A',
                    marginBottom: '0.85rem',
                  }}
                >
                  Why this AI Agent?
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {whyPoints.map((point) => (
                    <CheckBullet key={point} text={point} />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <motion.button
                  whileHover={!saving ? { scale: 1.02 } : {}}
                  whileTap={!saving ? { scale: 0.98 } : {}}
                  onClick={() => {
                    onClearError?.();
                    onTryDemo();
                  }}
                  disabled={saving}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#000000',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving&hellip;
                    </>
                  ) : (
                    <>
                      Try This AI Agent <ArrowRight size={15} />
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSelectorModal(true)}
                  disabled={saving}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    border: '1.5px solid #E5E7EB',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  Choose Another Agent
                </motion.button>
              </div>
            </div>
          </div>

          {/* Contextually Relevant Alternatives Section */}
          {alternativeAgents.length > 0 && (
            <div
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                background: '#FAFAFA',
                borderRadius: '14px',
                border: '1px solid #EDEDED',
                marginBottom: '1.5rem',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  marginBottom: '0.65rem',
                }}
              >
                Also Relevant For Your Workflow:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {alternativeAgents.map((alt) => (
                  <button
                    key={alt.id}
                    type="button"
                    onClick={() => onSelectDifferentAgent(alt)}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '0.4rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#111827',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000000';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>{alt.role}</span>
                    <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>• Select</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Navigation: Back & Continue to Demo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div className="action-btn-row">
              {/* Back Button */}
              {onBack && (
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
                    flexShrink: 0,
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </motion.button>
              )}

              {/* Continue to Demo Button */}
              <motion.button
                whileHover={!saving ? { scale: 1.02 } : {}}
                whileTap={!saving ? { scale: 0.98 } : {}}
                onClick={() => {
                  onClearError?.();
                  onTryDemo();
                }}
                disabled={saving}
                style={{
                  width: '210px',
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
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
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
                    Continue to Demo <ArrowRight size={16} />
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

      {/* Alternate Agent Selector Modal */}
      <AnimatePresence>
        {showSelectorModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => setShowSelectorModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                padding: '1.75rem',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0A0A0A' }}>
                    Select an AI Agent
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#6B7280' }}>
                    Choose any specialized AI persona to preview and demo for your business.
                  </p>
                </div>
                <button
                  onClick={() => setShowSelectorModal(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#F3F4F6',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
                {agentCatalog.map((catalogAgent) => {
                  const isSelected = catalogAgent.id === agent.id;
                  return (
                    <div
                      key={catalogAgent.id}
                      onClick={() => {
                        onSelectDifferentAgent(catalogAgent);
                        setShowSelectorModal(false);
                      }}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #000000' : '1.5px solid #EDEDED',
                        background: isSelected ? '#FAFAFA' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <div className="font-display" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0A0A0A' }}>
                          {catalogAgent.role}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: '#6B7280', lineHeight: 1.35, margin: 0 }}>
                        {catalogAgent.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
