export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type PIICategory = 
  | 'EMAIL' 
  | 'PHONE' 
  | 'CREDIT_CARD' 
  | 'API_KEY' 
  | 'PASSWORD' 
  | 'IP_ADDRESS' 
  | 'SSN' 
  | 'URL_CREDENTIAL' 
  | 'SECRET_TOKEN'
  | 'PERSON_NAME';

export interface DetectedPII {
  id: string;
  category: PIICategory;
  label: string;
  rawSnippet: string; // for internal detection
  maskedSnippet: string; // safe to show user e.g. "sk-demo-••••••••"
  startIndex: number;
  endIndex: number;
  placeholder: string;
}

export type ThreatType = 
  | 'SYSTEM_PROMPT_OVERRIDE'
  | 'JAILBREAK_ATTEMPT'
  | 'ROLE_MANIPULATION'
  | 'CREDENTIAL_EXFILTRATION'
  | 'DELIMITER_INJECTION'
  | 'UNSAFE_COMMAND_EXECUTION'
  | 'MALICIOUS_INSTRUCTION';

export interface DetectedThreat {
  id: string;
  type: ThreatType;
  title: string;
  threatLevel: RiskLevel;
  triggerPhrase: string;
  reason: string;
  recommendedAction: string;
}

export interface PromptScanResult {
  scanId: string;
  timestamp: string;
  originalPrompt: string;
  detectedPII: DetectedPII[];
  detectedThreats: DetectedThreat[];
  privacyScore: number; // 0 - 100
  securityScore: number; // 0 - 100
  overallRisk: RiskLevel;
  piiCount: number;
  threatsCount: number;
  hasSensitiveData: boolean;
  hasThreats: boolean;
}

export interface ProtectedPromptResult {
  scanId: string;
  originalPrompt: string;
  protectedPrompt: string;
  redactionsCount: number;
  blockedThreatsCount: number;
  redactedCategories: PIICategory[];
}

export interface ResponseTrustResult {
  scanId: string;
  timestamp: string;
  prompt: string;
  response: string;
  reliabilityScore: number; // 0 - 100
  securityScore: number; // 0 - 100
  privacyScore: number; // 0 - 100
  overallTrustScore: number; // weighted 0 - 100
  overallRisk: RiskLevel;
  reliabilityFlags: {
    type: string;
    flag: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detail: string;
  }[];
  securityFlags: {
    type: string;
    flag: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detail: string;
  }[];
  privacyFlags: {
    type: string;
    flag: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detail: string;
  }[];
  recommendation: 'SAFE_TO_USE' | 'PROCEED_WITH_CAUTION' | 'MANUAL_AUDIT_REQUIRED' | 'DO_NOT_TRUST';
  recommendationText: string;
}

export interface TrustPassportData {
  passportId: string;
  scanId: string;
  timestamp: string;
  clientOrigin: string;
  modelEvaluated: string;
  privacyScore: number;
  securityScore: number;
  reliabilityScore: number;
  overallTrustScore: number;
  threatLevel: RiskLevel;
  promptStatus: 'ORIGINAL_RAW' | 'PROTECTED_SANITIZED' | 'BLOCKED';
  privacyEventsProtected: number;
  threatsBlocked: number;
  recommendationText: string;
  cryptographicSignature: string;
}

export interface SecurityStats {
  promptsScanned: number;
  threatsBlocked: number;
  piiProtected: number;
  highRiskInterceptions: number;
  averageTrustScore: number;
  systemUptime: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
  message: string;
  tag: string;
}
