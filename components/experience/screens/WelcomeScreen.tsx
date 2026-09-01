'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
        textAlign: 'center',
        zIndex: 10,
        position: 'relative',
      }}
    >
      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="label-pill"
        style={{ marginBottom: '1.75rem' }}
      >
        <span className="status-dot" />
        <span>INTERACTIVE PRODUCT EXPERIENCE</span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="section-title font-display"
        style={{
          fontSize: 'clamp(2.75rem, 6.5vw, 4.75rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1.08,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          maxWidth: '850px',
        }}
      >
        Build Your
        <br />
        <span style={{ borderBottom: '4px solid var(--accent)', paddingBottom: '2px', display: 'inline-block' }}>
          AI Workforce.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="section-subtitle"
        style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: '520px',
          marginBottom: '2.5rem',
        }}
      >
        Let's find the right AI Employee for your business and try a live interactive demonstration.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ delay: 0.25, duration: 0.2 }}
        id="welcome-get-started"
        className="btn btn-primary"
        style={{
          fontSize: '1.05rem',
          padding: '0.95rem 2.25rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
        }}
        onClick={onStart}
      >
        Get Started <ArrowRight size={18} />
      </motion.button>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
      >
        {['No setup required', 'Interactive live demo', 'Tailored to your business'].map((item) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
