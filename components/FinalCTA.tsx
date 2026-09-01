'use client';

import { useState } from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { ContactModal } from '@/components/CustomEmployee';
import { analytics } from '@/lib/analytics';

export default function FinalCTA() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section
        style={{
          background: 'var(--bg-dark)',
          padding: 'var(--section-pad) 0',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              display: 'block',
              marginBottom: '1.5rem',
            }}
          >
            Get Started
          </span>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            Your First AI Employee
            <br />
            Could Start Here.
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75,
              maxWidth: '500px',
              margin: '0 auto 3rem',
            }}
          >
            Discover how an AI-powered digital employee can support your business,
            reduce workload, and respond to your customers around the clock.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
            <button
              id="final-cta-primary"
              className="btn-dark-primary"
              style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
              onClick={() => { analytics.finalCTAClick('primary'); setModalOpen(true); }}
            >
              Build My AI Employee <ArrowRight size={18} />
            </button>
            <button
              id="final-cta-secondary"
              className="btn-dark-secondary"
              style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}
              onClick={() => { analytics.finalCTAClick('secondary'); setModalOpen(true); }}
            >
              <Calendar size={16} /> Book a Consultation
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
            No commitment required. We'll start with a conversation about your business.
          </p>
        </div>
      </section>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Build Your AI Employee"
      />
    </>
  );
}
