import React, { useState } from 'react';
import { Shield, ShieldAlert, Cpu, Lock, Activity, Menu, X, Sparkles, FileText, Settings } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLaunchDemo: (scenarioIndex: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLaunchDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Shield },
    { id: 'scanner', label: 'AI Scanner', icon: Cpu },
    { id: 'passport', label: 'Trust Passport', icon: FileText },
    { id: 'security-center', label: 'Security Center', icon: Activity },
    { id: 'integrations', label: 'SaaS Integrations', icon: ShieldAlert },
    { id: 'privacy', label: 'Privacy by Design', icon: Lock },
    { id: 'about', label: 'About', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      {/* Global Security Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.15) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: '6px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#cbd5e1',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}>
        <Lock size={12} color="#38bdf8" />
        <span>End-to-End Encrypted &bull; Local First Processing</span>
      </div>

      <div style={{
        backgroundColor: 'rgba(6, 8, 15, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all 0.3s ease'
      }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.25)'
          }}>
            <Shield size={22} color="#06b6d4" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 50%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                PRIVORA
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(6, 182, 212, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                letterSpacing: '0.05em'
              }}>
                AI FIREWALL
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
              <span className="pulse-dot dot-emerald" />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Active Guardrail Engine
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{
          display: 'none',
          gap: '6px',
          alignItems: 'center'
        }} className="desktop-nav">
          <style>{`
            @media (min-width: 960px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={15} color={isActive ? '#38bdf8' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quick Demo CTA */}
          <button
            onClick={() => {
              setActiveTab('scanner');
              onLaunchDemo(2); // load prompt injection demo scenario by default
            }}
            className="btn btn-secondary btn-sm"
            title="Instantly run test scenario for judges"
            style={{
              borderColor: 'rgba(245, 158, 11, 0.35)',
              background: 'rgba(245, 158, 11, 0.08)',
              color: '#fbbf24',
              display: 'none'
            }}
            id="demo-mode-top-btn"
          >
            <style>{`
              @media (min-width: 640px) {
                #demo-mode-top-btn { display: inline-flex !important; }
              }
            `}</style>
            <Sparkles size={14} />
            <span>Judge Demo 🎬</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick('scanner')}
            className="btn btn-primary btn-sm"
            id="scan-prompt-navbar-btn"
          >
            <Shield size={15} />
            <span>Scan AI Prompt</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-toggle btn btn-secondary btn-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{ padding: '8px' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-card)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  color: isActive ? '#38bdf8' : 'var(--text-primary)',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Icon size={18} color={isActive ? '#38bdf8' : 'var(--text-secondary)'} />
                {item.label}
              </button>
            );
          })}
          <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setActiveTab('scanner');
                setMobileMenuOpen(false);
                onLaunchDemo(2);
              }}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            >
              <Sparkles size={14} /> 30s Demo
            </button>
            <button
              onClick={() => handleNavClick('scanner')}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              <Shield size={14} /> Scan Prompt
            </button>
          </div>
        </div>
      )}
      </div>
    </header>
  );
};
