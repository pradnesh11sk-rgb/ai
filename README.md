# 🛡️ PRIVORA — The AI Firewall

> **“Don't just use AI. Know when to trust it.”**  
> **“Protect what you send to AI. Verify what AI sends back.”**

Privora is a production-quality, modern, defensive cybersecurity web application designed to act as an intelligent security and trust layer between users and generative AI systems.

---

## 🏛️ The Three Pillars

1. **Privacy** — Detect and redact sensitive personal identifiers (PII), payment cards, credentials, IP addresses, and secret tokens before they ever reach an AI model.
2. **Security** — Detect and neutralize prompt injections, system prompt override attempts, persona hijacks (DAN / Jailbreaks), delimiter attacks, and malicious payloads.
3. **Trust** — Heuristically evaluate AI responses for unsupported certainty, ungrounded statistics, dangerous execution commands, or reflected sensitive tokens, issuing a verifiable **AI Trust Passport**.

---

## 🚀 Key Features

- **Interactive AI Security Scanner**:
  - Live character and token estimations.
  - Multi-stage scanning visualization with real-time heuristic feedback.
  - **🎬 1-Click Judge Quick-Test Scenarios**:
    - **Scenario 1**: 🟢 Safe Corporate Inquiry (Low Risk)
    - **Scenario 2**: 🟠 Privacy & PII Leak (Sensitive personal identifiers & secret tokens)
    - **Scenario 3**: 🔴 Prompt Injection / Jailbreak (DAN persona hijack & system instruction override)
    - **Scenario 4**: 🟡 Secret & Credential Leak (Database credentials & AWS tokens)
- **PII & Privacy Engine**:
  - Scans emails, phone numbers, credit cards, SSNs, API keys (`sk-...`, `AKIA...`, `ghp_...`), passwords, IP addresses, and credential URLs.
  - Safe masking (e.g., `sk-demo-••••••••`, `4532-••••-••••-3042`, `s***@cyberdyne.io`). Real secrets are never displayed.
- **Prompt Protection & Sanitization**:
  - Replaces detected PII with structured tokens (`[EMAIL_REDACTED]`, `[PAYMENT_CARD_REDACTED]`, `[API_KEY_PROTECTED]`).
  - Neutralizes injection clauses (`[INJECTION_ATTEMPT_NEUTRALIZED]`).
  - Side-by-side or tabbed Before vs. After diff with 1-click clipboard copy.
- **Simulated AI Inference**:
  - Safe downstream model simulation engine (`privora-guard-sim-gpt4o`).
  - Structured for zero-leak server-side environment variables if connecting real LLMs (OpenAI, Anthropic, Gemini).
- **AI Response Trust Analysis**:
  - Egress guardrail checking reliability, output security, and privacy mirroring.
  - Generates Privacy, Security, and Reliability sub-scores with overall risk level.
- **🪪 The AI Trust Passport**:
  - Cryptographic audit passport with unique Scan ID (`#PW-XXXX`), timestamp, tri-metric scores, threat status, and SHA-256 digital signature.
  - Export / Print modal with print styling, clean Markdown report, and raw JSON audit export.
- **Security Center (SOC Telemetry)**:
  - Metrics: Prompts Scanned, Threats Blocked, PII Protected, High-Risk Interceptions.
  - Threat vector distribution meters.
  - Real-time live security activity stream with toggleable feed.
- **Privacy by Design**:
  - Zero permanent prompt storage policy.
  - In-memory ephemeral processing only.
  - Defense-in-depth architecture.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vanilla CSS design system, Lucide icons, Vite.
- **Backend**: Node.js, Express 5, CORS, Security headers (`nosniff`, `DENY`, `X-XSS-Protection`), Rate-limiting middleware.
- **Ports**:
  - **Frontend (Vite)**: `http://localhost:5173/`
  - **Backend (Express)**: `http://localhost:3001/`

---

## 🏃 Running Locally

```bash
# Install dependencies
npm run install

# Start both backend and frontend concurrently
npm run dev

# Or run individually:
npm run dev:server   # Express API on port 3001
npm run dev:client   # Vite Frontend on port 5173

# Production build
npm run build
```
