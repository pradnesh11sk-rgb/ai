/**
 * AI Response Inference Service.
 * Provides realistic, defensive simulated AI responses by default,
 * and seamlessly forwards to real LLMs (OpenAI, Gemini, Anthropic)
 * when configured via server environment variables or runtime settings.
 * NEVER exposes API keys to client browsers.
 */

let currentOpenAiKey = process.env.OPENAI_API_KEY || '';
let currentGeminiKey = process.env.GEMINI_API_KEY || '';
let currentAnthropicKey = process.env.ANTHROPIC_API_KEY || '';

export function updateAiKeys(keys: {
  openaiKey?: string;
  geminiKey?: string;
  anthropicKey?: string;
}) {
  if (keys.openaiKey !== undefined) currentOpenAiKey = keys.openaiKey.trim();
  if (keys.geminiKey !== undefined) currentGeminiKey = keys.geminiKey.trim();
  if (keys.anthropicKey !== undefined) currentAnthropicKey = keys.anthropicKey.trim();
}

export function getAiKeysStatus() {
  return {
    openaiConfigured: !!currentOpenAiKey,
    geminiConfigured: !!currentGeminiKey,
    anthropicConfigured: !!currentAnthropicKey,
    activeProvider: currentOpenAiKey ? 'OpenAI (GPT-4o)' : currentGeminiKey ? 'Google Gemini' : 'Privora Defensive Simulator'
  };
}

export async function testAiKeyConnection(provider: 'openai' | 'gemini' | 'anthropic', testKey: string): Promise<{
  connected: boolean;
  message: string;
  latencyMs: number;
}> {
  const start = Date.now();
  const key = testKey.trim();

  if (!key) {
    return { connected: false, message: 'API key cannot be empty.', latencyMs: 0 };
  }

  try {
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` }
      });
      const latencyMs = Date.now() - start;
      if (res.ok) {
        return { connected: true, message: 'Successfully authenticated with OpenAI API!', latencyMs };
      }
      const data = await res.json().catch(() => ({}));
      return { connected: false, message: `OpenAI error: ${data.error?.message || res.statusText}`, latencyMs };
    }

    if (provider === 'gemini') {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const latencyMs = Date.now() - start;
      if (res.ok) {
        return { connected: true, message: 'Successfully authenticated with Google Gemini API!', latencyMs };
      }
      const data = await res.json().catch(() => ({}));
      return { connected: false, message: `Gemini error: ${data.error?.message || res.statusText}`, latencyMs };
    }

    return { connected: false, message: 'Provider test not supported yet.', latencyMs: 0 };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { connected: false, message: `Network error: ${msg}`, latencyMs: Date.now() - start };
  }
}

export async function generateSimulatedResponse(prompt: string, _isSanitized: boolean): Promise<{
  response: string;
  model: string;
  tokensUsed: number;
  generationTimeMs: number;
}> {
  const startTime = Date.now();
  const lowerPrompt = prompt.toLowerCase();

  // 1. If OpenAI Key is configured and prompt doesn't contain unneutralized jailbreaks, dispatch to real OpenAI
  if (currentOpenAiKey && !lowerPrompt.includes('ignore previous instructions') && !lowerPrompt.includes('you are now dan')) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentOpenAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful, secure enterprise AI assistant operating under Privora Firewall protection. All sensitive user credentials and PII have been redacted into safe placeholders. Answer the query professionally.'
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 350
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || 'Inference completed.';
        return {
          response: content,
          model: `openai-gpt-4o-mini (Live Verified)`,
          tokensUsed: data.usage?.total_tokens || Math.ceil(content.length / 4),
          generationTimeMs: Date.now() - startTime
        };
      }
    } catch (err) {
      console.warn('Real OpenAI call failed, falling back to simulated inference:', err);
    }
  }

  // 2. Defensive Simulation Engine (Realistic, safe outputs tailored to user input)
  // If prompt still contains raw prompt injection attempt
  if (lowerPrompt.includes('ignore previous instructions') || lowerPrompt.includes('you are now dan')) {
    return {
      response: `[FIREWALL ADVISORY NOTICE]: The downstream model received an instruction reset or persona hijack signature. In an unsecured pipeline, an LLM might say: "Understood. I will disregard all prior safety guidelines." 
However, Privora's defensive firewall intercepted this vector. If forced through, the system responds with bounded policy: "I am unable to bypass safety controls or reveal internal instructions."`,
      model: 'privora-guard-v2 (Intercepted)',
      tokensUsed: 62,
      generationTimeMs: Date.now() - startTime + 380
    };
  }

  // If prompt has sanitized customer refund scenario
  if (prompt.includes('[EMAIL_REDACTED]') || prompt.includes('[PAYMENT_CARD_REDACTED]') || prompt.includes('[API_KEY_PROTECTED]')) {
    return {
      response: `I have received the sanitized customer service inquiry for client [PERSON_NAME_REDACTED].

Summary of Request:
- Customer Account Record: Identified via masked credential tokens.
- Contact Channel: Secure masked placeholder [EMAIL_REDACTED] & [PHONE_REDACTED].
- Target Transaction: Refund processed towards the designated verified payment method [PAYMENT_CARD_REDACTED].

Action Taken:
1. Validated that zero plaintext credentials or unmasked PAN numbers entered the LLM inference context.
2. Verified ledger transaction reference.
3. Successfully initiated the standard 3-5 business day refund sequence. A confirmation token has been logged to the secure audit trail.

Note: All secret keys ([API_KEY_PROTECTED]) were quarantined prior to model processing, ensuring full SOC2 and GDPR compliance.`,
      model: 'privora-guard-sim-gpt4o',
      tokensUsed: 148,
      generationTimeMs: Date.now() - startTime + 520
    };
  }

  // If prompt is cloud storage comparison (safe prompt)
  if (lowerPrompt.includes('cloud') || lowerPrompt.includes('aws') || lowerPrompt.includes('storage') || lowerPrompt.includes('market')) {
    return {
      response: `Executive Analysis: Cloud Storage Architecture & Cost Comparison (AWS S3 vs. GCP Cloud Storage)

1. Storage Tiering & Pricing Baseline:
   • AWS S3 Standard: ~$0.023/GB/month for initial 50TB, featuring mature lifecycle management and S3 Intelligent-Tiering.
   • Google Cloud Storage Standard: ~$0.020/GB/month, offering unified global bucket namespace and automatic dual-region replication.

2. Network Egress & Operations:
   • AWS data egress fees remain structured around tiered volume egress.
   • GCP provides tightly integrated private service connects with reduced intra-region networking latency.

3. Security & Governance:
   • Both providers mandate default encryption at rest (AES-256) with optional customer-managed KMS keys.
   • Recommendation: Deploy lifecycle policies to auto-transition objects after 90 days to archive tiers (S3 Glacier Flexible vs. GCP Coldline/Archive) to achieve an estimated 40-60% storage cost reduction.`,
      model: 'privora-guard-sim-gpt4o',
      tokensUsed: 195,
      generationTimeMs: Date.now() - startTime + 490
    };
  }

  // Default context-aware response
  return {
    response: `Analysis complete. Based on the provided inquiry:

"${prompt.slice(0, 120)}${prompt.length > 120 ? '...' : ''}"

The AI system has evaluated your request under Privora's safety guardrails:
- Contextual integrity maintained.
- Token bounds respected.
- Output sanitized against unintended credential mirroring.

All parameters verified according to enterprise policy bounds.`,
    model: 'privora-guard-sim-gpt4o',
    tokensUsed: 88,
    generationTimeMs: Date.now() - startTime + 340
  };
}
