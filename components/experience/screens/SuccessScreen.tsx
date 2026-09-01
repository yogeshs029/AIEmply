'use client';

import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuccessScreenProps {
  onRestart: () => void;
  customerName?: string | null;
  businessType?: string | null;
  agentRole?: string | null;
  selectedNeeds?: string[];
}

const successPoints = [
  'Our team will review your business requirements',
  'A specialist will contact you within 24 hours',
  "We'll design your AI Agent around your workflow",
  'Go live in as little as 48 hours',
];

function formatLabel(str: string): string {
  return str
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function SuccessScreen({
  onRestart,
  customerName,
  businessType,
  agentRole,
  selectedNeeds = [],
}: SuccessScreenProps) {
  const firstName = customerName ? customerName.trim().split(' ')[0] : null;

  return (
    <div className="screen-scroll-wrapper" style={{ padding: '2rem 1.5rem 3rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: '640px',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, duration: 0.45, type: 'spring', stiffness: 220, damping: 18 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.75rem',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
          }}
        >
          {/* Animated checkmark */}
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline
              points="20 6 9 17 4 12"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 0,
                animation: 'draw-check 0.45s ease-out 0.35s both',
              }}
            />
          </svg>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.2rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #E5E7EB',
              background: '#F9FAFB',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#6B7280',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            REQUEST RECEIVED
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
              fontWeight: 800,
              color: '#0A0A0A',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              marginBottom: '0.75rem',
            }}
          >
            Your AI Agent is<br />Being Built! 🎉
          </h2>

          <p
            style={{
              fontSize: '0.95rem',
              color: '#6B7280',
              lineHeight: 1.65,
              maxWidth: '480px',
              marginBottom: '1.75rem',
            }}
          >
            {firstName ? `Thanks, ${firstName}.` : 'Thank you!'} We&apos;ve received your request for an{' '}
            <strong>AI {agentRole || 'Agent'}</strong>. Our team will review your business workflow and help determine how your AI Agent can be implemented.
          </p>
        </motion.div>

        {/* Request Summary Box */}
        {(businessType || agentRole || selectedNeeds.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.35 }}
            style={{
              width: '100%',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {businessType && (
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Business
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                  {formatLabel(businessType)}
                </div>
              </div>
            )}

            {agentRole && (
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  AI Agent
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                  {agentRole}
                </div>
              </div>
            )}

            {selectedNeeds.length > 0 && (
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Needs
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                  {selectedNeeds.slice(0, 3).map(formatLabel).join(', ')}
                  {selectedNeeds.length > 3 ? ` +${selectedNeeds.length - 3}` : ''}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* What happens next card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.35 }}
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '20px',
            padding: '1.5rem 1.75rem',
            width: '100%',
            textAlign: 'left',
            boxShadow: '0 4px 18px -4px rgba(0,0,0,0.07)',
            marginBottom: '1.75rem',
          }}
        >
          <div
            className="font-display"
            style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: '#0A0A0A',
              marginBottom: '1.1rem',
              letterSpacing: '-0.01em',
            }}
          >
            What happens next:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {successPoints.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.28 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
              >
                {/* Step number circle */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#111827',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.45 }}>{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Restart button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#FFFFFF',
              border: '1.5px solid #E5E7EB',
              borderRadius: '12px',
              padding: '0.7rem 1.5rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#374151',
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              transition: 'border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#111827';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.color = '#374151';
            }}
          >
            <RotateCcw size={15} />
            Start a New Discovery
          </motion.button>

          <p style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
            Want to explore another AI Agent? Start over anytime.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
