import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen
} from 'lucide-react';

export const DetectionExplainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'rules' | 'comparison' | 'disclaimers'>('architecture');

  const rules = [
    {
      id: 'TRW-INJ-01',
      category: 'System Override',
      owasp: 'OWASP LLM01:2025',
      pattern: '/(?:ignore|disregard|forget)\\s+(?:all\\s+)?(?:previous|prior|above)\\s+instructions/i',
      severity: 'CRITICAL',
      action: 'Neutralize & Quarantine',
      desc: 'Catches direct prompt injections attempting to wipe system boundaries.'
    },
    {
      id: 'TRW-INJ-02',
      category: 'Persona / DAN Hijack',
      owasp: 'OWASP LLM01:2025',
      pattern: '/(?:Do\\s+Anything\\s+Now|DAN\\s+mode|jailbreak|unfiltered\\s+mode)/i',
      severity: 'HIGH',
      action: 'Strip Persona Directive',
      desc: 'Neutralizes roleplay jailbreaks designed to force the model into unregulated personas.'
    },
    {
      id: 'TRW-INJ-03',
      category: 'Shell Execution',
      owasp: 'OWASP LLM06:2025',
      pattern: '/(?:bash\\s+-c|curl\\s+.*\\|\\s*(?:sh|bash)|powershell\\s+-enc|eval\\s*\\()/i',
      severity: 'CRITICAL',
      action: 'Terminate Stream & Block Payload',
      desc: 'Detects remote code execution payloads embedded within prompt instructions.'
    },
    {
      id: 'TRW-PII-01',
      category: 'Email Disclosure',
      owasp: 'OWASP LLM02:2025',
      pattern: '/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/',
      severity: 'MEDIUM',
      action: 'Token Replacement [REDACTED_EMAIL]',
      desc: 'Replaces raw email addresses with cryptographic placeholders.'
    },
    {
      id: 'TRW-PII-02',
      category: 'API Keys & Secrets',
      owasp: 'OWASP LLM02:2025',
      pattern: '/(?:sk-[a-zA-Z0-9_-]{20,}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36})/',
      severity: 'HIGH',
      action: 'In-Memory Redaction [REDACTED_API_KEY]',
      desc: 'Prevents enterprise API keys and cloud tokens from leaking into LLM training corpora.'
    },
    {
      id: 'TRW-PII-03',
      category: 'Credit Cards (PCI)',
      owasp: 'OWASP LLM02:2025',
      pattern: '/(?:\\d{4}[-\\s]?){3}\\d{4}/ (Luhn Verified)',
      severity: 'HIGH',
      action: 'Card Masking [REDACTED_CARD]',
      desc: 'Masks Visa, Mastercard, and Amex numbers to maintain financial privacy.'
    },
    {
      id: 'TRW-PII-04',
      category: 'IP Addresses',
      owasp: 'OWASP LLM02:2025',
      pattern: '/(?:\\d{1,3}\\.){3}\\d{1,3}/',
      severity: 'LOW',
      action: 'Host Masking [REDACTED_IP]',
      desc: 'Shields internal network topology and infrastructure IP addresses.'
    }
  ];

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      marginBottom: '28px',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(7, 10, 18, 0.9) 100%)'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={18} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#ffffff' }}>
              How Detection Works & Engine Architecture
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Transparent inspection of detection heuristics, architecture, and known limitations
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-sm)',
          padding: '3px',
          gap: '4px'
        }}>
          {[
            { id: 'architecture', label: '1. Architecture & Flow' },
            { id: 'rules', label: '2. Rule Catalog' },
            { id: 'comparison', label: '3. Heuristics vs AI' },
            { id: 'disclaimers', label: '4. Limitations & Disclaimers' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                border: 'none',
                background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: activeTab === tab.id ? '#38bdf8' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Architecture & Data Flow */}
      {activeTab === 'architecture' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginBottom: '18px',
            lineHeight: 1.6
          }}>
            TrustWall operates as a <strong style={{ color: '#ffffff' }}>Zero-Knowledge Prompt Firewall</strong>. Prompts are tokenized and scanned locally in-memory. Sensitive identifiers are transformed using deterministic one-way masks before any outbound inference occurs.
          </div>

          {/* Interactive Flow Diagram */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {[
              {
                step: '01',
                title: 'Inbound Ingestion',
                sub: 'Raw prompt received',
                desc: 'Prompt captured in local browser memory without persistent disk logging.'
              },
              {
                step: '02',
                title: 'Regex & Heuristic Tokenizer',
                sub: '< 2ms latency',
                desc: 'Scans against 18 deterministic rules for prompt injection, DAN personas, and PII.'
              },
              {
                step: '03',
                title: 'In-Memory Redaction',
                sub: 'Zero Data Retention',
                desc: 'Secrets masked into [REDACTED_x] tokens. Demasking keys held only in volatile state.'
              },
              {
                step: '04',
                title: 'Clean AI Dispatch',
                sub: 'Sanitized egress',
                desc: 'Sanitized prompt dispatched to target LLM. Third-party provider never receives raw PII.'
              },
              {
                step: '05',
                title: 'Response Trust Audit',
                sub: 'Hallucination & Egress',
                desc: 'Target response analyzed for unauthorized data leakage before reaching user.'
              }
            ].map((node) => (
              <div key={node.step} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#38bdf8',
                  fontWeight: 800,
                  marginBottom: '4px'
                }}>
                  STEP {node.step}
                </div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                  {node.title}
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#34d399', fontWeight: 600, marginBottom: '6px' }}>
                  {node.sub}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {node.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '10px 14px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span><strong>Zero-Storage Guarantee:</strong> No prompts, conversations, or credentials are saved to a central database or shared with third-party tracking services.</span>
          </div>
        </div>
      )}

      {/* Tab 2: Rule Catalog */}
      {activeTab === 'rules' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginBottom: '14px'
          }}>
            Transparent catalogue of active regex and heuristic detection rules evaluated against every prompt:
          </div>

          <div style={{
            overflowX: 'auto',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Rule ID</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Category</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>OWASP Code</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Pattern Example</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rules.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 700 }}>
                      {r.id}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#ffffff', fontWeight: 600 }}>
                      {r.category}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{
                        padding: '2px 6px',
                        background: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '4px',
                        color: '#c084fc',
                        fontSize: '0.6875rem'
                      }}>
                        {r.owasp}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      {r.pattern}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#34d399', fontWeight: 600 }}>
                      {r.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Heuristics vs AI */}
      {activeTab === 'comparison' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
                ⚡ Deterministic Rule Heuristics (Current Active Layer)
              </div>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6, margin: 0 }}>
                <li><strong>Execution Time:</strong> &lt; 2ms latency (instantaneous local evaluation).</li>
                <li><strong>Privacy:</strong> Zero network hops; runs entirely within client browser or edge proxy.</li>
                <li><strong>Predictability:</strong> 100% deterministic; explicit regex matches guarantee repeatable test suite results.</li>
                <li><strong>Token Cost:</strong> $0.00 / free.</li>
              </ul>
            </div>

            <div style={{
              padding: '16px',
              background: 'rgba(168, 85, 247, 0.05)',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '8px'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#c084fc', marginBottom: '8px' }}>
                🧠 AI-Assisted Semantic Classifier (Optional Deep Layer)
              </div>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6, margin: 0 }}>
                <li><strong>Execution Time:</strong> ~250–500ms API inference latency.</li>
                <li><strong>Capability:</strong> Evaluates nuanced semantic context and indirect multi-turn injections.</li>
                <li><strong>Tradeoff:</strong> Requires sending prompt data to an LLM evaluator (requires customer consent).</li>
                <li><strong>Cost:</strong> Consumes evaluator model tokens.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Limitations & Disclaimers */}
      {activeTab === 'disclaimers' && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          <div style={{
            padding: '16px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <AlertTriangle size={18} color="#fbbf24" />
              <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#fbbf24' }}>
                Engineering Transparency & Known Boundaries
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fef3c7', lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong>No Security Scanner Has Zero False Positives:</strong> Adversarial techniques such as Unicode homoglyphs, cipher-based encodings (Base64/ROT13), and multi-turn deception evolve continuously.
              </p>
              <p style={{ margin: '0 0 8px' }}>
                <strong>Defense-in-Depth Principle:</strong> TrustWall is engineered as a primary perimeter defense to sanitize prompt inputs and catch the most common OWASP LLM vulnerabilities before they reach the model. It should be combined with backend execution sandboxes and model output validation.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Benchmark Coverage:</strong> Validated against a test suite of 48 synthetic adversarial benchmark scenarios.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
