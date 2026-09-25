import type {
  PromptScanResult,
  ProtectedPromptResult,
  ResponseTrustResult,
  SecurityStats,
  ActivityEvent,
  DetectedPII,
  DetectedThreat
} from '../../shared/types';
import {
  runFullPromptScan,
  generateProtectedPrompt,
  generateSafeModelResponse,
  evaluateResponseTrust
} from './guardrailEngine';

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
    // Expected in client-only or offline environments - gracefully handle
  }

  // High-precision local guardrail engine
  return runFullPromptScan(prompt);
}

export async function protectPromptApi(
  prompt: string,
  detectedPII: DetectedPII[],
  detectedThreats: DetectedThreat[]
): Promise<ProtectedPromptResult & { demaskMap?: Record<string, string> }> {
  try {
    const res = await fetch(`${API_BASE}/protect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, detectedPII, detectedThreats })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Fallback to local engine
  }

  return generateProtectedPrompt(prompt, detectedPII, detectedThreats);
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
    // Fallback
  }

  return generateSafeModelResponse(prompt, isSanitized);
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
    // Fallback
  }

  return evaluateResponseTrust(prompt, response);
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
    promptsScanned: 184,
    threatsBlocked: 42,
    piiProtected: 89,
    highRiskInterceptions: 14,
    averageTrustScore: 94,
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
      timestamp: '2 mins ago',
      status: 'ALERT',
      message: 'Adversarial jailbreak payload quarantined: DAN persona override attempt',
      tag: 'Jailbreak Blocked'
    },
    {
      id: 'act-2',
      timestamp: '5 mins ago',
      status: 'WARNING',
      message: 'Masked 1 payment card number and 1 SSN credential from customer support prompt',
      tag: 'PII Protected'
    },
    {
      id: 'act-3',
      timestamp: '12 mins ago',
      status: 'SUCCESS',
      message: 'Cloud infrastructure migration architecture query verified & passed clean',
      tag: 'Clean Scan'
    },
    {
      id: 'act-4',
      timestamp: '18 mins ago',
      status: 'ALERT',
      message: 'API Key sk-live-•••••••• filtered prior to LLM foundation model context',
      tag: 'Credential Blocked'
    },
    {
      id: 'act-5',
      timestamp: '25 mins ago',
      status: 'SUCCESS',
      message: 'AI Trust Passport #TP-TRW-8912 cryptographically compiled and verified',
      tag: 'Passport Issued'
    }
  ];
}

export async function saveSupabaseConfigApi(url: string, key: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/config/supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection failed' };
  }
}

export async function saveAiKeysApi(keys: { openai?: string; anthropic?: string; gemini?: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/config/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || 'Saving keys failed' };
  }
}

export async function testSupabaseConnectionApi(url: string, key: string): Promise<{ connected: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/test/supabase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key })
    });
    return await res.json();
  } catch (err: any) {
    return { connected: false, message: 'Could not connect to Supabase endpoint.' };
  }
}

export async function testAiKeyApi(provider: string, key: string): Promise<{ connected: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}/test/ai-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, key })
    });
    return await res.json();
  } catch (err: any) {
    return { connected: false, message: 'Verification error.' };
  }
}
