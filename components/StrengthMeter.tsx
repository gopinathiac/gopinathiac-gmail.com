
import React from 'react';
import { StrengthAnalysis } from '../types';

interface Props {
  analysis: StrengthAnalysis;
}

const StrengthMeter: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-widest text-slate-400">
        <span>Security Level</span>
        <span className={analysis.color.replace('bg-', 'text-')}>
          {analysis.level} ({analysis.score}%)
        </span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div 
          className={`h-full transition-all duration-500 ease-out ${analysis.color}`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>
    </div>
  );
};

export default StrengthMeter;
