'use client';

import { useState } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface FormData {
  name: string;
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  description: string;
}

const initial: FormData = { name: '', businessName: '', businessType: '', email: '', phone: '', description: '' };

export function ContactModal({ isOpen, onClose, title = 'Request AI Employee Consultation' }: { isOpen: boolean; onClose: () => void; title?: string }) {
  const [form, setForm] = useState<FormData>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1200));
    analytics.consultationRequested(form.businessType);
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setForm(initial); setSubmitted(false); setSubmitting(false); }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>Get Started</div>
            <h3 className="font-display" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'var(--bg-subtle)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '0.4rem', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h4 className="font-display" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Request Received!</h4>
              <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                Thank you, <strong>{form.name}</strong>. Our team will review your requirements and get in touch within 24 hours.
              </p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { id: 'name', label: 'Your Name *', type: 'text', placeholder: 'Rajesh Kumar', required: true },
                  { id: 'businessName', label: 'Business Name *', type: 'text', placeholder: 'Acme Pvt Ltd', required: true },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="input-label" htmlFor={f.id}>{f.label}</label>
                    <input id={f.id} name={f.id} type={f.type} required={f.required} placeholder={f.placeholder}
                      value={form[f.id as keyof FormData]} onChange={handleChange} className="input" />
                  </div>
                ))}
              </div>

              <div>
                <label className="input-label" htmlFor="businessType">Business Type *</label>
                <select id="businessType" name="businessType" required value={form.businessType} onChange={handleChange} className="input">
                  <option value="" disabled>Select your industry</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="restaurant">Restaurant / F&B</option>
                  <option value="professional_services">Professional Services</option>
                  <option value="retail">Retail / E-commerce</option>
                  <option value="technology">Technology / SaaS</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { id: 'email', label: 'Email Address *', type: 'email', placeholder: 'you@business.com', required: true },
                  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', required: false },
                ].map((f) => (
                  <div key={f.id}>
                    <label className="input-label" htmlFor={f.id}>{f.label}</label>
                    <input id={f.id} name={f.id} type={f.type} required={f.required} placeholder={f.placeholder}
                      value={form[f.id as keyof FormData]} onChange={handleChange} className="input" />
                  </div>
                ))}
              </div>

              <div>
                <label className="input-label" htmlFor="description">Describe the tasks you want help with *</label>
                <textarea id="description" name="description" required rows={4} className="input"
                  placeholder="e.g. We receive 50+ admission enquiries daily. We need help answering questions about courses, collecting student details, and following up with candidates..."
                  value={form.description} onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ justifyContent: 'center', fontSize: '0.92rem', padding: '0.85rem', marginTop: '0.25rem' }}
              >
                {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <>Request AI Employee Consultation <ArrowRight size={15} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomEmployee() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="contact" style={{ background: 'var(--bg)', padding: 'var(--section-pad) 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'center',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <span className="section-eyebrow">Custom Build</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
                Don't See Your Role?
                <br />
                <span style={{ color: 'var(--accent-text)' }}>Build a Custom AI Employee.</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>
                Tell us what repetitive tasks your team handles and we'll explore how a custom AI Employee can support your unique workflow.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                {['Role-specific design', 'Custom conversation flows', 'Integration-ready', 'Designed around your process'].map((point) => (
                  <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.87rem', color: 'var(--text-secondary)' }}>{point}</span>
                  </div>
                ))}
              </div>
              <button
                id="custom-employee-cta"
                className="btn btn-primary"
                style={{ fontSize: '0.95rem' }}
                onClick={() => setModalOpen(true)}
              >
                Describe Your Workflow <ArrowRight size={16} />
              </button>
            </div>

            {/* Right visual */}
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                CUSTOM AI EMPLOYEE
              </div>
              <div className="font-display" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                Built for your workflow.
              </div>
              {[
                { icon: '⚡', title: 'Role-Specific', desc: 'Designed around a single, specific business function' },
                { icon: '🔗', title: 'Fully Integrated', desc: 'Connects with your existing tools and systems' },
                { icon: '📈', title: 'Evolves with You', desc: 'Continuously improved based on your feedback' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.87rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <style>{`@media (max-width: 900px) { #contact > div > div { grid-template-columns: 1fr !important; padding: 2rem !important; } }`}</style>
    </>
  );
}
