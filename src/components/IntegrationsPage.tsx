import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Server, 
  Database,
  Cloud,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Search
} from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanned(true);
    }, 2500);
  };

  const apps = [
    { name: 'Slack Enterprise', type: 'Communication', risk: 'HIGH', status: scanned ? 'SECURED' : 'VULNERABLE', icon: <Server size={24} /> },
    { name: 'Google Workspace', type: 'Cloud Storage', risk: 'MEDIUM', status: scanned ? 'SECURED' : 'MONITORING', icon: <Cloud size={24} /> },
    { name: 'Notion Databases', type: 'Knowledge Base', risk: 'CRITICAL', status: scanned ? 'SECURED' : 'VULNERABLE', icon: <Database size={24} /> }
  ];

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>Third-Party SaaS App Inspector</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '10px auto' }}>
            Extend your Zero-Trust boundary. Automatically scan external applications for shadow-AI data leakage and apply firewall policies across your entire tech stack.
          </p>
          <button 
            onClick={handleScan}
            disabled={isScanning || scanned}
            className="btn btn-primary btn-lg"
            style={{ marginTop: '20px' }}
          >
            {isScanning ? <RefreshCw className="animate-spin" /> : <Search />}
            {isScanning ? 'Inspecting SaaS Ecosystem...' : scanned ? 'Ecosystem Secured' : 'Run Global Security Audit'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {apps.map((app, i) => (
            <div key={i} className="glass-panel" style={{
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderLeft: `4px solid ${scanned ? '#10b981' : (app.risk === 'CRITICAL' ? '#ef4444' : '#f59e0b')}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#10b981' }}>
                  {app.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{app.name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{app.type} Integration</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                {!scanned ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: app.risk === 'CRITICAL' ? '#f87171' : '#fbbf24' }}>
                    <AlertTriangle size={18} />
                    <span style={{ fontWeight: 700 }}>Shadow AI Risk: {app.risk}</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399' }}>
                    <ShieldCheck size={18} />
                    <span style={{ fontWeight: 700 }}>Data Egress Secured</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
