import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Cpu, 
  EyeOff, 
  Sparkles, 
  FileCheck,
  Zap,
  Server
} from 'lucide-react';

interface HeroSectionProps {
  onStartScan: () => void;
  onLaunchDemo: (scenarioIndex: number) => void;
  onViewArchitecture: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartScan,
  onLaunchDemo,
  onViewArchitecture
}) => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const pipelineNodes = [
    {
      id: 1,
      name: 'Client / User',
      subtitle: 'Raw User Prompt',
      tag: 'Inbound Request',
      icon: Lock,
      color: '#38bdf8',
      desc: 'User inputs corporate inquiry, code review request, or operational prompts that may inadvertently contain personal identifiers, API keys, or prompt injection payloads.'
    },
    {
      id: 2,
      name: 'TrustWall Ingress Firewall',
      subtitle: 'PII Redactor & Injection Shield',
      tag: 'Pre-Inference Filter',
      icon: ShieldCheck,
      color: '#06b6d4',
      desc: 'Scans text against 12+ PII regex categories and 7 adversarial prompt-injection heuristics. Neutralizes jailbreak vectors and masks credentials into safe placeholders.'
    },
    {
      id: 3,
      name: 'Downstream AI Engine',
      subtitle: 'Private LLM Inference',
      tag: 'Sanitized Execution',
      icon: Cpu,
      color: '#8b5cf6',
      desc: 'The AI model processes the protected prompt. Zero real PII, credentials, or override commands ever reach the model or enter model training caches.'
    },
    {
      id: 4,
      name: 'TrustWall Egress Inspector',
      subtitle: 'Hallucination & Risk Check',
      tag: 'Post-Inference Audit',
      icon: FileCheck,
      color: '#10b981',
      desc: 'Heuristic engine checks output for overconfident claims, unverified statistics, dangerous terminal commands, and unwanted credential reflection.'
    },
    {
      id: 5,
      name: 'Verified Delivery',
      subtitle: 'Cryptographic Trust Passport',
      tag: 'Actionable Trust',
      icon: Zap,
      color: '#34d399',
      desc: 'User receives the safe AI answer accompanied by an AI Trust Passport with Privacy, Security, and Reliability trust scores.'
    }
  ];

  return (
    <section style={{
      padding: '60px 0 80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container">
        {/* Brand Pill */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
          }}>
            <span className="pulse-dot dot-emerald" />
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em' }}>
              DEFENSIVE AI FIREWALL & AUDIT LAYER
            </span>
          </div>
        </div>

        {/* Hero Heading */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 24px' }}>
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '18px',
            color: '#ffffff'
          }}>
            Your AI deserves a <br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 40px rgba(6, 182, 212, 0.3)'
            }}>
              security layer.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto'
          }}>
            <strong style={{ color: 'var(--text-primary)' }}>TrustWall</strong> protects sensitive information before it reaches AI and evaluates AI responses before you trust them.
          </p>

          <p style={{
            fontSize: '0.9375rem',
            color: '#38bdf8',
            fontWeight: 600,
            marginTop: '10px',
            letterSpacing: '0.02em'
          }}>
            “Protect what you send to AI. Verify what AI sends back.”
          </p>
        </div>

        {/* Hero CTAs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '56px'
        }}>
          <button
            onClick={onStartScan}
            className="btn btn-primary btn-lg"
            id="hero-start-scan-btn"
          >
            <ShieldCheck size={20} />
            <span>Start Secure Scan</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => onLaunchDemo(2)}
            className="btn btn-secondary btn-lg"
            id="hero-demo-mode-btn"
            style={{ borderColor: 'rgba(245, 158, 11, 0.35)', color: '#fbbf24' }}
          >
            <Sparkles size={18} />
            <span>30-Second Demo Mode</span>
          </button>

          <button
            onClick={onViewArchitecture}
            className="btn btn-secondary btn-lg"
            id="hero-how-it-works-btn"
          >
            <Server size={18} color="var(--text-secondary)" />
            <span>See How It Works</span>
          </button>
        </div>

        {/* Interactive Visual Data-Flow Diagram */}
        <div className="glass-panel" style={{
          padding: '32px 24px',
          marginBottom: '48px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          background: 'linear-gradient(180deg, rgba(15, 22, 38, 0.9) 0%, rgba(8, 12, 20, 0.95) 100%)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-cyan">Architecture Pipeline</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Interactive inspection flow
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: '#ffffff' }}>
                Zero-Trust AI Guardrail Pipeline
              </h3>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)'
            }}>
              <span>Click any checkpoint to inspect protection mechanics</span>
            </div>
          </div>

          {/* Pipeline Nodes Flow */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            position: 'relative'
          }}>
            {pipelineNodes.map((node, index) => {
              const Icon = node.icon;
              const isSelected = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(isSelected ? null : node.id)}
                  style={{
                    backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? `1.5px solid ${node.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? `0 0 20px ${node.color}33` : 'none',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: `${node.color}1a`,
                      border: `1px solid ${node.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} color={node.color} />
                    </div>
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: node.color,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      0{index + 1}
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: node.color,
                    marginBottom: '2px'
                  }}>
                    {node.tag}
                  </div>

                  <div style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {node.name}
                  </div>

                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.3
                  }}>
                    {node.subtitle}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Node Detail Drawer */}
          {activeNode && (
            <div style={{
              marginTop: '20px',
              padding: '16px 20px',
              background: 'rgba(6, 182, 212, 0.06)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 'var(--radius-md)',
              animation: 'fadeIn 0.2s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="pulse-dot dot-emerald" />
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#ffffff' }}>
                  {pipelineNodes.find(n => n.id === activeNode)?.name} Mechanics:
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {pipelineNodes.find(n => n.id === activeNode)?.desc}
              </p>
            </div>
          )}
        </div>

        {/* The Three Pillars Grid */}
        <div className="grid-3" style={{ marginTop: '24px' }}>
          {/* Pillar 1: Privacy */}
          <div className="glass-panel" style={{ padding: '28px 24px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <EyeOff size={22} color="#06b6d4" />
            </div>
            <div className="badge badge-cyan" style={{ marginBottom: '10px' }}>Pillar 01</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Privacy Protection
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Detects emails, phone numbers, API keys, card numbers, IP addresses, and structured credentials before the prompt ever touches an AI model. Masks values with safe contextual placeholders.
            </p>
          </div>

          {/* Pillar 2: Security */}
          <div className="glass-panel" style={{ padding: '28px 24px' }}>
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
              <ShieldCheck size={22} color="#f87171" />
            </div>
            <div className="badge badge-high" style={{ marginBottom: '10px' }}>Pillar 02</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Threat & Injection Defense
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Rule-based heuristic detector intercepts prompt injections, system directive overrides, persona hijacks (DAN), delimiter injection attacks, and dangerous command executions.
            </p>
          </div>

          {/* Pillar 3: Trust */}
          <div className="glass-panel" style={{ padding: '28px 24px' }}>
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
              <FileCheck size={22} color="#10b981" />
            </div>
            <div className="badge badge-safe" style={{ marginBottom: '10px' }}>Pillar 03</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Response Trust & Passport
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Verifies model outputs for overconfidence, hallucinated certainty, and security violations. Issues an immutable AI Trust Passport with verifiable tri-metric scoring.
            </p>
          </div>
        </div>

        {/* Trust Guarantees Bar */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '24px',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <Lock size={15} color="#10b981" />
            <span>Zero Persistent Prompt Logging</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={15} color="#06b6d4" />
            <span>Heuristic Policy Boundary Checks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <Zap size={15} color="#f59e0b" />
            <span>Sub-20ms Deterministic Gate</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <FileCheck size={15} color="#8b5cf6" />
            <span>Cryptographic Verification Stamp</span>
          </div>
        </div>
      </div>
    </section>
  );
};
