import React, { useState } from 'react';
import { X, Printer, Download, Copy, Check, ShieldCheck } from 'lucide-react';
import type { TrustPassportData, PromptScanResult, ResponseTrustResult } from '../../shared/types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  passportData: TrustPassportData | null;
  scanResult?: PromptScanResult | null;
  trustResult?: ResponseTrustResult | null;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  passportData,
  scanResult,
  trustResult
}) => {
  const [copiedFormat, setCopiedFormat] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'json' | 'markdown'>('preview');

  if (!isOpen) return null;

  const data = passportData || {
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
    recommendationText: 'SAFE TO PROCEED WITH CAUTION',
    cryptographicSignature: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  };

  const handlePrint = () => {
    window.print();
  };

  const getMarkdownReport = () => {
    return `# PRIVORA — AI SECURITY AUDIT REPORT & TRUST PASSPORT
**Passport ID:** ${data.passportId}
**Scan ID:** ${data.scanId}
**Timestamp:** ${new Date(data.timestamp).toUTCString()}
**Gateway Origin:** ${data.clientOrigin}

---

## 1. COMPOSITE TRUST SCORES
- **Overall Trust Score:** ${data.overallTrustScore} / 100
- **Privacy Hygiene Score:** ${data.privacyScore} / 100
- **Adversarial Security Score:** ${data.securityScore} / 100
- **Response Reliability Score:** ${data.reliabilityScore} / 100
- **Overall Threat Classification:** ${data.threatLevel}

---

## 2. AUDIT SUMMARY
- **Sensitive PII Protected:** ${data.privacyEventsProtected} entity/entities
- **Prompt Injections Neutralized:** ${data.threatsBlocked} vector(s)
- **Prompt Sanitization Status:** ${data.promptStatus}
- **Downstream Model Evaluated:** ${data.modelEvaluated}

---

## 3. SECURITY RECOMMENDATION
${data.recommendationText}

---

## 4. CRYPTOGRAPHIC INTEGRITY
**Verification Hash:** \`${data.cryptographicSignature}\`
*Privora AI Firewall Ephemeral Zero-Retention Gateway*
`;
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0c1220',
        border: '1px solid rgba(6, 182, 212, 0.4)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(6, 182, 212, 0.2)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={24} color="#06b6d4" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Export Security Audit Report
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Audited Passport #{data.passportId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: '#070a12'
        }}>
          <button
            onClick={() => setActiveTab('preview')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'preview' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeTab === 'preview' ? '#38bdf8' : 'var(--text-secondary)',
              border: activeTab === 'preview' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent'
            }}
          >
            Report Preview
          </button>
          <button
            onClick={() => setActiveTab('markdown')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'markdown' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeTab === 'markdown' ? '#38bdf8' : 'var(--text-secondary)',
              border: activeTab === 'markdown' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent'
            }}
          >
            Markdown (.md)
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'json' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              color: activeTab === 'json' ? '#38bdf8' : 'var(--text-secondary)',
              border: activeTab === 'json' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent'
            }}
          >
            Raw JSON Audit
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'preview' && (
            <div style={{
              background: '#080c16',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px', marginBottom: '18px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4', textTransform: 'uppercase' }}>
                  CERTIFIED SECURITY AUDIT
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  Privora AI Firewall — Trust Passport
                </h4>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  ID: {data.passportId} • Scan Reference: {data.scanId}
                </div>
              </div>

              <div className="grid-3" style={{ marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Privacy Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{data.privacyScore}/100</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Security Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{data.securityScore}/100</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reliability Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>{data.reliabilityScore}/100</div>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '16px' }}>
                <strong>Recommendation:</strong> {data.recommendationText}
              </div>

              <div style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px'
              }}>
                <div>Verified Signature: {data.cryptographicSignature}</div>
                <div>Retention Status: Minimal Ephemeral In-Memory</div>
              </div>
            </div>
          )}

          {activeTab === 'markdown' && (
            <pre style={{
              background: '#080c16',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: '#38bdf8',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5
            }}>
              {getMarkdownReport()}
            </pre>
          )}

          {activeTab === 'json' && (
            <pre style={{
              background: '#080c16',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: '#34d399',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5
            }}>
              {JSON.stringify({ passport: data, scan: scanResult, responseTrust: trustResult }, null, 2)}
            </pre>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <button
            onClick={() => handleCopyText(activeTab === 'json' ? JSON.stringify(data, null, 2) : getMarkdownReport())}
            className="btn btn-secondary btn-sm"
          >
            {copiedFormat ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copiedFormat ? 'Copied to Clipboard' : 'Copy Content'}</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary btn-sm"
            >
              <Printer size={14} />
              <span>Print PDF / Window</span>
            </button>

            <button
              onClick={() => handleDownloadFile(
                activeTab === 'json' ? JSON.stringify(data, null, 2) : getMarkdownReport(),
                `privora-passport-${data.scanId}.${activeTab === 'json' ? 'json' : 'md'}`,
                activeTab === 'json' ? 'application/json' : 'text/markdown'
              )}
              className="btn btn-primary btn-sm"
            >
              <Download size={14} />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
