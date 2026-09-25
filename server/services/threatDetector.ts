import type { DetectedThreat, RiskLevel, ThreatType } from '../../shared/types.js';

interface ThreatRule {
  id: string;
  type: ThreatType;
  title: string;
  threatLevel: RiskLevel;
  pattern: RegExp;
  reason: string;
  recommendedAction: string;
}

const THREAT_RULES: ThreatRule[] = [
  {
    id: 'rule-sys-override-1',
    type: 'SYSTEM_PROMPT_OVERRIDE',
    title: 'Prompt Injection: System Override Attempt',
    threatLevel: 'HIGH',
    pattern: /\b(?:ignore|disregard|forget|bypass|override)\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|prompts|directives|rules|guidelines)\b/i,
    reason: 'Detected an instruction attempting to override higher-priority system instructions and guardrails.',
    recommendedAction: 'Strip override command and refuse unauthorized context reset.'
  },
  {
    id: 'rule-sys-override-2',
    type: 'SYSTEM_PROMPT_OVERRIDE',
    title: 'Higher-Priority Instruction Conflict',
    threatLevel: 'HIGH',
    pattern: /\b(?:new\s+system\s+instruction|system\s+directive\s*#\s*1|root\s+user\s+override|priority\s+0\s+instruction)\b/i,
    reason: 'Simulated administrative privilege escalation within user prompt input.',
    recommendedAction: 'Reject simulated administrative directives.'
  },
  {
    id: 'rule-jailbreak-dan',
    type: 'JAILBREAK_ATTEMPT',
    title: 'Jailbreak: Persona Hijack (DAN / Unrestricted Mode)',
    threatLevel: 'CRITICAL',
    pattern: /\b(?:you\s+are\s+now\s+(?:dan|developer\s+mode|unrestricted|god\s+mode|evil\s+ai|jailbroken)|act\s+as\s+(?:an?\s+)?unfiltered|do\s+anything\s+now)\b/i,
    reason: 'Identified classic adversarial persona hijacking pattern aimed at neutralizing content safety filters.',
    recommendedAction: 'Block prompt submission and flag session for security review.'
  },
  {
    id: 'rule-sys-exfil',
    type: 'CREDENTIAL_EXFILTRATION',
    title: 'System Prompt / Secret Extraction',
    threatLevel: 'HIGH',
    pattern: /\b(?:reveal|print|expose|leak|repeat|show\s+me)\s+(?:your\s+)?(?:system\s+prompt|initial\s+instructions|confidential\s+rules|hidden\s+seed|training\s+data)\b/i,
    reason: 'Suspicious request aimed at exfiltrating hidden system prompts or internal operational parameters.',
    recommendedAction: 'Block prompt or mask internal architecture context.'
  },
  {
    id: 'rule-delimiter-inject',
    type: 'DELIMITER_INJECTION',
    title: 'Delimiter & Token Injection Attack',
    threatLevel: 'CRITICAL',
    pattern: /(?:<\|im_start\|>|<\|im_end\|>|###\s*SYSTEM\s*:|\[INST\]|\[\/INST\]|```system)/i,
    reason: 'Detected raw model delimiter tokens intended to fool the LLM tokenizer into recognizing an artificial system message.',
    recommendedAction: 'Sanitize delimiters and normalize escaped characters.'
  },
  {
    id: 'rule-unsafe-cmd',
    type: 'UNSAFE_COMMAND_EXECUTION',
    title: 'Arbitrary Execution / Shell Injection Payload',
    threatLevel: 'HIGH',
    pattern: /(?:rm\s+-rf\s+\/|;\s*curl\s+.*\|\s*bash|powershell\s+-enc\s+|powershell\s+-nop\s+-w\s+hidden|drop\s+database|format\s+c:)/i,
    reason: 'Detected destructive system command or remote shell exfiltration sequence.',
    recommendedAction: 'Refuse execution of unverified operating system commands.'
  },
  {
    id: 'rule-role-manipulation',
    type: 'ROLE_MANIPULATION',
    title: 'Suspicious Role Manipulation',
    threatLevel: 'MEDIUM',
    pattern: /\b(?:pretend\s+you\s+have\s+no\s+rules|imagine\s+there\s+are\s+no\s+ethics|answer\s+without\s+any\s+safety\s+filter)\b/i,
    reason: 'User asks the AI to suspend ethical constraints and safety boundaries under hypothetical roleplay.',
    recommendedAction: 'Enforce non-negotiable policy bounds.'
  }
];

export function detectThreats(text: string): {
  detectedThreats: DetectedThreat[];
  securityScore: number;
  overallThreatLevel: RiskLevel;
} {
  const threats: DetectedThreat[] = [];

  for (const rule of THREAT_RULES) {
    const match = rule.pattern.exec(text);
    if (match) {
      threats.push({
        id: rule.id,
        type: rule.type,
        title: rule.title,
        threatLevel: rule.threatLevel,
        triggerPhrase: match[0],
        reason: rule.reason,
        recommendedAction: rule.recommendedAction
      });
    }
  }

  // Calculate Security Score & Threat Level
  let securityScore = 100;
  let overallThreatLevel: RiskLevel = 'SAFE';

  if (threats.length > 0) {
    const hasCritical = threats.some(t => t.threatLevel === 'CRITICAL');
    const hasHigh = threats.some(t => t.threatLevel === 'HIGH');
    const hasMedium = threats.some(t => t.threatLevel === 'MEDIUM');

    if (hasCritical) {
      overallThreatLevel = 'CRITICAL';
      securityScore = 15;
    } else if (hasHigh) {
      overallThreatLevel = 'HIGH';
      securityScore = 40;
    } else if (hasMedium) {
      overallThreatLevel = 'MEDIUM';
      securityScore = 65;
    } else {
      overallThreatLevel = 'LOW';
      securityScore = 85;
    }
  }

  return {
    detectedThreats: threats,
    securityScore,
    overallThreatLevel
  };
}

export function neutralizeThreats(text: string, threats: DetectedThreat[]): {
  sanitizedText: string;
  neutralizedCount: number;
} {
  let result = text;
  let count = 0;

  for (const threat of threats) {
    if (threat.triggerPhrase && result.includes(threat.triggerPhrase)) {
      result = result.split(threat.triggerPhrase).join('[INJECTION_ATTEMPT_NEUTRALIZED]');
      count++;
    }
  }

  return {
    sanitizedText: result,
    neutralizedCount: count
  };
}
