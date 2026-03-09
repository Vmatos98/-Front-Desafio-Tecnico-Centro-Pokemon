import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export function Button({ children, isLoading, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={`
        relative flex items-center justify-center px-4 py-3 font-semibold text-white tracking-wide
        bg-zinc-800 rounded-xl border border-zinc-700 shadow-sm
        hover:bg-zinc-700 hover:border-zinc-600 hover:shadow-md
        active:bg-zinc-900 active:scale-[0.98]
        transition-all duration-200 outline-none
        focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900
        disabled:bg-zinc-800 disabled:text-zinc-500 disabled:border-zinc-800 disabled:cursor-not-allowed disabled:transform-none
        w-full
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
