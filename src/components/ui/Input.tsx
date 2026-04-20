import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={props.id || props.name}
            className="block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={props.id || props.name}
          className={clsx(
            'w-full rounded-xl px-4 py-3 text-sm',
            'border transition-all duration-150',
            'focus:outline-none focus:ring-2',
            'placeholder:text-[var(--text-muted)]',
            'text-[var(--text-primary)]',
            error
              ? 'border-red-500/40 bg-[var(--bg-card)] focus:ring-red-500/20'
              : 'border-[var(--border)] bg-[var(--bg-card)] focus:border-[rgba(232,168,58,0.4)] focus:ring-[rgba(232,168,58,0.15)]',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
