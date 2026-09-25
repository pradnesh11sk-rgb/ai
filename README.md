# 🛡️ TRUSTWALL — The Autonomous Zero-Trust AI Firewall

> **“Don't just deploy AI. Prove you can trust it.”**  
> **“Protect what you send to AI. Verify what AI sends back.”**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Deployment-success?style=for-the-badge&logo=vercel)](https://ai-zeta-wheat.vercel.app)
[![Zero-Trust](https://img.shields.io/badge/Security-Zero--Trust%20Enclave-8b5cf6?style=for-the-badge&logo=shield)](https://ai-zeta-wheat.vercel.app)
[![OWASP Top 10 for LLMs](https://img.shields.io/badge/OWASP-LLM01--LLM10%20Compliant-06b6d4?style=for-the-badge)](https://ai-zeta-wheat.vercel.app)

**TrustWall** is an enterprise-grade, zero-trust AI security firewall and cryptographic attestation engine. It acts as an autonomous defense proxy between users, applications, and large language models (LLMs).

---

## 🎯 The Core Problem

As enterprises integrate LLMs into workflows, two critical failure modes emerge:
1. **Inbound Data Leaks**: Developers and employees paste customer SSNs, credit cards, proprietary database connection strings, and secret API tokens into models—risking permanent inclusion in training logs.
2. **Adversarial Exploitation**: Malicious actors use recursive prompt injections, DAN persona hijacks, and delimiter hijacking to bypass safety filters and exfiltrate internal system prompts.
3. **Outbound Hallucination & Risk**: Unchecked AI responses can reflect unmasked secrets, hallucinatory assertions, or dangerous execution scripts.

**TrustWall solves this bi-directionally without breaking the AI's utility.**

---

## ⚡ The Breakthrough: Zero-Knowledge Local Re-Hydration

Traditional firewalls strip private data, which breaks downstream AI responses (e.g., the AI can't personalize an answer if names and accounts are deleted).

**TrustWall introduces Client-Side Zero-Knowledge Re-Hydration**:
1. The **Ingress Firewall** tokenizes sensitive entities into semantically-typed placeholders (e.g. `[CUSTOMER_NAME_1]`, `[PAYMENT_CARD_1]`).
2. The foundation LLM processes the query knowing only the placeholders—**zero plaintext secrets ever leave the client machine or touch model servers**.
3. Upon receiving the model output, the user's browser sandbox securely re-injects the original plaintext values locally in client memory.

---

## 🏛️ System Architecture

```
[ USER / APP ]
      │ (Raw prompt with PII / Secrets)
      ▼
┌──────────────────────────────────────────────┐
│  TRUSTWALL INGRESS FIREWALL                  │
│  ├─ Multi-Vector PII & Secret Scanner (12+)  │
│  ├─ Adversarial Prompt Injection Neutralizer │
│  └─ Semantic Token Sanitizer                 │
└──────────────────────────────────────────────┘
      │ (Sanitized prompt with structured tokens)
      ▼
┌──────────────────────────────────────────────┐
│  FOUNDATION MODEL (GPT-4o / Claude / Gemini) │
│  └─ Zero access to raw PII or credentials   │
└──────────────────────────────────────────────┘
      │ (Model response with structured tokens)
      ▼
┌──────────────────────────────────────────────┐
│  TRUSTWALL EGRESS VERIFIER & AUDITOR         │
│  ├─ Grounding & Hallucination Auditor        │
│  ├─ Outbound Secret Exfiltration Barrier     │
│  ├─ Cryptographic Trust Passport Synthesis   │
│  └─ Zero-Knowledge Client De-masking Engine  │
└──────────────────────────────────────────────┘
      │ (Attested output + Verifiable Seal)
      ▼
[ VERIFIED CLIENT DELIVERY ]
```

---

## 🚀 Key Modules & Demonstrable Features

### 1. 🔍 AI Prompt Security Scanner
- **Live Token & Risk Estimation**: Inbound heuristic analysis with progressive telemetry steps.
- **1-Click Judge Quick Scenarios**:
  - `🟢 Low Risk`: Corporate cloud architecture query.
  - `🟠 PII Leak`: Customer support refund containing SSN, phone, email, and credit card.
  - `🔴 Prompt Injection`: DAN jailbreak payload and recursive command execution override.
  - `🟡 Credential Leak`: AWS secrets and postgres connection string exfiltration attempt.
- **Side-by-Side Diff Inspector**: Visual comparison between vulnerable raw input and sanitized guardrail output.

### 2. 🔓 Client-Side Zero-Knowledge De-Masking (Showstopper)
- Interactive toggle in the AI response console allowing authorized auditors to reveal re-hydrated secrets locally without exposing them to cloud providers.

### 3. 🌐 Zero-Trust App & API Inspector
- Inspect external SaaS endpoints, custom ChatGPT plugins, Slack bots, and LangChain webhooks.
- Multi-phase simulated fuzzing across OWASP LLM01–LLM10 vulnerabilities.
- Generates an **Embeddable Cryptographic Trust Badge** (`<a href="..."><img src="..." /></a>`) that third-party developers can display on their site.

### 4. 🪪 The AI Trust Passport
- Immutable verification record featuring:
  - Unique Scan ID (`#TRW-XXXX`) & Attestation Hash
  - Tri-metric composite scoring (Privacy, Security, Reliability)
  - Exportable as printable report, clean Markdown audit, or machine-readable JSON.

### 5. 🎨 Multi-Spectrum Theme Engine
- Switch dynamically between 4 military-grade palettes:
  - 💜 **Cyberpunk Violet**: Neon Obsidian & Ultraviolet Cyber Pulse
  - 💚 **Military Emerald**: Tactical Matrix & Vault Gold Defense
  - 💙 **Electric Sapphire**: Arctic Subzero & Deep Space Cobalt
  - ❤️ **Crimson Aegis**: Blood Obsidian & Solar Flare

---

## 💻 Local Development

```bash
# Clone repository
git clone https://github.com/pradnesh11sk-rgb/ai.git
cd ai

# Install dependencies
npm install

# Run frontend development server
npm run dev:client

# Build for production validation
npm run build
```

---

## 🔒 Security & Privacy Commitments
- **Zero Data Retention**: Raw user prompts are processed strictly in ephemeral memory and discarded immediately.
- **No Model Retraining**: Zero submissions are used to retrain external LLMs.
- **Client-Side Zero-Knowledge**: Sensitive token mappings remain exclusively within local browser memory.
