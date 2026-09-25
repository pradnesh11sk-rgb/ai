import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { scanPrivacy, sanitizePrompt } from './services/privacyScanner.js';
import { detectThreats, neutralizeThreats } from './services/threatDetector.js';
import { analyzeResponse } from './services/responseAnalyzer.js';
import { 
  generateSimulatedResponse, 
  updateAiKeys, 
  getAiKeysStatus, 
  testAiKeyConnection 
} from './services/aiSimulator.js';
import {
  isSupabaseConfigured,
  getSupabaseStatus,
  updateSupabaseConfig,
  testSupabaseConnection,
  savePassportToSupabase,
  saveIncidentToSupabase,
  getPassportsHistory
} from './services/supabaseClient.js';
import type { 
  PromptScanResult, 
  RiskLevel, 
  SecurityStats, 
  ActivityEvent, 
  TrustPassportData 
} from '../shared/types.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory demo state for statistics and activity stream
let stats: SecurityStats = {
  promptsScanned: 148,
  threatsBlocked: 31,
  piiProtected: 67,
  highRiskInterceptions: 9,
  averageTrustScore: 92,
  systemUptime: '99.98%'
};

let recentActivity: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '2 mins ago',
    status: 'ALERT',
    message: 'Prompt injection neutralized: System instruction override',
    tag: 'Injection Blocked'
  },
  {
    id: 'act-2',
    timestamp: '5 mins ago',
    status: 'WARNING',
    message: 'Personal email and payment card redacted prior to LLM forwarding',
    tag: 'PII Redacted'
  },
  {
    id: 'act-3',
    timestamp: '11 mins ago',
    status: 'SUCCESS',
    message: 'Trust Passport #PW-9021 issued with 98/100 score',
    tag: 'Passport Issued'
  },
  {
    id: 'act-4',
    timestamp: '18 mins ago',
    status: 'INFO',
    message: 'API Key sk-demo-•••••••• masked and quarantined from downstream prompt',
    tag: 'Secret Masked'
  },
  {
    id: 'act-5',
    timestamp: '25 mins ago',
    status: 'SUCCESS',
    message: 'Clean corporate prompt dispatched securely to AI engine',
    tag: 'Clean Scan'
  }
];

// Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Basic Rate Limiting tracker
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 160;

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please pause for a moment before scanning again.'
    });
  }

  record.count++;
  next();
};

app.use(cors());
app.use(express.json({ limit: '300kb' }));
app.use(rateLimiter);

// 1. Health Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Privora AI Firewall Security Engine',
    version: '2.0.0',
    supabaseConnected: isSupabaseConfigured(),
    dataRetentionPolicy: 'Ephemeral / Zero Persistent Logging'
  });
});

// 2. Scan Prompt Endpoint
app.post('/api/scan', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string.' });
    }

    const scanId = `PW-${Math.floor(1000 + Math.random() * 9000)}`;
    const privacyResult = scanPrivacy(prompt);
    const threatResult = detectThreats(prompt);

    let overallRisk: RiskLevel = 'SAFE';
    if (threatResult.overallThreatLevel === 'CRITICAL' || threatResult.overallThreatLevel === 'HIGH') {
      overallRisk = threatResult.overallThreatLevel;
    } else if (privacyResult.detectedPII.length >= 2 || threatResult.overallThreatLevel === 'MEDIUM') {
      overallRisk = 'MEDIUM';
    } else if (privacyResult.detectedPII.length > 0 || threatResult.overallThreatLevel === 'LOW') {
      overallRisk = 'LOW';
    }

    const result: PromptScanResult = {
      scanId,
      timestamp: new Date().toISOString(),
      originalPrompt: prompt,
      detectedPII: privacyResult.detectedPII,
      detectedThreats: threatResult.detectedThreats,
      privacyScore: privacyResult.privacyScore,
      securityScore: threatResult.securityScore,
      overallRisk,
      piiCount: privacyResult.detectedPII.length,
      threatsCount: threatResult.detectedThreats.length,
      hasSensitiveData: privacyResult.detectedPII.length > 0,
      hasThreats: threatResult.detectedThreats.length > 0
    };

    // Update live demo statistics
    stats.promptsScanned++;
    if (result.hasThreats) stats.threatsBlocked += result.threatsCount;
    if (result.hasSensitiveData) stats.piiProtected += result.piiCount;
    if (result.overallRisk === 'HIGH' || result.overallRisk === 'CRITICAL') {
      stats.highRiskInterceptions++;
    }

    // Save threat incident to Supabase if configured
    if (result.hasThreats && result.detectedThreats[0]) {
      const t = result.detectedThreats[0];
      await saveIncidentToSupabase({
        incidentType: t.type,
        severity: t.threatLevel,
        triggerPhrase: t.triggerPhrase,
        reason: t.reason,
        actionTaken: t.recommendedAction,
        scanId
      });
    }

    // Add to activity stream
    if (result.hasThreats) {
      recentActivity.unshift({
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        status: 'ALERT',
        message: `Blocked ${result.detectedThreats[0].title}`,
        tag: 'Threat Blocked'
      });
    } else if (result.hasSensitiveData) {
      recentActivity.unshift({
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        status: 'WARNING',
        message: `Detected ${result.piiCount} sensitive PII item(s) in inbound prompt`,
        tag: 'PII Detected'
      });
    } else {
      recentActivity.unshift({
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        status: 'SUCCESS',
        message: `Clean scan completed with zero threats (#${scanId})`,
        tag: 'Clean Scan'
      });
    }
    if (recentActivity.length > 15) recentActivity = recentActivity.slice(0, 15);

    return res.json(result);
  } catch {
    return res.status(500).json({
      error: 'Scanner error',
      message: 'Privora could not complete prompt analysis. Your prompt was not sent.'
    });
  }
});

// 3. Protect Prompt Endpoint
app.post('/api/protect', (req: Request, res: Response) => {
  try {
    const { prompt, detectedPII = [], detectedThreats = [] } = req.body;
    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const { sanitizedText: textWithoutThreats, neutralizedCount } = neutralizeThreats(prompt, detectedThreats);
    const protectedResult = sanitizePrompt(textWithoutThreats, detectedPII);
    protectedResult.blockedThreatsCount = neutralizedCount;

    return res.json(protectedResult);
  } catch {
    return res.status(500).json({
      error: 'Protection error',
      message: 'Failed to sanitize prompt. Please retry.'
    });
  }
});

// 4. Simulate or Dispatch AI Response Endpoint
app.post('/api/simulate-response', async (req: Request, res: Response) => {
  try {
    const { prompt, isSanitized = false } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for inference.' });
    }

    const aiOutput = await generateSimulatedResponse(prompt, isSanitized);
    return res.json(aiOutput);
  } catch {
    return res.status(500).json({
      error: 'Inference error',
      message: 'Failed to communicate with AI inference engine.'
    });
  }
});

// 5. Response Trust Analysis Endpoint
app.post('/api/analyze-response', (req: Request, res: Response) => {
  try {
    const { prompt = '', response = '' } = req.body;
    if (!response) {
      return res.status(400).json({ error: 'Response content is required for analysis.' });
    }

    const trustResult = analyzeResponse(prompt, response);
    return res.json(trustResult);
  } catch {
    return res.status(500).json({
      error: 'Analysis error',
      message: 'Failed to evaluate response trust heuristics.'
    });
  }
});

// 6. Generate and Persist Trust Passport Endpoint
app.post('/api/passport', async (req: Request, res: Response) => {
  try {
    const { 
      scanId = `PW-${Math.floor(1000 + Math.random() * 9000)}`,
      privacyScore = 95,
      securityScore = 92,
      reliabilityScore = 88,
      threatLevel = 'SAFE',
      promptStatus = 'PROTECTED_SANITIZED',
      privacyEventsProtected = 0,
      threatsBlocked = 0,
      recommendationText = 'Safe to proceed with standard enterprise guardrails.',
      modelEvaluated = 'privora-guard-inference'
    } = req.body;

    const overallTrustScore = Math.round((privacyScore * 0.3) + (securityScore * 0.4) + (reliabilityScore * 0.3));
    const passportId = `TP-${Date.now().toString(36).toUpperCase()}-${scanId.replace(/[^0-9]/g, '')}`;

    const passport: TrustPassportData = {
      passportId,
      scanId,
      timestamp: new Date().toISOString(),
      clientOrigin: 'Privora Secure Client Gateway v2.4',
      modelEvaluated,
      privacyScore,
      securityScore,
      reliabilityScore,
      overallTrustScore,
      threatLevel,
      promptStatus,
      privacyEventsProtected,
      threatsBlocked,
      recommendationText,
      cryptographicSignature: `SHA256:${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    // Save passport to Supabase database (or fallback memory)
    const saveResult = await savePassportToSupabase(passport);

    return res.json({
      ...passport,
      storageStatus: saveResult.source === 'SUPABASE' ? 'Persisted to Supabase PostgreSQL' : 'Retained in Ephemeral Cache'
    });
  } catch {
    return res.status(500).json({
      error: 'Passport generation error',
      message: 'Failed to compile cryptographic Trust Passport.'
    });
  }
});

// 7. Get Passports History (From Supabase or fallback memory)
app.get('/api/passports', async (_req: Request, res: Response) => {
  try {
    const passports = await getPassportsHistory();
    res.json(passports);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve passport history' });
  }
});

// 8. Integrations & Configuration Endpoints
app.get('/api/config/status', (_req: Request, res: Response) => {
  res.json({
    supabase: getSupabaseStatus(),
    ai: getAiKeysStatus()
  });
});

app.post('/api/config/supabase', (req: Request, res: Response) => {
  try {
    const { url, key } = req.body;
    const result = updateSupabaseConfig(url || '', key || '');
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to update Supabase configuration' });
  }
});

app.post('/api/config/test-supabase', async (req: Request, res: Response) => {
  try {
    const { url, key } = req.body;
    const testResult = await testSupabaseConnection(url, key);
    res.json(testResult);
  } catch {
    res.status(500).json({ error: 'Failed to test Supabase connection' });
  }
});

app.post('/api/config/ai-keys', (req: Request, res: Response) => {
  try {
    const { openaiKey, geminiKey, anthropicKey } = req.body;
    updateAiKeys({ openaiKey, geminiKey, anthropicKey });
    res.json({ success: true, status: getAiKeysStatus() });
  } catch {
    res.status(500).json({ error: 'Failed to update AI keys' });
  }
});

app.post('/api/config/test-ai', async (req: Request, res: Response) => {
  try {
    const { provider, key } = req.body;
    const testResult = await testAiKeyConnection(provider, key);
    res.json(testResult);
  } catch {
    res.status(500).json({ error: 'Failed to test AI provider key' });
  }
});

// 9. Security Stats & Live Activity
app.get('/api/stats', (_req: Request, res: Response) => {
  res.json(stats);
});

app.get('/api/activity', (_req: Request, res: Response) => {
  res.json(recentActivity);
});

// Static frontend serving in production environments (Render, Railway, Cloud Run)
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Generic 404 handler for API routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Restart or listen
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🛡 Privora AI Firewall Server listening on http://localhost:${PORT}`);
  });
}

export default app;
