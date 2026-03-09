import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-sm font-medium text-zinc-300">{label}</label>
        <input
          ref={ref}
          className={`
            px-4 py-3 border rounded-xl outline-none transition-all duration-200 font-medium text-zinc-100 placeholder-zinc-500 shadow-sm
            ${error 
                ? 'border-red-500 bg-red-500/10 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900' 
                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900'}
            ${props.disabled ? 'bg-zinc-900/50 cursor-not-allowed text-zinc-600 border-zinc-800' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
