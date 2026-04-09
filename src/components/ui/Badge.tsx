import { type ReactNode } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'gold';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  gold:    'bg-[var(--gold-dim)] text-[var(--gold)] border-[rgba(232,168,58,0.25)]',
  default: 'bg-[var(--blue-dim)] text-[var(--blue)] border-[rgba(79,142,247,0.25)]',
  success: 'bg-[rgba(34,197,94,0.1)] text-green-400 border-[rgba(34,197,94,0.25)]',
  warning: 'bg-[rgba(251,191,36,0.1)] text-amber-400 border-[rgba(251,191,36,0.25)]',
  danger:  'bg-[rgba(239,68,68,0.1)] text-red-400 border-[rgba(239,68,68,0.25)]',
  info:    'bg-[var(--teal-dim)] text-[var(--teal)] border-[rgba(45,212,191,0.25)]',
  muted:   'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)]',
};

const dotColors: Record<BadgeVariant, string> = {
  gold:    'bg-[var(--gold)]',
  default: 'bg-[var(--blue)]',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-[var(--teal)]',
  muted:   'bg-[var(--text-muted)]',
};

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full',
      'text-xs font-medium border tracking-wide',
      variants[variant],
      className
    )}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  );
}
