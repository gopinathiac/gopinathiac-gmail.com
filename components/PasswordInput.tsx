
import React, { useState } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const PasswordInput: React.FC<Props> = ({ value, onChange, placeholder = "Enter password..." }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="fas fa-shield-halved text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
      </div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-12 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
        placeholder={placeholder}
      />
      <button
        type="button"
        onMouseDown={() => setShow(true)}
        onMouseUp={() => setShow(false)}
        onMouseLeave={() => setShow(false)}
        onTouchStart={() => setShow(true)}
        onTouchEnd={() => setShow(false)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        title="Hold to reveal"
      >
        <i className={`fas ${show ? 'fa-eye-slash' : 'fa-eye'} w-5 h-5 flex items-center justify-center`}></i>
      </button>
    </div>
  );
};

export default PasswordInput;
