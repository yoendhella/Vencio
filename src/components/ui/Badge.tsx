import { cn } from '@/lib/utils';

type Variant = 'pri' | 'ok' | 'err' | 'warn' | 'info' | 'pur' | 'gray';

interface BadgeProps {
  variant?: Variant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  pri: 'bg-blue-100 text-blue-800',
  ok: 'bg-green-100 text-green-800',
  err: 'bg-red-100 text-red-800',
  warn: 'bg-yellow-100 text-yellow-800',
  info: 'bg-sky-100 text-sky-800',
  pur: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-700',
};

const dotColors: Record<Variant, string> = {
  pri: 'bg-blue-600',
  ok: 'bg-green-600',
  err: 'bg-red-600',
  warn: 'bg-yellow-600',
  info: 'bg-sky-600',
  pur: 'bg-purple-600',
  gray: 'bg-gray-400',
};

export function Badge({ variant = 'gray', dot, children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium', variantClasses[variant], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
}
