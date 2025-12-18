
export type StrengthLevel = 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Elite';

export interface StrengthAnalysis {
  score: number; // 0 to 100
  level: StrengthLevel;
  feedback: string[];
  color: string;
}

export interface SecurityAudit {
  aiAssessment: string;
  isPwned: boolean;
  entropy: number;
}
