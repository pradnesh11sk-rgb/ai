import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  Clock, 
  Key,
  Shield,
  Fingerprint
} from 'lucide-react';
import { type UserProfile, logoutUser } from '../services/authManager';

interface ProfilePageProps {
  currentUser: UserProfile | null;
  onOpenSignInModal: () => void;
  onNavigateToSettings: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  currentUser, 
  onOpenSignInModal,
  onNavigateToSettings 
}) => {

  const handleSignOut = () => {
    logoutUser();
  };

  return (
    <div style={{ padding: '40px 0 90px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--theme-badge-bg)',
            border: '1px solid var(--theme-badge-border)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--theme-badge-text)',
            marginBottom: '14px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            <Lock size={13} /> ACCOUNT ACCESS
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '12px',
            color: '#ffffff'
          }}>
            Your TrustWall profile
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.0625rem',
            maxWidth: '640px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Sign in with your email and password to manage your account and keep your workspace identity connected.
          </p>
        </div>

        {/* Unauthenticated State: Sign in to continue card */}
        {!currentUser ? (
          <div 
            className="glass-panel"
            style={{
              padding: '48px 32px',
              textAlign: 'center',
              border: '1px solid var(--border-card)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
              maxWidth: '560px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* User Profile Icon Avatar */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              border: '1.5px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'var(--accent-primary)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <User size={30} />
            </div>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '10px',
              letterSpacing: '-0.02em'
            }}>
              Sign in to continue
            </h2>

            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '440px',
              marginBottom: '28px'
            }}>
              Your password is handled securely by the authentication provider and is never stored in this application.
            </p>

            <button
              onClick={onOpenSignInModal}
              className="btn btn-primary btn-lg"
              style={{
                minWidth: '240px',
                padding: '14px 28px',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>Sign in with credentials</span>
              <ArrowRight size={16} />
            </button>

            {/* Subtle Security Footnote */}
            <div style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <ShieldCheck size={14} color="#10b981" />
              <span>Zero-knowledge token auth &bull; Session protected in local memory</span>
            </div>
          </div>
        ) : (
          /* Authenticated State: Active Profile & Security Dashboard */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Identity Card */}
            <div className="glass-panel" style={{
              padding: '32px',
              border: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* User Avatar Initials */}
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  background: 'var(--theme-gradient)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  boxShadow: 'var(--shadow-glow)'
                }}>
                  {currentUser.avatarInitials}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                      {currentUser.name}
                    </h2>
                    <span className="badge badge-safe" style={{ fontSize: '0.6875rem' }}>
                      <CheckCircle2 size={11} /> Active
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentUser.email}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {currentUser.role}
                  </div>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="btn btn-secondary"
                style={{
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  background: 'rgba(239, 68, 68, 0.08)'
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Account & Security Status Grid */}
            <div className="grid-2" style={{ gap: '20px' }}>
              
              {/* Account Status Card */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Building size={18} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                    Account Status
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Active
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Workspace:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                      {currentUser.workspace}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Identity ID:</span>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {currentUser.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Protection Card */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Shield size={18} color="#10b981" />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                    Security & Encryption
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Security Posture:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> Protected
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active Enclave Session:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#38bdf8' }}>
                      1 Node (Local First)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Two-Factor Attestation:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Fingerprint size={14} color="#34d399" /> Hardware Authenticated
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Session Information */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    Session authenticated at <strong>{currentUser.lastLogin}</strong> &bull; Zero plaintext passwords stored
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={onNavigateToSettings}
                    className="btn btn-secondary btn-sm"
                  >
                    <Key size={14} />
                    <span>Manage Keys & Database</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
