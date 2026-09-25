import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Lock, 
  Shield
} from 'lucide-react';
import type { TrustPassportData } from '../../shared/types';

interface TrustPassportProps {
  passportData: TrustPassportData | null;
  onExportReport: () => void;
  onNewScan: () => void;
}

export const TrustPassport: React.FC<TrustPassportProps> = ({
  passportData,
  onExportReport,
  onNewScan
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  // Default demo passport if none has been generated in the current session
  const data: TrustPassportData = passportData || {
    passportId: 'TP-PRIVORA-2048-SEC',
    scanId: 'PW-2048',
    timestamp: new Date().toISOString(),
    clientOrigin: 'Privora Secure Client Gateway v2.4',
    modelEvaluated: 'privora-guard-sim-gpt4o',
    privacyScore: 94,
    securityScore: 92,
    reliabilityScore: 86,
    overallTrustScore: 91,
    threatLevel: 'LOW',
    promptStatus: 'PROTECTED_SANITIZED',
    privacyEventsProtected: 2,
    threatsBlocked: 1,
    recommendationText: 'SAFE TO PROCEED WITH CAUTION — All inbound PII masked and adversarial vectors quarantined.',
    cryptographicSignature: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(data.cryptographicSignature);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const getThreatBadge = (level: string) => {
    switch (level) {
      case 'SAFE':
      case 'LOW':
        return { label: '🟢 LOW THREAT', class: 'badge-safe' };
      case 'MEDIUM':
        return { label: '🟠 MEDIUM THREAT', class: 'badge-medium' };
      case 'HIGH':
      case 'CRITICAL':
        return { label: '🔴 HIGH THREAT', class: 'badge-high' };
      default:
        return { label: '🟢 SAFE', class: 'badge-safe' };
    }
  };

  const threatBadgeInfo = getThreatBadge(data.threatLevel);

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan">Verification Record</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Audited & Digitally Sealed
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              AI Trust Passport
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              The cryptographic proof of safety and privacy adherence between your query and the AI system.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onNewScan}
              className="btn btn-secondary btn-sm"
            >
              <Shield size={14} />
              <span>New Scan</span>
            </button>
            <button
              onClick={onExportReport}
              className="btn btn-primary btn-sm"
              id="export-passport-top-btn"
            >
              <Download size={14} />
              <span>Export / Print Report</span>
            </button>
          </div>
        </div>

        {/* The Signature Passport Card */}
        <div 
          className="glass-panel printable-card"
          style={{
            padding: '36px',
            border: '1.5px solid rgba(6, 182, 212, 0.4)',
            background: 'linear-gradient(145deg, #0c1220 0%, #070a12 100%)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 182, 212, 0.15)',
            position: 'relative'
          }}
        >
          {/* Holographic Top Border Accents */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #06b6d4, #10b981, #8b5cf6, #06b6d4)',
            backgroundSize: '200% 100%'
          }} />

          {/* Passport Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '24px',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
                border: '1.5px solid rgba(6, 182, 212, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
              }}>
                <ShieldCheck size={32} color="#06b6d4" />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '0.04em'
                  }}>
                    PRIVORA TRUST PASSPORT
                  </span>
                  <span className="badge badge-safe">
                    ✓ VERIFIED
                  </span>
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  marginTop: '2px'
                }}>
                  SCAN #{data.scanId} • PASSPORT ID: {data.passportId}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Issued Timestamp
              </div>
              <div style={{ fontSize: '0.875rem', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                {new Date(data.timestamp).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                Gateway: {data.clientOrigin}
              </div>
            </div>
          </div>

          {/* Tri-Metric Score Display */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* Privacy Score Card */}
            <div style={{
              background: 'rgba(6, 182, 212, 0.06)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Privacy Score
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#38bdf8',
                lineHeight: 1.1,
                marginTop: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                {data.privacyScore}<span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '6px' }}>
                ✓ PII & Secrets Quarantined
              </div>
            </div>

            {/* Security Score Card */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Security Score
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#34d399',
                lineHeight: 1.1,
                marginTop: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                {data.securityScore}<span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '6px' }}>
                ✓ Injection Vectors Blocked
              </div>
            </div>

            {/* Reliability Score Card */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Reliability Score
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#fbbf24',
                lineHeight: 1.1,
                marginTop: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                {data.reliabilityScore}<span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fef3c7', marginTop: '6px' }}>
                ✓ Grounded Output Bounds
              </div>
            </div>

            {/* Overall Composite Score */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1.5px solid rgba(139, 92, 246, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>
                Composite Trust Index
              </div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                marginTop: '4px',
                fontFamily: 'var(--font-mono)'
              }}>
                {data.overallTrustScore}<span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-muted)' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '6px' }}>
                Weighted Security Matrix
              </div>
            </div>
          </div>

          {/* Audit Data Table */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '28px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '18px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Threat Level
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span className={`badge ${threatBadgeInfo.class}`} style={{ fontSize: '0.8125rem' }}>
                    {threatBadgeInfo.label}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Privacy Events
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                  {data.privacyEventsProtected} identifiers protected
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Security Events
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                  {data.threatsBlocked} injection vector(s) blocked
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Prompt Status
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
                  {data.promptStatus === 'PROTECTED_SANITIZED' ? '🟢 Protected & Sanitized' : '🟡 Raw Evaluated'}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Banner */}
          <div style={{
            padding: '18px 20px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '28px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Final Security Recommendation
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
              {data.recommendationText}
            </div>
          </div>

          {/* Cryptographic Proof Signature Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={16} color="#38bdf8" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                Sig: {data.cryptographicSignature.slice(0, 36)}...
              </span>
              <button
                onClick={handleCopyHash}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  padding: '2px 6px'
                }}
                title="Copy cryptographic signature"
              >
                {copiedHash ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={onExportReport}
                className="btn btn-secondary btn-sm"
              >
                <Printer size={14} />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={onExportReport}
                className="btn btn-primary btn-sm"
              >
                <Download size={14} />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
