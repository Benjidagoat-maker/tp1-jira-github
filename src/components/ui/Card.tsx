import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm',
        hover && 'transition-all duration-200 hover:border-slate-600/80 hover:bg-slate-800/80 hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={clsx('font-display font-semibold text-slate-100 text-lg', className)}>
      {children}
    </h3>
  );
}
