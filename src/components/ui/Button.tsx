import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'gold' | 'primary' | 'ghost' | 'danger' | 'teal';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  gold: [
    'bg-gradient-to-r from-[#e8a83a] to-[#c87a1a]',
    'hover:from-[#f5c96a] hover:to-[#e8a83a]',
    'text-[#080c18] font-semibold border-transparent',
    'shadow-lg shadow-[rgba(232,168,58,0.25)]',
    'hover:shadow-[rgba(232,168,58,0.40)]',
  ].join(' '),
  primary: [
    'bg-[var(--blue-dim)] hover:bg-[rgba(79,142,247,0.2)]',
    'text-[var(--blue)] border border-[rgba(79,142,247,0.3)]',
    'hover:border-[rgba(79,142,247,0.5)]',
  ].join(' '),
  teal: [
    'bg-[var(--teal-dim)] hover:bg-[rgba(45,212,191,0.18)]',
    'text-[var(--teal)] border border-[rgba(45,212,191,0.25)]',
  ].join(' '),
  ghost: [
    'bg-transparent hover:bg-[var(--bg-elevated)]',
    'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
    'border border-[var(--border)] hover:border-[var(--border-light)]',
  ].join(' '),
  danger: [
    'bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.18)]',
    'text-red-400 border border-red-500/25',
  ].join(' '),
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export function Button({
  children, variant = 'primary', size = 'md', loading,
  className, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-medium',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/50',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
