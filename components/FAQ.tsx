'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What is an AI Employee?',
    answer: 'An AI Employee is an AI-powered digital worker designed to perform specific business tasks such as answering enquiries, capturing leads, supporting customers, or coordinating appointments. Unlike generic chatbots, AI Employees are designed around a specific business role and workflow.',
  },
  {
    question: 'Will an AI Employee replace my staff?',
    answer: 'No. AI Employees are designed to support teams by handling repetitive and routine tasks — freeing your people to focus on higher-value work. The goal is to augment your team, not replace human judgment, relationships, or skilled professional work.',
  },
  {
    question: 'How long does implementation take?',
    answer: 'Implementation time depends on the complexity of the workflow and any integrations required. A straightforward AI Receptionist or Customer Support assistant can typically be set up and tested within a few weeks. More complex workflows with CRM integrations may take longer.',
  },
  {
    question: 'Can the AI Employee be customized for my business?',
    answer: 'Yes. Every AI Employee is designed around your business workflows, language, tone, and requirements. We work closely with you to understand your processes before building anything.',
  },
  {
    question: 'Which platforms can it work on?',
    answer: 'Depending on the implementation, AI Employees may be integrated with your website, messaging platforms (WhatsApp, etc.), CRM systems, email, and other business tools. We assess your existing stack during consultation.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Pricing depends on the AI Employee role, complexity, required integrations, and ongoing support needs. We offer a consultation to understand your requirements and provide a clear, transparent proposal.',
  },
  {
    question: 'Is this suitable for small businesses?',
    answer: 'Absolutely. Many of our clients are growing businesses and SMEs. We design AI Employees that are practical, focused, and scalable — not enterprise-only platforms. You can start small with one focused AI Employee and expand over time.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: 'var(--bg)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1rem' }}>
            Common Questions.
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Everything you need to know about AI Employees.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <button
                id={`faq-${i}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1.35rem 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span
                  className="font-display"
                  style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}
                >
                  {faq.question}
                </span>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1.5px solid var(--border-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    background: openIndex === i ? 'var(--text-primary)' : 'transparent',
                    borderColor: openIndex === i ? 'var(--text-primary)' : 'var(--border-hover)',
                  }}
                >
                  {openIndex === i
                    ? <Minus size={12} color="white" />
                    : <Plus size={12} style={{ color: 'var(--text-muted)' }} />
                  }
                </div>
              </button>

              <div
                style={{
                  maxHeight: openIndex === i ? '400px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}
              >
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    paddingBottom: '1.25rem',
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
