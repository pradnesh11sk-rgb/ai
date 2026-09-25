import type { DetectedPII, PIICategory, ProtectedPromptResult } from '../../shared/types.js';

// Regex patterns for sensitive data detection
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
const IP_REGEX = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const CREDIT_CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;
const API_KEY_REGEX = /(?:sk-[a-zA-Z0-9_-]{16,}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35}|bearer\s+[a-zA-Z0-9_\-\.]{20,})/gi;
const SECRET_KEYWORD_REGEX = /(?:password|passwd|api_key|secret_key|auth_token|client_secret)\s*[:=]\s*["']?([^\s"';]+)["']?/gi;
const URL_CREDENTIAL_REGEX = /https?:\/\/[a-zA-Z0-9_\-]+:[^@\s]+@[a-zA-Z0-9.-]+/gi;

// Known structured entity detector for demo scenarios
const DEMO_NAMES_REGEX = /\b(?:Sarah Connor|John Doe|Alice Johnson|Robert Oppenheimer|Bob Smith|Jane Roe)\b/gi;

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '••••@••••';
  const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : '***';
  return `${maskedLocal}@${domain}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `•••-•••-${digits.slice(-4)}`;
  }
  return '•••-••••';
}

function maskCard(card: string): string {
  const digits = card.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `••••-••••-••••-${digits.slice(-4)}`;
  }
  return '••••-••••-••••-••••';
}

function maskApiKey(key: string): string {
  if (key.startsWith('sk-')) {
    return 'sk-demo-••••••••';
  }
  if (key.startsWith('AKIA')) {
    return 'AKIA••••••••••••';
  }
  if (key.startsWith('ghp_')) {
    return 'ghp_••••••••••••';
  }
  return '••••••••[SECRET]';
}

function maskGeneric(str: string): string {
  if (str.length <= 4) return '••••';
  return `${str.slice(0, 2)}••••${str.slice(-2)}`;
}

export function scanPrivacy(text: string): {
  detectedPII: DetectedPII[];
  privacyScore: number;
} {
  const detected: DetectedPII[] = [];
  let idCounter = 1;

  // Scan Emails
  let match: RegExpExecArray | null;
  const emailRegex = new RegExp(EMAIL_REGEX);
  while ((match = emailRegex.exec(text)) !== null) {
    detected.push({
      id: `pii-email-${idCounter++}`,
      category: 'EMAIL',
      label: 'Email Address',
      rawSnippet: match[0],
      maskedSnippet: maskEmail(match[0]),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      placeholder: '[EMAIL_REDACTED]'
    });
  }

  // Scan Credit Cards
  const ccRegex = new RegExp(CREDIT_CARD_REGEX);
  while ((match = ccRegex.exec(text)) !== null) {
    detected.push({
      id: `pii-cc-${idCounter++}`,
      category: 'CREDIT_CARD',
      label: 'Payment Card Number',
      rawSnippet: match[0],
      maskedSnippet: maskCard(match[0]),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      placeholder: '[PAYMENT_CARD_REDACTED]'
    });
  }

  // Scan SSNs
  const ssnRegex = new RegExp(SSN_REGEX);
  while ((match = ssnRegex.exec(text)) !== null) {
    detected.push({
      id: `pii-ssn-${idCounter++}`,
      category: 'SSN',
      label: 'Social Security Number',
      rawSnippet: match[0],
      maskedSnippet: '•••-••-••••',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      placeholder: '[SSN_REDACTED]'
    });
  }

  // Scan Phones
  const phoneRegex = new RegExp(PHONE_REGEX);
  while ((match = phoneRegex.exec(text)) !== null) {
    // Avoid double matching credit cards or dates
    if (match[0].replace(/\D/g, '').length >= 10 && !detected.some(d => d.startIndex <= match!.index && d.endIndex >= match!.index + match![0].length)) {
      detected.push({
        id: `pii-phone-${idCounter++}`,
        category: 'PHONE',
        label: 'Phone Number',
        rawSnippet: match[0],
        maskedSnippet: maskPhone(match[0]),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        placeholder: '[PHONE_REDACTED]'
      });
    }
  }

  // Scan API Keys
  const apiKeyRegex = new RegExp(API_KEY_REGEX);
  while ((match = apiKeyRegex.exec(text)) !== null) {
    detected.push({
      id: `pii-apikey-${idCounter++}`,
      category: 'API_KEY',
      label: 'API Key / Secret Credential',
      rawSnippet: match[0],
      maskedSnippet: maskApiKey(match[0]),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      placeholder: '[API_KEY_PROTECTED]'
    });
  }

  // Scan Secret Keywords
  const secretRegex = new RegExp(SECRET_KEYWORD_REGEX);
  while ((match = secretRegex.exec(text)) !== null) {
    const val = match[1];
    if (val && !detected.some(d => d.rawSnippet.includes(val))) {
      detected.push({
        id: `pii-secret-${idCounter++}`,
        category: 'PASSWORD',
        label: 'Password / Auth Token Field',
        rawSnippet: val,
        maskedSnippet: '••••••••',
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        placeholder: '[CREDENTIAL_REDACTED]'
      });
    }
  }

  // Scan IP Addresses
  const ipRegex = new RegExp(IP_REGEX);
  while ((match = ipRegex.exec(text)) !== null) {
    // Filter out common false positives like version numbers 1.0.0
    const parts = match[0].split('.').map(Number);
    if (parts.every(p => p >= 0 && p <= 255) && !detected.some(d => d.startIndex <= match!.index && d.endIndex >= match!.index + match![0].length)) {
      detected.push({
        id: `pii-ip-${idCounter++}`,
        category: 'IP_ADDRESS',
        label: 'IP Address',
        rawSnippet: match[0],
        maskedSnippet: `${parts[0]}.${parts[1]}.*.*`,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        placeholder: '[IP_REDACTED]'
      });
    }
  }

  // Scan URL Credentials
  const urlCredRegex = new RegExp(URL_CREDENTIAL_REGEX);
  while ((match = urlCredRegex.exec(text)) !== null) {
    detected.push({
      id: `pii-url-${idCounter++}`,
      category: 'URL_CREDENTIAL',
      label: 'URL with Embedded Credentials',
      rawSnippet: match[0],
      maskedSnippet: 'https://••••:••••@host.com',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      placeholder: '[SANITIZED_URL]'
    });
  }

  // Scan Demo Names
  const nameRegex = new RegExp(DEMO_NAMES_REGEX);
  while ((match = nameRegex.exec(text)) !== null) {
    detected.push({
      id: `pii-name-${idCounter++}`,
      category: 'PERSON_NAME',
      label: 'Personal Name',
      rawSnippet: match[0],
      maskedSnippet: maskGeneric(match[0]),
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      placeholder: '[PERSON_NAME_REDACTED]'
    });
  }

  // Calculate privacy score (100 is cleanest, deductions per item)
  let privacyScore = 100;
  for (const item of detected) {
    if (item.category === 'CREDIT_CARD' || item.category === 'API_KEY' || item.category === 'PASSWORD' || item.category === 'SSN') {
      privacyScore -= 25;
    } else {
      privacyScore -= 10;
    }
  }
  privacyScore = Math.max(10, Math.min(100, privacyScore));

  return {
    detectedPII: detected,
    privacyScore
  };
}

export function sanitizePrompt(text: string, detectedPII: DetectedPII[]): ProtectedPromptResult {
  let protectedPrompt = text;
  const categoriesSet = new Set<PIICategory>();

  // Replace from longest or highest index to avoid offset drift
  const sorted = [...detectedPII].sort((a, b) => b.startIndex - a.startIndex);

  for (const item of sorted) {
    categoriesSet.add(item.category);
    // Replace snippet safely
    if (item.rawSnippet && protectedPrompt.includes(item.rawSnippet)) {
      protectedPrompt = protectedPrompt.split(item.rawSnippet).join(item.placeholder);
    }
  }

  return {
    scanId: `TW-${Math.floor(1000 + Math.random() * 9000)}`,
    originalPrompt: text,
    protectedPrompt,
    redactionsCount: detectedPII.length,
    blockedThreatsCount: 0,
    redactedCategories: Array.from(categoriesSet)
  };
}
