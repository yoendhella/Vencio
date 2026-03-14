import { cn } from '@/lib/utils';

type Color = 'pri' | 'ok' | 'err' | 'warn' | 'pur' | 'info';

interface KpiCardProps {
  label: string;
  value: string | number;
  meta?: string;
  color?: Color;
  className?: string;
}

const colorBars: Record<Color, string> = {
  pri: 'bg-blue-700',
  ok: 'bg-green-600',
  err: 'bg-red-600',
  warn: 'bg-yellow-600',
  pur: 'bg-purple-600',
  info: 'bg-sky-700',
};

const colorValues: Record<Color, string> = {
  pri: 'text-blue-700',
  ok: 'text-green-600',
  err: 'text-red-600',
  warn: 'text-yellow-600',
  pur: 'text-purple-600',
  info: 'text-sky-700',
};

export function KpiCard({ label, value, meta, color = 'pri', className }: KpiCardProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden', className)}>
      <div className={cn('h-1', colorBars[color])} />
      <div className="px-5 py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className={cn('text-2xl font-bold', colorValues[color])}>{value}</p>
        {meta && <p className="text-xs text-gray-400 mt-1">{meta}</p>}
      </div>
    </div>
  );
}
