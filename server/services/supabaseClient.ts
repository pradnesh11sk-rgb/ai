import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { TrustPassportData } from '../../shared/types.js';

// In-memory runtime config storage
let currentSupabaseUrl: string = process.env.SUPABASE_URL || '';
let currentSupabaseKey: string = process.env.SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

// Local in-memory passport store for fallback when Supabase is not connected
const inMemoryPassports: TrustPassportData[] = [
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

function initClient(): SupabaseClient | null {
  if (currentSupabaseUrl && currentSupabaseKey && currentSupabaseUrl.startsWith('http')) {
    try {
      supabaseInstance = createClient(currentSupabaseUrl, currentSupabaseKey);
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      supabaseInstance = null;
    }
  }
  return null;
}

// Initialize on module load
initClient();

export function updateSupabaseConfig(url: string, key: string): { success: boolean; isConfigured: boolean } {
  currentSupabaseUrl = (url || '').trim();
  currentSupabaseKey = (key || '').trim();
  initClient();
  return {
    success: true,
    isConfigured: isSupabaseConfigured()
  };
}

export function isSupabaseConfigured(): boolean {
  return !!(currentSupabaseUrl && currentSupabaseKey && supabaseInstance);
}

export function getSupabaseStatus(): {
  isConfigured: boolean;
  projectUrl: string;
  hasKey: boolean;
} {
  return {
    isConfigured: isSupabaseConfigured(),
    projectUrl: currentSupabaseUrl ? currentSupabaseUrl.replace(/(https?:\/\/)([^.]+)(.*)/, '$1$2$3') : '',
    hasKey: !!currentSupabaseKey
  };
}

export async function testSupabaseConnection(testUrl?: string, testKey?: string): Promise<{
  connected: boolean;
  message: string;
  latencyMs: number;
}> {
  const urlToTest = (testUrl || currentSupabaseUrl || '').trim();
  const keyToTest = (testKey || currentSupabaseKey || '').trim();

  if (!urlToTest || !keyToTest) {
    return {
      connected: false,
      message: 'Supabase URL and API Key must both be provided.',
      latencyMs: 0
    };
  }

  const start = Date.now();
  try {
    const client = createClient(urlToTest, keyToTest);
    // Ping by checking table or health endpoint
    const { error } = await client.from('trust_passports').select('count', { count: 'exact', head: true });
    
    const latencyMs = Date.now() - start;

    if (error) {
      // If table doesn't exist yet, but authentication worked:
      if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return {
          connected: true,
          message: 'Connected to Supabase! (Note: Run schema.sql in Supabase SQL editor to create the trust_passports table)',
          latencyMs
        };
      }
      return {
        connected: false,
        message: `Supabase returned: ${error.message} (${error.code || 'AUTH_ERROR'})`,
        latencyMs
      };
    }

    return {
      connected: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      latencyMs
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - start;
    const msg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      message: `Connection failed: ${msg}`,
      latencyMs
    };
  }
}

export async function savePassportToSupabase(passport: TrustPassportData): Promise<{
  savedToDatabase: boolean;
  source: 'SUPABASE' | 'IN_MEMORY';
}> {
  // Always keep in local memory for fast UI fallback
  inMemoryPassports.unshift(passport);
  if (inMemoryPassports.length > 50) inMemoryPassports.pop();

  if (isSupabaseConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance.from('trust_passports').insert({
        passport_id: passport.passportId,
        scan_id: passport.scanId,
        client_origin: passport.clientOrigin,
        model_evaluated: passport.modelEvaluated,
        privacy_score: passport.privacyScore,
        security_score: passport.securityScore,
        reliability_score: passport.reliabilityScore,
        overall_trust_score: passport.overallTrustScore,
        threat_level: passport.threatLevel,
        prompt_status: passport.promptStatus,
        privacy_events_protected: passport.privacyEventsProtected,
        threats_blocked: passport.threatsBlocked,
        recommendation_text: passport.recommendationText,
        cryptographic_signature: passport.cryptographicSignature
      });

      if (!error) {
        return { savedToDatabase: true, source: 'SUPABASE' };
      }
      console.warn('Supabase passport insert warning:', error.message);
    } catch (err) {
      console.warn('Error saving to Supabase:', err);
    }
  }

  return { savedToDatabase: false, source: 'IN_MEMORY' };
}

export async function saveIncidentToSupabase(incident: {
  incidentType: string;
  severity: string;
  triggerPhrase: string;
  reason: string;
  actionTaken: string;
  scanId: string;
}): Promise<boolean> {
  if (isSupabaseConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance.from('security_incidents').insert({
        incident_type: incident.incidentType,
        severity: incident.severity,
        trigger_phrase: incident.triggerPhrase,
        reason: incident.reason,
        action_taken: incident.actionTaken,
        scan_id: incident.scanId
      });
      return !error;
    } catch {
      return false;
    }
  }
  return false;
}

export async function getPassportsHistory(): Promise<TrustPassportData[]> {
  if (isSupabaseConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('trust_passports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data && data.length > 0) {
        return data.map((row: Record<string, unknown>) => ({
          passportId: String(row.passport_id),
          scanId: String(row.scan_id),
          timestamp: String(row.created_at),
          clientOrigin: String(row.client_origin),
          modelEvaluated: String(row.model_evaluated),
          privacyScore: Number(row.privacy_score),
          securityScore: Number(row.security_score),
          reliabilityScore: Number(row.reliability_score),
          overallTrustScore: Number(row.overall_trust_score),
          threatLevel: row.threat_level as TrustPassportData['threatLevel'],
          promptStatus: row.prompt_status as TrustPassportData['promptStatus'],
          privacyEventsProtected: Number(row.privacy_events_protected || 0),
          threatsBlocked: Number(row.threats_blocked || 0),
          recommendationText: String(row.recommendation_text),
          cryptographicSignature: String(row.cryptographic_signature)
        }));
      }
    } catch (err) {
      console.warn('Could not read from Supabase table, falling back to memory:', err);
    }
  }

  return [...inMemoryPassports];
}
