import React from 'react';
import { Lock, EyeOff, Server, FileCode, DatabaseZap, UserCheck } from 'lucide-react';

export const PrivacyByDesign: React.FC = () => {
  const principles = [
    {
      icon: EyeOff,
      title: 'Zero Permanent Storage',
      desc: 'User prompts and AI responses are processed purely in ephemeral RAM. We do not store queries into persistent databases by default.'
    },
    {
      icon: Lock,
      title: 'Sensitive Value Masking',
      desc: 'All detected personal identifiers (emails, phone numbers, SSNs) and API credentials are masked before prompt dispatch or logging.'
    },
    {
      icon: Server,
      title: 'No Real Credentials Required',
      desc: 'Privora requires zero production API keys or passwords to evaluate prompt safety. All demonstration vectors use synthetic tokens.'
    },
    {
      icon: DatabaseZap,
      title: 'Minimal Data Exposure',
      desc: 'Security analysis and threat detection are performed deterministically with zero secondary model retraining on client submissions.'
    },
    {
      icon: UserCheck,
      title: 'Granular User Control',
      desc: 'Users explicitly preview, inspect, and approve the protected sanitized prompt before electing to dispatch it to downstream AI systems.'
    },
    {
      icon: FileCode,
      title: 'Defense-in-Depth Architecture',
      desc: 'Two independent firewall gates: Ingress Prompt Shield (pre-inference) and Egress Trust Verifier (post-inference).'
    }
  ];

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '14px'
          }}>
            <Lock size={14} color="#10b981" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#34d399', letterSpacing: '0.04em' }}>
              DEFENSIVE PRIVACY ARCHITECTURE
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Privacy by Design
          </h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            We minimize what we collect. Privora is built from the ground up on the principle of minimal data exposure.
          </p>

          {/* Prominent Retention Indicator */}
          <div style={{
            marginTop: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: 'var(--radius-md)'
          }}>
            <span className="pulse-dot dot-emerald" />
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff' }}>
              Data Retention Status:
            </span>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#38bdf8',
              fontFamily: 'var(--font-mono)'
            }}>
              Minimal (In-Memory Ephemeral Only)
            </span>
          </div>
        </div>

        {/* 6 Core Principles Cards */}
        <div className="grid-2" style={{ marginBottom: '40px' }}>
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Icon size={20} color="#06b6d4" />
                </div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                  {p.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture Table */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Technical Privacy Guarantees
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>Client Ingress Encryption</span>
              <span className="badge badge-safe">TLS 1.3 / Strict-Transport-Security</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>Session State Management</span>
              <span className="badge badge-cyan">Zero-Database In-Memory Lifecycle</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>Third-Party LLM Privacy</span>
              <span className="badge badge-safe">Pre-Redacted Masked Tokens Only</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>Security Header Enforcement</span>
              <span className="badge badge-cyan">nosniff • DENY • X-XSS-Protection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
