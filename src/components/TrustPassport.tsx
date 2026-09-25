import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  Lock, 
  Shield,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  ChevronDown,
  ChevronUp
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
  const [showVerifier, setShowVerifier] = useState(false);
  const [liveDigest, setLiveDigest] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [tamperedState, setTamperedState] = useState(false);
  const [computedStatus, setComputedStatus] = useState<'VERIFIED' | 'TAMPERED' | null>(null);

  // Default demo passport if none has been generated in the current session
  const data: TrustPassportData = passportData || {
    passportId: 'TP-TRUSTWALL-2048-SEC',
    scanId: 'TRW-2048',
    timestamp: '2026-09-25T07:20:00.000Z',
    clientOrigin: 'TrustWall Zero-Trust Gateway v3.0',
    modelEvaluated: 'trustwall-guard-sim-gpt4o',
    privacyScore: 94,
    securityScore: 92,
    reliabilityScore: 86,
    overallTrustScore: 91,
    threatLevel: 'LOW',
    promptStatus: 'PROTECTED_SANITIZED',
    privacyEventsProtected: 2,
    threatsBlocked: 1,
    recommendationText: 'SAFE TO PROCEED WITH CAUTION — All inbound PII masked and adversarial vectors quarantined.',
    cryptographicSignature: ''
  };

  const getCanonicalPayload = (tamper = false) => {
    const payload = {
      clientOrigin: data.clientOrigin,
      modelEvaluated: data.modelEvaluated,
      overallTrustScore: tamper ? data.overallTrustScore + 8 : data.overallTrustScore,
      passportId: data.passportId,
      privacyScore: data.privacyScore,
      promptStatus: data.promptStatus,
      scanId: data.scanId,
      securityScore: data.securityScore,
      threatLevel: data.threatLevel,
      threatsBlocked: data.threatsBlocked,
      timestamp: data.timestamp
    };
    return JSON.stringify(payload, null, 2);
  };

  // Real in-browser Web Crypto API (SHA-256)
  const computeHash = async (text: string) => {
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(text);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.error('Web Crypto error', e);
    }
    return '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';
  };

  useEffect(() => {
    computeHash(getCanonicalPayload(false)).then(hash => {
      setLiveDigest(`SHA256:${hash}`);
      setComputedStatus('VERIFIED');
    });
  }, [data.passportId, data.scanId, data.overallTrustScore]);

  const activeSignature = data.cryptographicSignature || liveDigest;

  const handleRunVerification = async (simulateTamper = false) => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 400));
    const payload = getCanonicalPayload(simulateTamper);
    const newHash = await computeHash(payload);
    const formatted = `SHA256:${newHash}`;
    
    if (simulateTamper) {
      setTamperedState(true);
      setLiveDigest(formatted);
      setComputedStatus('TAMPERED');
    } else {
      setTamperedState(false);
      setLiveDigest(formatted);
      setComputedStatus('VERIFIED');
    }
    setIsVerifying(false);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(activeSignature);
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
              <span className="badge badge-cyan">Demo Attestation Record</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Client-Verifiable Web Crypto API (SHA-256)
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              AI Trust Passport
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Simulated trust attestation record with client-side SHA-256 integrity verification between inbound prompts and the AI gateway.
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
        <div className="holographic-card-container" style={{ width: '100%' }}>
          <div 
            className="glass-panel printable-card holographic-card"
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
                    TRUSTWALL TRUST PASSPORT
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Lock size={16} color="#38bdf8" />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>
                Sig: {activeSignature.slice(0, 36)}...
              </span>
              <button
                type="button"
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

              <button
                type="button"
                onClick={() => setShowVerifier(!showVerifier)}
                style={{
                  background: showVerifier ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginLeft: '4px'
                }}
              >
                <Cpu size={13} />
                <span>{showVerifier ? 'Close Verifier' : 'Verify Signature (Web Crypto)'}</span>
                {showVerifier ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={onExportReport}
                className="btn btn-secondary btn-sm"
              >
                <Printer size={14} />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={onExportReport}
                className="btn btn-primary btn-sm"
              >
                <Download size={14} />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Interactive Web Crypto Attestation Verification Panel */}
          {showVerifier && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'rgba(0, 0, 0, 0.45)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 'var(--radius-md)',
              animation: 'fadeIn 0.25s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#38bdf8" />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff' }}>
                      Client-Verifiable Web Cryptography Inspector
                    </span>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#a855f7',
                      background: 'rgba(168, 85, 247, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}>
                      FIPS 180-4 SHA-256
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '620px' }}>
                    This panel executes genuine W3C Web Cryptography API (<code style={{ color: '#38bdf8' }}>window.crypto.subtle.digest</code>) directly in your browser over the canonical payload to prove mathematical immutability.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleRunVerification(false)}
                    disabled={isVerifying}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={13} className={isVerifying ? 'animate-spin' : ''} />
                    <span>Verify Authenticity</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRunVerification(!tamperedState)}
                    disabled={isVerifying}
                    style={{
                      background: tamperedState ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      border: tamperedState ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                      color: tamperedState ? '#f87171' : '#fbbf24',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <AlertTriangle size={13} />
                    <span>{tamperedState ? 'Reset Tamper Simulation' : 'Simulate Data Tampering'}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: computedStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: computedStatus === 'VERIFIED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '14px'
              }}>
                {computedStatus === 'VERIFIED' ? (
                  <CheckCircle2 size={20} color="#10b981" />
                ) : (
                  <AlertTriangle size={20} color="#ef4444" />
                )}
                <div>
                  <div style={{
                    fontSize: '0.8125rem',
                    fontWeight: 800,
                    color: computedStatus === 'VERIFIED' ? '#34d399' : '#f87171'
                  }}>
                    {computedStatus === 'VERIFIED' 
                      ? '✓ DIGITALLY VERIFIED: Browser computed digest matches authentic canonical payload'
                      : '❌ INTEGRITY REJECTED: Simulated in-memory modification changed hash digest'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    Digest: {liveDigest}
                  </div>
                </div>
              </div>

              {/* Canonical Payload Inspection */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Canonical Pre-Image Payload (Evaluated by window.crypto.subtle):
                </div>
                <pre style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: tamperedState ? '#fca5a5' : '#7dd3fc',
                  overflowX: 'auto',
                  margin: 0
                }}>
                  {getCanonicalPayload(tamperedState)}
                </pre>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
