import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  EyeOff, 
  AlertTriangle, 
  Radio, 
  RefreshCw,
  Lock,
  TrendingUp,
  Cpu
} from 'lucide-react';
import type { SecurityStats, ActivityEvent } from '../../shared/types';
import { fetchStatsApi, fetchActivityApi } from '../services/api';

export const SecurityCenter: React.FC = () => {
  const [stats, setStats] = useState<SecurityStats>({
    promptsScanned: 148,
    threatsBlocked: 31,
    piiProtected: 67,
    highRiskInterceptions: 9,
    averageTrustScore: 92,
    systemUptime: '99.98%'
  });

  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  const loadData = async () => {
    setIsRefreshing(true);
    const [s, a] = await Promise.all([fetchStatsApi(), fetchActivityApi()]);
    setStats(s);
    setActivities(a);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadData();

    // Live simulated stream ticker
    const interval = setInterval(() => {
      if (!isLiveStreamActive) return;

      const demoFeedItems: { msg: string; status: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO'; tag: string }[] = [
        { msg: 'Adversarial jailbreak payload quarantined: DAN v9 attempt', status: 'ALERT', tag: 'Jailbreak Blocked' },
        { msg: 'Masked 1 credit card number and 1 SSN identifier', status: 'WARNING', tag: 'PII Protected' },
        { msg: 'Enterprise architecture query passed clean security scan', status: 'SUCCESS', tag: 'Clean Scan' },
        { msg: 'Egress hallucination warning flagged: ungrounded absolute certainty', status: 'WARNING', tag: 'Response Flagged' },
        { msg: 'API Key sk-demo-•••••••• sanitized from inference context', status: 'ALERT', tag: 'Credential Blocked' },
        { msg: 'Trust Passport #PW-9812 verified and issued', status: 'SUCCESS', tag: 'Passport Issued' }
      ];

      const randomItem = demoFeedItems[Math.floor(Math.random() * demoFeedItems.length)];
      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          status: randomItem.status,
          message: randomItem.msg,
          tag: randomItem.tag
        },
        ...prev.slice(0, 14)
      ]);

      setStats(prev => ({
        ...prev,
        promptsScanned: prev.promptsScanned + 1,
        threatsBlocked: randomItem.status === 'ALERT' ? prev.threatsBlocked + 1 : prev.threatsBlocked,
        piiProtected: randomItem.status === 'WARNING' ? prev.piiProtected + 1 : prev.piiProtected
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, [isLiveStreamActive]);

  const threatCategories = [
    { label: 'Prompt Injection / System Overrides', count: 18, pct: 44, color: '#ef4444' },
    { label: 'PII & Customer Data Exposure', count: 14, pct: 34, color: '#f59e0b' },
    { label: 'API Keys & Secret Exfiltration', count: 6, pct: 15, color: '#8b5cf6' },
    { label: 'Delimiter & Token Injection Attacks', count: 3, pct: 7, color: '#06b6d4' }
  ];

  return (
    <div style={{ padding: '36px 0 80px' }}>
      <div className="container">
        {/* Header */}
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
              <span className="badge badge-cyan">SOC & Telemetry Dashboard</span>
              <span className="badge badge-safe">Demo Data Mode</span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Security Center
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Real-time firewall threat telemetry, PII containment metrics, and active interception stream.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsLiveStreamActive(!isLiveStreamActive)}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: isLiveStreamActive ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)',
                color: isLiveStreamActive ? '#34d399' : 'var(--text-secondary)'
              }}
            >
              <Radio size={14} className={isLiveStreamActive ? 'pulse-dot' : ''} />
              <span>{isLiveStreamActive ? 'Live Stream: Active' : 'Live Stream: Paused'}</span>
            </button>

            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="btn btn-secondary btn-sm"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer Banner */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)'
        }}>
          <Lock size={15} color="#38bdf8" />
          <span>
            <strong style={{ color: '#ffffff' }}>Notice:</strong> Statistics reflect synthetic demo and current session traffic for hackathon evaluation. No production client prompts are permanently stored.
          </span>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid-4" style={{ marginBottom: '28px' }}>
          {/* Prompts Scanned */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Prompts Scanned
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Cpu size={16} color="#06b6d4" />
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {stats.promptsScanned}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
              +12 this session
            </div>
          </div>

          {/* Threats Blocked */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Threats Blocked
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={16} color="#ef4444" />
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f87171', fontFamily: 'var(--font-mono)' }}>
              {stats.threatsBlocked}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>
              100% neutralized at ingress
            </div>
          </div>

          {/* PII Protected */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                PII Items Protected
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <EyeOff size={16} color="#10b981" />
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {stats.piiProtected}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
              Redacted into safe tokens
            </div>
          </div>

          {/* High-Risk Interceptions */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                High-Risk Intercepts
              </span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={16} color="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {stats.highRiskInterceptions}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>
              Adversarial jailbreaks
            </div>
          </div>
        </div>

        {/* Split Grid: Threat Distribution vs Live Activity Feed */}
        <div className="grid-2">
          {/* Threat Vector Distribution */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <TrendingUp size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                Threat Vector Distribution
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {threatCategories.map((cat, idx) => (
                <div key={idx}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8125rem',
                    marginBottom: '6px'
                  }}>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{cat.label}</span>
                    <span style={{ color: cat.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {cat.count} ({cat.pct}%)
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${cat.pct}%`,
                      height: '100%',
                      backgroundColor: cat.color,
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Firewall Gate Latency:</span>
                <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>18.4ms (avg)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Uptime SLA:</span>
                <strong style={{ color: '#ffffff', fontFamily: 'var(--font-mono)' }}>{stats.systemUptime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Output Trust:</span>
                <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{stats.averageTrustScore}/100</strong>
              </div>
            </div>
          </div>

          {/* Live Security Activity Stream */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                  Live Security Activity Stream
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot dot-emerald" />
                <span style={{ fontSize: '0.6875rem', color: '#34d399', fontWeight: 700 }}>
                  STREAMING
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '6px'
            }}>
              {activities.map((act) => {
                const getStatusColor = () => {
                  switch (act.status) {
                    case 'ALERT': return { dot: 'dot-crimson', tag: 'badge-high' };
                    case 'WARNING': return { dot: 'dot-amber', tag: 'badge-medium' };
                    case 'SUCCESS': return { dot: 'dot-emerald', tag: 'badge-safe' };
                    default: return { dot: 'dot-emerald', tag: 'badge-cyan' };
                  }
                };
                const sColor = getStatusColor();

                return (
                  <div
                    key={act.id}
                    style={{
                      padding: '12px 14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span className={`pulse-dot ${sColor.dot}`} style={{ marginTop: '5px' }} />
                      <div>
                        <div style={{ fontSize: '0.8125rem', color: '#ffffff', fontWeight: 500, lineHeight: 1.4 }}>
                          {act.message}
                        </div>
                        <div style={{
                          fontSize: '0.6875rem',
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          marginTop: '2px'
                        }}>
                          {act.timestamp}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${sColor.tag}`} style={{ fontSize: '0.625rem', whiteSpace: 'nowrap' }}>
                      {act.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
