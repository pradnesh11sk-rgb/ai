import React from 'react';
import { Shield, Target, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onStartScan: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartScan }) => {
  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            marginBottom: '14px'
          }}>
            <Shield size={14} color="#06b6d4" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em' }}>
              OUR MISSION & PURPOSE
            </span>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '14px' }}>
            About TRUSTWALL
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#38bdf8', fontWeight: 600 }}>
            “Protect what you send. Verify what you receive.”
          </p>
        </div>

        {/* The Problem & The Mission */}
        <div className="grid-2" style={{ marginBottom: '36px' }}>
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Target size={22} color="#f87171" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              The Problem
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
              <strong style={{ color: '#ffffff' }}>“AI adoption is growing faster than AI security awareness.”</strong>
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Every day, employees inadvertently paste sensitive customer emails, API keys, intellectual property, and payment information into public and private LLMs. Simultaneously, adversarial actors exploit prompt injection and jailbreak payloads to bypass safeguards.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Shield size={22} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
              TrustWall’s Mission
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
              <strong style={{ color: '#ffffff' }}>
                “To create a safer layer between humans and AI by making privacy risks, security threats, and trust signals visible before users make decisions.”
              </strong>
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              TrustWall acts as an intelligent firewall checkpoint: scanning inbound prompts for privacy and injection vectors, offering instant redaction, and auditing model responses for factual grounding and reliability.
            </p>
          </div>
        </div>

        {/* The Three Pillars Progression */}
        <div className="glass-panel" style={{ padding: '36px', marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>Core Philosophy</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
              Privacy → Security → Trust
            </h3>
          </div>

          <div className="grid-3">
            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#06b6d4', marginBottom: '6px' }}>
                1. Privacy
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Protect what you send. Identify PII, credentials, and corporate secrets before inference tokens are transmitted.
              </p>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171', marginBottom: '6px' }}>
                2. Security
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Neutralize adversarial instructions. Block jailbreaks, prompt injections, and privilege escalations deterministically.
              </p>
            </div>

            <div style={{
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginBottom: '6px' }}>
                3. Trust
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Verify what you receive. Evaluate response heuristics, measure factual grounding, and generate verifiable Trust Passports.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div style={{
          textAlign: 'center',
          padding: '36px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
            Ready to secure your AI workflows?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: '20px' }}>
            Try TrustWall's interactive scanner and test your own prompts or test vectors right now.
          </p>
          <button
            onClick={onStartScan}
            className="btn btn-primary btn-lg"
          >
            <Shield size={18} />
            <span>Launch TrustWall Scanner</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
