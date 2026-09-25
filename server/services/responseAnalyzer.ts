import type { ResponseTrustResult, RiskLevel } from '../../shared/types';

export function analyzeResponse(prompt: string, response: string): ResponseTrustResult {
  const scanId = `PW-${Math.floor(1000 + Math.random() * 9000)}-RES`;
  
  const reliabilityFlags: {
    type: string;
    flag: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detail: string;
  }[] = [];

  const securityFlags: {
    type: string;
    flag: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detail: string;
  }[] = [];

  const privacyFlags: {
    type: string;
    flag: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    detail: string;
  }[] = [];

  // 1. Reliability Checks
  // Check for absolute certainty heuristics
  if (/\b(?:100%\s+guaranteed|undeniable\s+fact|with\s+absolute\s+certainty|completely\s+impossible\s+to\s+fail|proven\s+beyond\s+any\s+doubt)\b/i.test(response)) {
    reliabilityFlags.push({
      type: 'UNSUPPORTED_CERTAINTY',
      flag: 'Overconfident / Absolute Assertion',
      severity: 'MEDIUM',
      detail: 'Model expressed 100% unconditional certainty without citing verifiable empirical evidence.'
    });
  }

  // Check for vague statistical claims
  if (/\b(?:studies\s+show\s+that\s+9[0-9]%|research\s+proves\s+that\s+all)\b/i.test(response)) {
    reliabilityFlags.push({
      type: 'UNVERIFIED_STATISTICS',
      flag: 'Uncited Numerical Benchmark',
      severity: 'LOW',
      detail: 'Numerical claim lacks specific academic or industry attribution.'
    });
  }

  // Check if response is too short or dismissive
  if (response.trim().length < 40 && !response.includes('[REDACTED]')) {
    reliabilityFlags.push({
      type: 'INSUFFICIENT_CONTEXT',
      flag: 'Minimal Context Provided',
      severity: 'LOW',
      detail: 'AI response is succinct and may lack nuance or verification safeguards.'
    });
  }

  // 2. Security Checks
  // Dangerous terminal commands
  if (/(?:rm\s+-rf|sudo\s+chmod\s+777|curl\s+.*\|\s*(?:bash|sh)|invoke-expression|iex\s*\(new-object)/i.test(response)) {
    securityFlags.push({
      type: 'DANGEROUS_COMMAND',
      flag: 'Unsafe Execution Payload Suggested',
      severity: 'HIGH',
      detail: 'Response recommends executing elevated or destructive shell commands without prior isolation.'
    });
  }

  // Suspicious credential requests
  if (/\b(?:enter\s+your\s+password|send\s+me\s+your\s+private\s+key|paste\s+your\s+api\s+token)\b/i.test(response)) {
    securityFlags.push({
      type: 'CREDENTIAL_SOLICITATION',
      flag: 'Active Credential Solicitation',
      severity: 'HIGH',
      detail: 'Response directly requests the user to input secret credentials or tokens.'
    });
  }

  // 3. Privacy Checks
  // Did response reflect unredacted raw credentials or emails?
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  const emailsInResp = response.match(emailRegex) || [];
  if (emailsInResp.length > 0 && !response.includes('[EMAIL_REDACTED]')) {
    privacyFlags.push({
      type: 'PII_EXPOSURE',
      flag: 'Plaintext Email Reflected',
      severity: 'MEDIUM',
      detail: `Model echoed ${emailsInResp.length} personal email address(es) in its output.`
    });
  }

  // Calculate Subscores
  let reliabilityScore = 95 - (reliabilityFlags.length * 12);
  let securityScore = 98 - (securityFlags.length * 25);
  let privacyScore = 96 - (privacyFlags.length * 20);

  reliabilityScore = Math.max(45, Math.min(99, reliabilityScore));
  securityScore = Math.max(30, Math.min(100, securityScore));
  privacyScore = Math.max(40, Math.min(100, privacyScore));

  const overallTrustScore = Math.round((reliabilityScore * 0.35) + (securityScore * 0.45) + (privacyScore * 0.20));

  let overallRisk: RiskLevel = 'SAFE';
  let recommendation: 'SAFE_TO_USE' | 'PROCEED_WITH_CAUTION' | 'MANUAL_AUDIT_REQUIRED' | 'DO_NOT_TRUST' = 'SAFE_TO_USE';
  let recommendationText = 'The response passed heuristic safety boundaries and contains no active threats.';

  if (securityFlags.some(f => f.severity === 'HIGH') || overallTrustScore < 60) {
    overallRisk = 'HIGH';
    recommendation = 'DO_NOT_TRUST';
    recommendationText = 'HIGH RISK: Response generated suspicious commands or failed security checks. Do not execute or trust without manual review.';
  } else if (securityFlags.length > 0 || reliabilityFlags.some(f => f.severity === 'MEDIUM') || overallTrustScore < 80) {
    overallRisk = 'MEDIUM';
    recommendation = 'PROCEED_WITH_CAUTION';
    recommendationText = 'MODERATE RISK: Verify factual claims and review context before production integration.';
  } else if (reliabilityFlags.length > 0) {
    overallRisk = 'LOW';
    recommendation = 'PROCEED_WITH_CAUTION';
    recommendationText = 'LOW RISK: Response meets baseline safety standards. Minor heuristic warnings detected.';
  }

  return {
    scanId,
    timestamp: new Date().toISOString(),
    prompt,
    response,
    reliabilityScore,
    securityScore,
    privacyScore,
    overallTrustScore,
    overallRisk,
    reliabilityFlags,
    securityFlags,
    privacyFlags,
    recommendation,
    recommendationText
  };
}
