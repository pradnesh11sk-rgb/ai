import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  Cpu, 
  Lock, 
  Activity, 
  Menu, 
  X, 
  Sparkles, 
  FileText, 
  Settings, 
  Palette, 
  Award,
  ChevronDown
} from 'lucide-react';
import { type ThemeId, AVAILABLE_THEMES, getInitialTheme, applyTheme } from '../services/themeManager';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLaunchDemo: (scenarioIndex: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLaunchDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('cyber-violet');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setCurrentTheme(initial);
    applyTheme(initial);
  }, []);

  const handleThemeChange = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    setThemeDropdownOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Overview', icon: Shield },
    { id: 'scanner', label: 'AI Scanner', icon: Cpu },
    { id: 'passport', label: 'Trust Passport', icon: FileText },
    { id: 'security-center', label: 'Security Center', icon: Activity },
    { id: 'integrations', label: 'App Inspector & Trust', icon: Award },
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
        background: 'linear-gradient(90deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.15) 100%)',
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
        <Lock size={12} color="var(--accent-primary)" />
        <span>End-to-End Cryptographically Attested &bull; Zero-Data Retention Enclave</span>
      </div>

      <div style={{
        backgroundColor: 'rgba(7, 9, 20, 0.82)',
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
            background: 'var(--theme-gradient, linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%))',
            border: '1px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Shield size={22} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 50%, var(--accent-primary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                TRUSTWALL
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'var(--theme-badge-bg)',
                color: 'var(--theme-badge-text)',
                border: '1px solid var(--theme-badge-border)',
                letterSpacing: '0.05em'
              }}>
                AI FIREWALL
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
              <span className="pulse-dot dot-emerald" />
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Autonomous Defense Node
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
            @media (min-width: 1040px) {
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
                  background: isActive ? 'var(--theme-badge-bg)' : 'transparent',
                  color: isActive ? 'var(--theme-badge-text)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--theme-badge-border)' : '1px solid transparent',
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={14} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Dynamic Theme Picker */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="btn btn-secondary btn-sm"
              title="Change App Color Theme"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderColor: 'var(--border-card)'
              }}
            >
              <Palette size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.75rem', display: 'none' }} className="theme-btn-text">Theme</span>
              <style>{`
                @media (min-width: 768px) {
                  .theme-btn-text { display: inline !important; }
                }
              `}</style>
              <ChevronDown size={12} />
            </button>

            {themeDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                padding: '8px',
                zIndex: 200,
                backdropFilter: 'blur(20px)'
              }}>
                <div style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  padding: '6px 8px 4px',
                  letterSpacing: '0.05em'
                }}>
                  Select Interface Color:
                </div>
                {AVAILABLE_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: currentTheme === theme.id ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      color: currentTheme === theme.id ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: theme.colorPreview,
                      border: '1px solid rgba(255,255,255,0.3)',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{theme.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{theme.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

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
                  background: isActive ? 'var(--theme-badge-bg)' : 'transparent',
                  color: isActive ? 'var(--theme-badge-text)' : 'var(--text-primary)',
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
                <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
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
