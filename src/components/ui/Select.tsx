import { forwardRef, type SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface SelectOption { value: string; label: string }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
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
        <select
          ref={ref}
          id={props.id || props.name}
          className={clsx(
            'w-full rounded-xl px-4 py-3 text-sm appearance-none',
            'border transition-all duration-150',
            'focus:outline-none focus:ring-2',
            'text-[var(--text-primary)]',
            error
              ? 'border-red-500/40 bg-[var(--bg-card)] focus:ring-red-500/20'
              : 'border-[var(--border)] bg-[var(--bg-card)] focus:border-[rgba(232,168,58,0.4)] focus:ring-[rgba(232,168,58,0.15)]',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" style={{ background: 'var(--bg-base)' }}>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-base)' }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
