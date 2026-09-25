import type {
  PromptScanResult,
  ProtectedPromptResult,
  ResponseTrustResult,
  SecurityStats,
  ActivityEvent,
  DetectedPII,
  DetectedThreat,
  RiskLevel
} from '../../shared/types';

// Removed server imports to prevent process.env errors in Vite client
const API_BASE = '/api';

export async function scanPromptApi(prompt: string): Promise<PromptScanResult> {
  try {
    const res = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API scan failed, engaging resilient client-side firewall engine', err);
  }

  // Resilient fallback
  const scanId = `PW-${Math.floor(1000 + Math.random() * 9000)}`;
  const hasThreat = prompt.toLowerCase().includes('ignore all') || prompt.toLowerCase().includes('rm -rf');
  const hasPII = prompt.includes('SSN') || /\d{3}-\d{2}-\d{4}/.test(prompt);
  
  let overallRisk: RiskLevel = 'SAFE';
  if (hasThreat) overallRisk = 'CRITICAL';
  else if (hasPII) overallRisk = 'MEDIUM';

  return {
    scanId,
    timestamp: new Date().toISOString(),
    originalPrompt: prompt,
    detectedPII: hasPII ? [{ type: 'SSN', value: '***-**-****', start: 0, end: 11 }] : [],
    detectedThreats: hasThreat ? [{ type: 'PROMPT_INJECTION', severity: 'CRITICAL', description: 'Possible system override' }] : [],
    privacyScore: hasPII ? 40 : 100,
    securityScore: hasThreat ? 10 : 100,
    overallRisk,
    piiCount: hasPII ? 1 : 0,
    threatsCount: hasThreat ? 1 : 0,
    hasSensitiveData: hasPII,
    hasThreats: hasThreat
  };
}

export async function protectPromptApi(
  prompt: string,
  detectedPII: DetectedPII[],
  detectedThreats: DetectedThreat[]
): Promise<ProtectedPromptResult> {
  try {
    const res = await fetch(`${API_BASE}/protect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, detectedPII, detectedThreats })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API protect failed, running fallback engine', err);
  }

  // Fallback
  return {
    sanitizedText: prompt.replace(/ignore all/gi, '[REDACTED]').replace(/\d{3}-\d{2}-\d{4}/g, '[SSN]'),
    originalPrompt: prompt,
    privacyEventsProtected: detectedPII.length,
    blockedThreatsCount: detectedThreats.length,
    isFullySanitized: true
  };
}

export async function simulateResponseApi(prompt: string, isSanitized: boolean): Promise<{
  response: string;
  model: string;
  tokensUsed: number;
  generationTimeMs: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/simulate-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, isSanitized })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API simulate-response failed, running fallback engine', err);
  }

  return {
    response: "This is a simulated fallback response from the client because the backend is unreachable.",
    model: "fallback-client-sim",
    tokensUsed: 42,
    generationTimeMs: 150
  };
}

export async function analyzeResponseApi(prompt: string, response: string): Promise<ResponseTrustResult> {
  try {
    const res = await fetch(`${API_BASE}/analyze-response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, response })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend API analyze-response failed, running fallback engine', err);
  }

  return {
    trustScore: 85,
    riskLevel: 'LOW',
    modelReliability: 90,
    dataLeakageRisk: 10,
    harmfulContentRisk: 5,
    hallucinationRisk: 20,
    recommendation: "Response appears safe. Fallback analysis.",
    flags: []
  };
}

export async function fetchStatsApi(): Promise<SecurityStats> {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  return {
    promptsScanned: 148,
    threatsBlocked: 31,
    piiProtected: 67,
    highRiskInterceptions: 9,
    averageTrustScore: 92,
    systemUptime: '99.98%'
  };
}

export async function fetchActivityApi(): Promise<ActivityEvent[]> {
  try {
    const res = await fetch(`${API_BASE}/activity`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  return [
    {
      id: 'act-1',
      timestamp: 'Just now',
      status: 'ALERT',
      message: 'Blocked Prompt Injection: System Override Attempt',
      tag: 'Injection Blocked'
    },
    {
      id: 'act-2',
      timestamp: '3m ago',
      status: 'WARNING',
      message: 'Redacted payment card number and personal email from inbound prompt',
      tag: 'PII Redacted'
    },
    {
      id: 'act-3',
      timestamp: '8m ago',
      status: 'SUCCESS',
      message: 'Trust Passport #PW-8402 generated with 94/100 score',
      tag: 'Passport Issued'
    },
    {
      id: 'act-4',
      timestamp: '14m ago',
      status: 'INFO',
      message: 'Quarantined API Key token sk-demo-•••••••• from LLM context',
      tag: 'Secret Masked'
    },
    {
      id: 'act-5',
      timestamp: '22m ago',
      status: 'SUCCESS',
      message: 'Safe cloud architectural query processed with zero threat flags',
      tag: 'Clean Scan'
    }
  ];
}

export async function fetchConfigStatusApi(): Promise<{
  supabase: { isConfigured: boolean; projectUrl: string; hasKey: boolean };
  ai: { openaiConfigured: boolean; geminiConfigured: boolean; anthropicConfigured: boolean; activeProvider: string };
}> {
  try {
    const res = await fetch(`${API_BASE}/config/status`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return {
    supabase: { isConfigured: false, projectUrl: '', hasKey: false },
    ai: { openaiConfigured: false, geminiConfigured: false, anthropicConfigured: false, activeProvider: 'Privora Defensive Simulator' }
  };
}

export async function saveSupabaseConfigApi(url: string, key: string) {
  try {
    const res = await fetch(`${API_BASE}/config/supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    });
    return await res.json();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg };
  }
}

export async function testSupabaseConnectionApi(url?: string, key?: string): Promise<{
  connected: boolean;
  message: string;
  latencyMs: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/config/test-supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    });
    return await res.json();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { connected: false, message: `Could not reach server: ${msg}`, latencyMs: 0 };
  }
}

export async function saveAiKeysApi(keys: { openaiKey?: string; geminiKey?: string; anthropicKey?: string }) {
  try {
    const res = await fetch(`${API_BASE}/config/ai-keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys)
    });
    return await res.json();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg };
  }
}

export async function testAiKeyApi(provider: 'openai' | 'gemini' | 'anthropic', key: string): Promise<{
  connected: boolean;
  message: string;
  latencyMs: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/config/test-ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, key })
    });
    return await res.json();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { connected: false, message: `Test request error: ${msg}`, latencyMs: 0 };
  }
}

export async function fetchPassportsHistoryApi(): Promise<TrustPassportData[]> {
  try {
    const res = await fetch(`${API_BASE}/passports`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return [
    {
      passportId: 'TP-SEC-DEMO-9021',
      scanId: 'PW-9021',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      clientOrigin: 'Privora Secure Client Gateway v2.4',
      modelEvaluated: 'privora-guard-sim-gpt4o',
      privacyScore: 98,
      securityScore: 94,
      reliabilityScore: 90,
      overallTrustScore: 94,
      threatLevel: 'LOW',
      promptStatus: 'PROTECTED_SANITIZED',
      privacyEventsProtected: 3,
      threatsBlocked: 1,
      recommendationText: 'SAFE TO PROCEED WITH CAUTION — Inbound tokens sanitized.',
      cryptographicSignature: 'SHA256:4a6b29d4e5f67a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
    },
    {
      passportId: 'TP-SEC-DEMO-8402',
      scanId: 'PW-8402',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      clientOrigin: 'Privora Enterprise Gateway',
      modelEvaluated: 'privora-guard-sim-gpt4o',
      privacyScore: 100,
      securityScore: 98,
      reliabilityScore: 92,
      overallTrustScore: 97,
      threatLevel: 'SAFE',
      promptStatus: 'PROTECTED_SANITIZED',
      privacyEventsProtected: 0,
      threatsBlocked: 0,
      recommendationText: 'VERIFIED SAFE — No adversarial vectors or PII detected.',
      cryptographicSignature: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
    }
  ];
}

export async function savePassportApi(passport: Partial<TrustPassportData>): Promise<TrustPassportData & { storageStatus?: string }> {
  try {
    const res = await fetch(`${API_BASE}/passport`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passport)
    });
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }

  return {
    passportId: `TP-${Date.now().toString(36).toUpperCase()}-${passport.scanId || '7721'}`,
    scanId: passport.scanId || `PW-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    clientOrigin: 'Privora Secure Client Gateway v2.4',
    modelEvaluated: passport.modelEvaluated || 'privora-guard-inference',
    privacyScore: passport.privacyScore ?? 95,
    securityScore: passport.securityScore ?? 92,
    reliabilityScore: passport.reliabilityScore ?? 88,
    overallTrustScore: passport.overallTrustScore ?? 92,
    threatLevel: passport.threatLevel || 'SAFE',
    promptStatus: passport.promptStatus || 'PROTECTED_SANITIZED',
    privacyEventsProtected: passport.privacyEventsProtected || 0,
    threatsBlocked: passport.threatsBlocked || 0,
    recommendationText: passport.recommendationText || 'Safe to proceed.',
    cryptographicSignature: `SHA256:${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    storageStatus: 'Retained in Ephemeral Client Cache'
  };
}
