import React from 'react';
import { 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  AlertOctagon
} from 'lucide-react';
import type { PromptScanResult, ProtectedPromptResult } from '../../shared/types';

interface RemediationPipelineProps {
  originalPrompt: string;
  scanResult: PromptScanResult;
  protectedResult: ProtectedPromptResult | null;
  onProtectPrompt: () => void;
  isProtecting: boolean;
}

export const RemediationPipeline: React.FC<RemediationPipelineProps> = ({
  originalPrompt,
  scanResult,
  protectedResult,
  onProtectPrompt,
  isProtecting
}) => {
  const isBlocked = scanResult.hasThreats;
  const isRedactionNeeded = scanResult.hasSensitiveData && !scanResult.hasThreats;
  const isClean = !scanResult.hasThreats && !scanResult.hasSensitiveData;

  const decision = isBlocked 
    ? {
        label: 'GATEWAY DECISION: BLOCKED (Adversarial Vector Detected)',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        border: 'rgba(239, 68, 68, 0.35)',
        icon: AlertOctagon,
        summary: 'Inbound prompt contains direct system override or code execution instructions. Dispatched payload would compromise system prompt integrity.'
      }
    : isRedactionNeeded
    ? {
        label: 'GATEWAY DECISION: REDACT & FORWARD (Sensitive Data Quarantined)',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.35)',
        icon: EyeOff,
        summary: 'Inbound prompt contains PII or API credentials. Forwarding permitted only after zero-knowledge cryptographic token replacement.'
      }
    : {
        label: 'GATEWAY DECISION: ALLOWED (Clean Prompt)',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        border: 'rgba(16, 185, 129, 0.35)',
        icon: CheckCircle2,
        summary: 'Passed all 18 OWASP LLM heuristic checkpoints. Clean prompt safe for direct AI model ingestion.'
      };

  const DecisionIcon = decision.icon;

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      marginBottom: '28px',
      border: `1.5px solid ${decision.border}`,
      background: 'rgba(15, 23, 42, 0.65)'
    }}>
      {/* Top Gateway Decision Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: decision.bg,
            border: `1px solid ${decision.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <DecisionIcon size={22} color={decision.color} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: decision.color, letterSpacing: '0.02em' }}>
              {decision.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '640px' }}>
              {decision.summary}
            </div>
          </div>
        </div>

        {!protectedResult && (isBlocked || isRedactionNeeded) && (
          <button
            type="button"
            onClick={onProtectPrompt}
            disabled={isProtecting}
            className="btn btn-emerald btn-sm"
          >
            <Lock size={14} />
            <span>{isProtecting ? 'Sanitizing...' : 'Execute Remediation Pipeline'}</span>
          </button>
        )}
      </div>

      {/* 4-Step Remediation Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '20px'
      }}>
        {/* Step 1: Input Received */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            1. Inbound Prompt
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', margin: '4px 0 8px' }}>
            Raw Payload
          </div>
          <div style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '8px',
            borderRadius: '4px',
            maxHeight: '90px',
            overflowY: 'auto'
          }}>
            {originalPrompt.slice(0, 180)}...
          </div>
        </div>

        {/* Step 2: Issues Identified */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            2. Heuristic Violations
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: isBlocked ? '#f87171' : isRedactionNeeded ? '#fbbf24' : '#34d399', margin: '4px 0 8px' }}>
            {scanResult.threatsCount + scanResult.piiCount} Trigger(s) Found
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {scanResult.detectedThreats.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ef4444' }}>•</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{t.title}</span>
              </div>
            ))}
            {scanResult.detectedPII.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#f59e0b' }}>•</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{p.label}</span>
              </div>
            ))}
            {isClean && <span style={{ color: '#34d399' }}>✓ Zero violations found</span>}
          </div>
        </div>

        {/* Step 3: Transformation Justification */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            3. Remediation Justification
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#38bdf8', margin: '4px 0 8px' }}>
            Action & Why
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {isBlocked && (
              <span>Adversarial prompt injection pattern stripped or encapsulated to prevent execution hijack.</span>
            )}
            {isRedactionNeeded && (
              <span>Personal identifiers and API credentials replaced with one-way masked tokens to protect enterprise privacy.</span>
            )}
            {isClean && (
              <span>No transformations required. Safe for immediate execution.</span>
            )}
          </div>
        </div>

        {/* Step 4: Output Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px'
        }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            4. Egress State
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: protectedResult ? '#34d399' : '#94a3b8', margin: '4px 0 8px' }}>
            {protectedResult ? 'Sanitized & Sealed' : isClean ? 'Ready to Send' : 'Awaiting Remediation'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {protectedResult 
              ? `${protectedResult.redactionsCount} item(s) masked, ${protectedResult.blockedThreatsCount} threat(s) neutralized.`
              : isClean
              ? 'Zero redactions needed.'
              : 'Click "Execute Remediation Pipeline" to sanitize payload.'}
          </div>
        </div>
      </div>
    </div>
  );
};
