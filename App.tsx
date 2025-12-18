
import React, { useState, useEffect, useCallback } from 'react';
import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import { analyzeStrength, calculateHash } from './services/security';
import { getAIAudit } from './services/geminiService';
import { StrengthAnalysis } from './types';

const App: React.FC = () => {
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [analysis, setAnalysis] = useState<StrengthAnalysis>(analyzeStrength(''));
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Update simple metrics on change
  useEffect(() => {
    const updateMetrics = async () => {
      setAnalysis(analyzeStrength(password));
      const h = await calculateHash(password);
      setHash(h);
    };
    updateMetrics();
  }, [password]);

  const handleAudit = async () => {
    if (!password) return;
    setIsAnalyzing(true);
    setAiReport(null);
    const report = await getAIAudit(password);
    setAiReport(report);
    setIsAnalyzing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 mb-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
          <i className="fas fa-lock text-3xl"></i>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          Sentinel<span className="text-indigo-500">Vault</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Advanced credential auditing platform powered by cryptographic standards and Gemini AI security kernels.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Basic Stats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">Target Credential</label>
              <PasswordInput value={password} onChange={setPassword} />
            </div>

            <StrengthMeter analysis={analysis} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Entropy Score</div>
                <div className="text-xl font-bold text-slate-200">
                  {password ? (Math.log2(new Set(password).size) * password.length).toFixed(1) : 0} <span className="text-xs text-slate-500 font-normal">bits</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Brute-Force Estimate</div>
                <div className="text-xl font-bold text-slate-200">
                  {analysis.score > 80 ? '> 1000y' : analysis.score > 50 ? '~ 5y' : '< 1 day'}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Requirements Check</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {[
                  { label: '8+ Characters', met: password.length >= 8 },
                  { label: 'Uppercase', met: /[A-Z]/.test(password) },
                  { label: 'Numbers', met: /[0-9]/.test(password) },
                  { label: 'Special Chars', met: /[^A-Za-z0-9]/.test(password) },
                ].map((req, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <i className={`fas ${req.met ? 'fa-check-circle text-emerald-500' : 'fa-circle text-slate-800'} text-xs`}></i>
                    <span className={req.met ? 'text-slate-300' : 'text-slate-600'}>{req.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">SHA-256 Checksum</h3>
              <button 
                onClick={() => copyToClipboard(hash)}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Copy Hash
              </button>
            </div>
            <div className="font-mono text-xs break-all bg-slate-950 p-4 rounded-xl border border-slate-800/50 text-slate-400 leading-relaxed select-all">
              {hash || '0x0000000000000000000000000000000000000000000000000000000000000000'}
            </div>
          </div>
        </div>

        {/* Right Column: AI Audit & Guidance */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-indigo-600 p-8 rounded-3xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3 text-indigo-100">
                <i className="fas fa-microchip text-2xl animate-pulse"></i>
                <h2 className="text-xl font-bold">AI Security Audit</h2>
              </div>
              <p className="text-indigo-100/80 text-sm leading-relaxed">
                Leverage the power of Gemini-3 to perform a contextual risk assessment of your credential against modern adversary tactics.
              </p>
              <button
                onClick={handleAudit}
                disabled={!password || isAnalyzing}
                className={`w-full py-4 rounded-2xl font-bold tracking-wide transition-all shadow-lg flex items-center justify-center space-x-2 ${
                  !password || isAnalyzing 
                    ? 'bg-indigo-700 text-indigo-300 cursor-not-allowed' 
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 active:scale-[0.98]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span>ANALYZING KERNEL...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles"></i>
                    <span>INITIATE DEEP AUDIT</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {aiReport && (
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center space-x-2 text-indigo-400 mb-4">
                <i className="fas fa-clipboard-check"></i>
                <span className="text-xs font-bold uppercase tracking-widest">Advisory Report</span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed italic">
                "{aiReport}"
              </div>
            </div>
          )}

          <div className="bg-slate-950 p-8 rounded-3xl border border-dashed border-slate-800 space-y-4">
             <h4 className="text-sm font-bold text-slate-400">Cyber Hygiene Tips</h4>
             <ul className="space-y-4">
               {[
                 { icon: 'fa-repeat', text: 'Never reuse passwords across different platforms.' },
                 { icon: 'fa-key', text: 'Use a trusted password manager like Bitwarden or 1Password.' },
                 { icon: 'fa-user-shield', text: 'Enable 2-Factor Authentication (MFA) wherever possible.' },
               ].map((tip, idx) => (
                 <li key={idx} className="flex items-start space-x-3 group">
                   <div className="mt-1 w-6 h-6 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-500 group-hover:text-indigo-400 transition-colors">
                     <i className={`fas ${tip.icon} text-[10px]`}></i>
                   </div>
                   <span className="text-xs text-slate-500 leading-normal">{tip.text}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
        &copy; {new Date().getFullYear()} SentinelVault Security Systems &bull; Confidential Assessment Node
      </footer>
    </div>
  );
};

export default App;
