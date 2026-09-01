'use client';

import { useState, useEffect, useMemo } from 'react';
import { AIEmployee } from '@/types';
import { AIAgent } from '@/types/aiAgent';
import { fetchDemoLeadForPrefill } from '@/services/enquiryService';
import { getDynamicQuestionsForIndustry } from '@/config/step5Questions';
import { getIndustryConfig } from '@/config/industries';
import { businessNeedsCatalog } from '@/config/businessNeeds';
import { ArrowLeft, ArrowRight, Check, Lock, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ResultsScreenProps {
  industryId: string;
  employee: AIEmployee;
  agent?: AIAgent;
  selectedNeeds?: string[];
  sessionId?: string | null;
  onSubmitLead: (leadData: {
    name: string;
    businessName: string;
    email: string;
    phone: string;
    notes: string;
    dynamicAnswers?: Record<string, any>;
  }) => Promise<void> | void;
  onBack?: () => void;
  submitting?: boolean;
  submitError?: string | null;
  onClearError?: () => void;
}

export default function ResultsScreen({
  industryId,
  employee,
  agent,
  selectedNeeds = [],
  sessionId,
  onSubmitLead,
  onBack,
  submitting = false,
  submitError = null,
  onClearError,
}: ResultsScreenProps) {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({});

  // Inline validation state
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic questions tailored to the selected industry
  const dynamicQuestions = useMemo(() => {
    return getDynamicQuestionsForIndustry(industryId || 'other');
  }, [industryId]);

  // Industry metadata
  const industryMeta = useMemo(() => {
    return getIndustryConfig(industryId || 'other');
  }, [industryId]);

  // Selected needs labels
  const selectedNeedLabels = useMemo(() => {
    return selectedNeeds
      .map((id) => businessNeedsCatalog.find((n) => n.id === id)?.label)
      .filter(Boolean) as string[];
  }, [selectedNeeds]);

  // ── Auto pre-fill from Step 4 demo lead if available ──────────
  useEffect(() => {
    if (!sessionId) return;
    fetchDemoLeadForPrefill(sessionId).then((lead) => {
      if (lead) {
        if (lead.name && !name) setName(lead.name);
        if (lead.phone && !phone) setPhone(lead.phone);
        if (lead.email && !email) setEmail(lead.email);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Dynamic capabilities bullets for left card
  const keyBenefits = agent?.capabilities && agent.capabilities.length > 0
    ? agent.capabilities.slice(0, 4)
    : employee.capabilities?.slice(0, 4) || [
        'Answers customer enquiries 24/7',
        'Captures & qualifies leads automatically',
        'Follows up with prospects instantly',
        'Customized around your business workflow',
      ];

  // Validation function
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!businessName.trim()) errs.businessName = 'Business name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address';
    }
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (phone.replace(/\D/g, '').length < 7) {
      errs.phone = 'Enter a valid phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, businessName: true, email: true, phone: true });

    if (!validate() || submitting) return;

    analytics.leadSubmitted(industryId, employee.role);
    await onSubmitLead({ name, businessName, email, phone, notes, dynamicAnswers });
  };

  return (
    <div className="screen-scroll-wrapper" style={{ padding: '1.5rem 1.5rem 2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.99 }}
        transition={{ duration: 0.3 }}
        style={{
          width: '100%',
          maxWidth: '1040px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          {/* Step Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
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
            STEP 5 OF 5
          </div>

          <h2
            className="font-display screen-headline"
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 800,
              color: '#0A0A0A',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              marginBottom: '0.45rem',
            }}
          >
            Build Your AI Agent
          </h2>
          <p
            className="screen-subtitle"
            style={{
              fontSize: '0.92rem',
              color: '#6B7280',
              lineHeight: 1.4,
            }}
          >
            Tell us a little about your business and we&apos;ll help design the right AI Agent workflow for you.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="results-layout">
          {/* === LEFT: AI Agent Summary Card === */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 18px -4px rgba(0,0,0,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Agent Photo */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                background: '#F3F4F6',
                overflow: 'hidden',
              }}
            >
              <Image
                src={employee.avatar || '/agents/admission_counselor.jpg'}
                alt={employee.role}
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                sizes="400px"
              />
              {/* Demo validated overlay badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(0,0,0,0.72)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={10} color="#22C55E" />
                Demo Validated
              </div>
            </div>

            <div style={{ padding: '1.25rem' }}>
              {/* Agent label & industry pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                <span
                  style={{
                    background: '#111827',
                    color: '#FFFFFF',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: '4px',
                  }}
                >
                  YOUR AI AGENT
                </span>
                <span
                  style={{
                    background: '#F3F4F6',
                    color: '#4B5563',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    borderRadius: '4px',
                  }}
                >
                  {industryMeta.label}
                </span>
              </div>

              {/* Agent Role */}
              <div
                className="font-display"
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#0A0A0A',
                  letterSpacing: '-0.015em',
                  marginBottom: '0.3rem',
                }}
              >
                {employee.role}
              </div>

              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#6B7280',
                  lineHeight: 1.45,
                  marginBottom: '1rem',
                }}
              >
                {employee.description}
              </p>

              {/* Selected Needs Badges */}
              {selectedNeedLabels.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.4rem',
                    }}
                  >
                    Tailored For Your Selected Needs:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {selectedNeedLabels.map((lbl) => (
                      <span
                        key={lbl}
                        style={{
                          background: '#F3F4F6',
                          color: '#374151',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB',
                        }}
                      >
                        ✓ {lbl}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div style={{ height: '1px', background: '#F3F4F6', marginBottom: '1rem' }} />

              {/* What it does */}
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#0A0A0A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.7rem',
                }}
              >
                Your AI Agent is ready to help with:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.1rem' }}>
                {keyBenefits.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
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
                        marginTop: '1px',
                      }}
                    >
                      <Check size={9} strokeWidth={3.5} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#374151', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.5rem',
                  borderTop: '1px solid #F3F4F6',
                  paddingTop: '1rem',
                }}
              >
                {[
                  { value: '24/7', label: 'Always On' },
                  { value: '<2s', label: 'Avg Response' },
                  { value: '100%', label: 'Customized' },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div
                      className="font-display"
                      style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0A0A0A', lineHeight: 1 }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: '#9CA3AF', marginTop: '2px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === RIGHT: Lead Capture Form with Dynamic Questions === */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #111827',
              boxShadow: '0 8px 32px -8px rgba(0,0,0,0.14)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Form Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                className="font-display"
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#0A0A0A',
                  letterSpacing: '-0.02em',
                  marginBottom: '0.35rem',
                }}
              >
                Ready to build your AI Agent?
              </div>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.4 }}>
                Fill in your details and our team will set up your custom AI Agent workflow within 24 hours.
              </p>
            </div>

            {/* Error banner if submission failed */}
            {submitError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                  fontSize: '0.78rem',
                  color: '#DC2626',
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {/* Name + Business Name */}
              <div className="form-row-2col">
                <div>
                  <label
                    htmlFor="build-name"
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.35rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Your Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="build-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (onClearError) onClearError();
                    }}
                    onBlur={() => handleBlur('name')}
                    style={{
                      width: '100%',
                      height: '42px',
                      border: touched.name && errors.name ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '0 0.85rem',
                      fontSize: '0.86rem',
                      color: '#111827',
                      outline: 'none',
                      fontFamily: 'inherit',
                      background: '#FAFAFA',
                      transition: 'border-color 0.15s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#111827'; e.target.style.background = '#FFFFFF'; }}
                  />
                  {touched.name && errors.name && (
                    <span style={{ fontSize: '0.68rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>
                      {errors.name}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="build-business"
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.35rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Business Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="build-business"
                    type="text"
                    required
                    placeholder="e.g. Apex Academy"
                    value={businessName}
                    onChange={(e) => {
                      setBusinessName(e.target.value);
                      if (onClearError) onClearError();
                    }}
                    onBlur={() => handleBlur('businessName')}
                    style={{
                      width: '100%',
                      height: '42px',
                      border: touched.businessName && errors.businessName ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '0 0.85rem',
                      fontSize: '0.86rem',
                      color: '#111827',
                      outline: 'none',
                      fontFamily: 'inherit',
                      background: '#FAFAFA',
                      transition: 'border-color 0.15s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#111827'; e.target.style.background = '#FFFFFF'; }}
                  />
                  {touched.businessName && errors.businessName && (
                    <span style={{ fontSize: '0.68rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>
                      {errors.businessName}
                    </span>
                  )}
                </div>
              </div>

              {/* Email + Phone */}
              <div className="form-row-2col">
                <div>
                  <label
                    htmlFor="build-email"
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.35rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Email Address <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="build-email"
                    type="email"
                    required
                    placeholder="you@business.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (onClearError) onClearError();
                    }}
                    onBlur={() => handleBlur('email')}
                    style={{
                      width: '100%',
                      height: '42px',
                      border: touched.email && errors.email ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '0 0.85rem',
                      fontSize: '0.86rem',
                      color: '#111827',
                      outline: 'none',
                      fontFamily: 'inherit',
                      background: '#FAFAFA',
                      transition: 'border-color 0.15s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#111827'; e.target.style.background = '#FFFFFF'; }}
                  />
                  {touched.email && errors.email && (
                    <span style={{ fontSize: '0.68rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="build-phone"
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.35rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    Phone Number <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="build-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (onClearError) onClearError();
                    }}
                    onBlur={() => handleBlur('phone')}
                    style={{
                      width: '100%',
                      height: '42px',
                      border: touched.phone && errors.phone ? '1.5px solid #EF4444' : '1.5px solid #E5E7EB',
                      borderRadius: '10px',
                      padding: '0 0.85rem',
                      fontSize: '0.86rem',
                      color: '#111827',
                      outline: 'none',
                      fontFamily: 'inherit',
                      background: '#FAFAFA',
                      transition: 'border-color 0.15s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#111827'; e.target.style.background = '#FFFFFF'; }}
                  />
                  {touched.phone && errors.phone && (
                    <span style={{ fontSize: '0.68rem', color: '#EF4444', marginTop: '2px', display: 'block' }}>
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Dynamic Context Questions Tailored to Industry */}
              {dynamicQuestions.map((q) => (
                <div key={q.id}>
                  <label
                    htmlFor={`dyn-${q.id}`}
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '0.35rem',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {q.label}
                  </label>
                  {q.type === 'select' && q.options ? (
                    <select
                      id={`dyn-${q.id}`}
                      value={dynamicAnswers[q.id] || ''}
                      onChange={(e) =>
                        setDynamicAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      style={{
                        width: '100%',
                        height: '42px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '10px',
                        padding: '0 0.85rem',
                        fontSize: '0.86rem',
                        color: '#111827',
                        outline: 'none',
                        fontFamily: 'inherit',
                        background: '#FAFAFA',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">Select an option (Optional)</option>
                      {q.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`dyn-${q.id}`}
                      type="text"
                      placeholder={q.placeholder || 'Your response...'}
                      value={dynamicAnswers[q.id] || ''}
                      onChange={(e) =>
                        setDynamicAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      style={{
                        width: '100%',
                        height: '42px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '10px',
                        padding: '0 0.85rem',
                        fontSize: '0.86rem',
                        color: '#111827',
                        outline: 'none',
                        fontFamily: 'inherit',
                        background: '#FAFAFA',
                        boxSizing: 'border-box',
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Additional Notes */}
              <div>
                <label
                  htmlFor="build-notes"
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.35rem',
                    letterSpacing: '0.01em',
                  }}
                >
                  Tell us anything specific about your business or workflow{' '}
                  <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(Optional)</span>
                </label>
                <textarea
                  id="build-notes"
                  rows={2}
                  placeholder="Tell us anything specific about your business or workflow..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '0.65rem 0.85rem',
                    fontSize: '0.84rem',
                    color: '#111827',
                    outline: 'none',
                    fontFamily: 'inherit',
                    background: '#FAFAFA',
                    transition: 'border-color 0.15s ease',
                    resize: 'none',
                    boxSizing: 'border-box',
                    lineHeight: 1.5,
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#111827'; e.target.style.background = '#FFFFFF'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA'; }}
                />
              </div>

              {/* Trust badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  'No credit card required',
                  'Setup within 24 hours',
                  'Free consultation included',
                ].map((trust) => (
                  <div key={trust} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Check size={12} color="#22C55E" strokeWidth={3} />
                    <span style={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 500 }}>{trust}</span>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.015 } : {}}
                whileTap={!submitting ? { scale: 0.985 } : {}}
                style={{
                  width: '100%',
                  height: '50px',
                  borderRadius: '12px',
                  background: submitting ? '#6B7280' : '#111827',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: submitting ? 'none' : '0 6px 20px rgba(0,0,0,0.18)',
                  transition: 'background 0.2s ease, box-shadow 0.2s ease',
                  marginTop: 'auto',
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Build My AI Agent <ArrowRight size={17} />
                  </>
                )}
              </motion.button>

              {/* Privacy note */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  fontSize: '0.7rem',
                  color: '#9CA3AF',
                }}
              >
                <Lock size={11} color="#9CA3AF" />
                <span>Your information is secure and will never be shared.</span>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Back button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1.5rem',
          }}
        >
          {onBack && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              disabled={submitting}
              style={{
                height: '44px',
                paddingLeft: '1.25rem',
                paddingRight: '1.5rem',
                borderRadius: '12px',
                background: '#FFFFFF',
                color: '#374151',
                border: '1.5px solid #E5E7EB',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              <ArrowLeft size={16} /> Back to Demo
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
