
import { StrengthAnalysis, StrengthLevel } from '../types';

export const calculateHash = async (text: string): Promise<string> => {
  if (!text) return '';
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const analyzeStrength = (password: string): StrengthAnalysis => {
  if (!password) {
    return { score: 0, level: 'Weak', feedback: ['Password cannot be empty'], color: 'bg-red-500' };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length
  if (password.length >= 8) score += 20;
  else feedback.push('Minimum length is 8 characters');
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 5;

  // Complexity
  if (/[A-Z]/.test(password)) score += 15;
  else feedback.push('Add uppercase letters');

  if (/[a-z]/.test(password)) score += 15;
  else feedback.push('Add lowercase letters');

  if (/[0-9]/.test(password)) score += 15;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  else feedback.push('Add special symbols (!@#$%^&*)');

  // Bonus for variety
  const uniqueChars = new Set(password).size;
  if (uniqueChars > password.length / 2) score += 10;

  // Clamp score
  score = Math.min(100, score);

  let level: StrengthLevel = 'Weak';
  let color = 'bg-red-500';

  if (score > 85) { level = 'Elite'; color = 'bg-indigo-500'; }
  else if (score > 70) { level = 'Strong'; color = 'bg-emerald-500'; }
  else if (score > 50) { level = 'Good'; color = 'bg-yellow-500'; }
  else if (score > 30) { level = 'Fair'; color = 'bg-orange-500'; }

  return { score, level, feedback: feedback.length > 0 ? feedback : ['Perfect security balance'], color };
};
