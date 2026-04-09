import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  accent?: 'gold' | 'teal' | 'blue' | 'none';
}

export function Card({ children, className, hover, accent = 'none' }: CardProps) {
  const accentStyles = {
    none: '',
    gold: 'border-t-[var(--gold)] border-t-2 border-x-[var(--border)] border-b-[var(--border)]',
    teal: 'border-t-[var(--teal)] border-t-2 border-x-[var(--border)] border-b-[var(--border)]',
    blue: 'border-t-[var(--blue)] border-t-2 border-x-[var(--border)] border-b-[var(--border)]',
  };

  return (
    <div className={clsx(
      'relative rounded-xl p-6',
      'bg-[var(--bg-card)] border border-[var(--border)]',
      accent === 'none' && 'border-[var(--border)]',
      accentStyles[accent],
      hover && [
        'transition-all duration-200 cursor-pointer',
        'hover:border-[var(--border-light)] hover:bg-[#16203a]',
        'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30',
      ],
      className
    )}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mb-5', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={clsx('font-display font-bold text-[var(--text-primary)] text-lg tracking-tight', className)}>
      {children}
    </h3>
  );
}
