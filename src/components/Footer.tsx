import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(6, 8, 15, 0.95)',
      padding: '48px 0 32px',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '32px',
          marginBottom: '36px'
        }}>
          {/* Brand Info */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={18} color="#06b6d4" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                TRUSTWALL
              </span>
              <span className="badge badge-cyan" style={{ fontSize: '0.625rem' }}>
                THE AI FIREWALL
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
              “Don't just deploy AI. Prove you can trust it.” A zero-trust defensive security, app inspection, and privacy enclave between humans and generative intelligence.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span className="pulse-dot dot-emerald" />
              <span>TrustWall Autonomous Enclave v3.0 • Cryptographic Attestation Active</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
                Platform
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                <a 
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  Overview & Pipeline
                </a>
                <a 
                  onClick={() => { setActiveTab('scanner'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  AI Security Scanner
                </a>
                <a 
                  onClick={() => { setActiveTab('integrations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  App Inspector & Trust
                </a>
                <a 
                  onClick={() => { setActiveTab('passport'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  Trust Passport
                </a>
                <a 
                  onClick={() => { setActiveTab('security-center'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  Security Center
                </a>
                <a 
                  onClick={() => { setActiveTab('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  Profile & Account
                </a>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', marginBottom: '14px' }}>
                Governance
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
                <a 
                  onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  Privacy by Design
                </a>
                <a 
                  onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ color: 'var(--text-secondary)', textDecoration: 'none', cursor: 'pointer' }}
                >
                  Mission & Problem
                </a>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                  Zero Persistent Storage
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Compliance & Trust Badges */}
        <div style={{
          padding: '24px 0',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          {['SOC2 TYPE II CERTIFIED', 'ISO/IEC 27001 AUDITED', 'HIPAA SECURITY COMPLIANT', 'EU AI ACT ART. 9 & 15', 'ZERO-KNOWLEDGE PROOF VERIFIED'].map(badge => (
            <div key={badge} style={{
              padding: '6px 12px',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              background: 'rgba(139, 92, 246, 0.08)',
              borderRadius: '6px',
              color: '#c084fc',
              fontSize: '0.6875rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Shield size={12} />
              {badge}
            </div>
          ))}
        </div>

        {/* Ethical / Defensive Security Disclaimer */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            TrustWall is a military-grade defensive security intelligence framework. All demonstration vectors use harmless synthetic benchmarks.
          </div>
          <div>
            © {new Date().getFullYear()} TRUSTWALL — The AI Firewall. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
