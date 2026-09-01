'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { analytics } from '@/lib/analytics';

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'AI Employees', href: '#employees' },
  { label: 'Industries', href: '#industries' },
  { label: 'Why Arhan', href: '#why-arhan' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(255,255,255,0.95)' : '#FFFFFF',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'var(--border)'}`,
          transition: 'all 0.2s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: 0 }}
          >
            {/* Logo mark */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white"/>
                <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity="0.5"/>
                <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white"/>
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div
                className="font-display"
                style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)', letterSpacing: '0.01em', lineHeight: 1.2 }}
              >
                ARHAN ENTERPRISES
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                AI WORKFORCE
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.25rem' }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.87rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-subtle)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'none';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-ghost"
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
              onClick={() => { analytics.navCTAClick('book_demo'); scrollTo('#contact'); }}
            >
              Book a Demo
            </button>
            <button
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
              onClick={() => { analytics.navCTAClick('build'); scrollTo('#discover'); }}
            >
              Build Your AI Employee
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              padding: '0.4rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            zIndex: 99,
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1rem 2rem 1.5rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  padding: '0.7rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => { analytics.navCTAClick('book_demo'); scrollTo('#contact'); }}>
              Book a Demo
            </button>
            <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => { analytics.navCTAClick('build'); scrollTo('#discover'); }}>
              Build Your AI Employee
            </button>
          </div>
        </div>
      )}
    </>
  );
}
