import React, { useState } from 'react';
import { Database, Key, CheckCircle, AlertCircle, Save, Loader } from 'lucide-react';
import { saveSupabaseConfigApi, saveAiKeysApi, testSupabaseConnectionApi, testAiKeyApi } from '../services/api';

export const SettingsPage: React.FC = () => {
  // Supabase state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isSavingSupabase, setIsSavingSupabase] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [supabaseMessage, setSupabaseMessage] = useState('');

  // AI Keys state
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [isSavingAi, setIsSavingAi] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [aiMessage, setAiMessage] = useState('');

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSupabase(true);
    setSupabaseStatus('idle');
    try {
      // First test the connection
      const testRes = await testSupabaseConnectionApi(supabaseUrl, supabaseKey);
      if (!testRes.connected) {
        setSupabaseStatus('error');
        setSupabaseMessage(testRes.message || 'Failed to verify Supabase configuration.');
        return;
      }

      // If successful, save the config
      const response = await saveSupabaseConfigApi(supabaseUrl, supabaseKey);
      if (response.success) {
        setSupabaseStatus('success');
        setSupabaseMessage(testRes.message || 'Supabase configuration saved and verified successfully.');
      } else {
        setSupabaseStatus('error');
        setSupabaseMessage(response.error || 'Failed to save Supabase configuration.');
      }
    } catch (err: any) {
      setSupabaseStatus('error');
      setSupabaseMessage(err.message || 'An error occurred while saving.');
    } finally {
      setIsSavingSupabase(false);
    }
  };

  const handleSaveAiKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAi(true);
    setAiStatus('idle');
    try {
      // Test provided keys first
      if (openaiKey) {
        const test = await testAiKeyApi('openai', openaiKey);
        if (!test.connected) {
          setAiStatus('error');
          setAiMessage(`OpenAI: ${test.message}`);
          return;
        }
      }
      if (anthropicKey) {
        const test = await testAiKeyApi('anthropic', anthropicKey);
        if (!test.connected) {
          setAiStatus('error');
          setAiMessage(`Anthropic: ${test.message}`);
          return;
        }
      }
      if (geminiKey) {
        const test = await testAiKeyApi('gemini', geminiKey);
        if (!test.connected) {
          setAiStatus('error');
          setAiMessage(`Gemini: ${test.message}`);
          return;
        }
      }

      // If all provided tests pass (or none provided), save
      const response = await saveAiKeysApi({
        openaiKey: openaiKey || undefined,
        anthropicKey: anthropicKey || undefined,
        geminiKey: geminiKey || undefined,
      });
      if (response.success) {
        setAiStatus('success');
        setAiMessage('AI provider keys verified and saved successfully.');
      } else {
        setAiStatus('error');
        setAiMessage('Failed to save AI keys.');
      }
    } catch (err: any) {
      setAiStatus('error');
      setAiMessage(err.message || 'An error occurred while saving.');
    } finally {
      setIsSavingAi(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database className="text-primary" size={32} />
          System Configuration
        </h1>
        <p className="text-muted">
          Connect your database and AI providers to fully unlock TRUSTWALL's capabilities.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Supabase Config Card */}
        <div className="card glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <Database size={20} className="text-accent" />
            Supabase Connection
          </h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Connect to your Supabase project to persist Trust Passports and Security Incidents. Without this, TRUSTWALL runs in memory mode.
          </p>

          <form onSubmit={handleSaveSupabase} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="input"
                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Anon / Service Role Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJh..."
                className="input"
                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSavingSupabase || (!supabaseUrl && !supabaseKey)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSavingSupabase ? <Loader size={16} className="spin" /> : <Save size={16} />}
                {isSavingSupabase ? 'Connecting...' : 'Connect Supabase'}
              </button>

              {supabaseStatus !== 'idle' && (
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', 
                  color: supabaseStatus === 'success' ? '#10b981' : '#ef4444',
                  fontSize: '0.875rem', fontWeight: 500
                }}>
                  {supabaseStatus === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {supabaseMessage}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* AI Provider Keys Card */}
        <div className="card glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
            <Key size={20} className="text-secondary" />
            AI Provider API Keys
          </h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Provide real API keys to use live models for threat detection and response analysis instead of the internal simulator.
          </p>

          <form onSubmit={handleSaveAiKeys} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>OpenAI API Key</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="input"
                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Anthropic API Key (Claude)</label>
              <input
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
                className="input"
                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Google Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                className="input"
                style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-tertiary)' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button 
                type="submit" 
                className="btn btn-secondary" 
                disabled={isSavingAi}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSavingAi ? <Loader size={16} className="spin" /> : <Save size={16} />}
                {isSavingAi ? 'Saving...' : 'Save AI Keys'}
              </button>

              {aiStatus !== 'idle' && (
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '6px', 
                  color: aiStatus === 'success' ? '#10b981' : '#ef4444',
                  fontSize: '0.875rem', fontWeight: 500
                }}>
                  {aiStatus === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {aiMessage}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
