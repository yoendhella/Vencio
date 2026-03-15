import { cn } from '@/lib/utils';

type Color = 'pri' | 'ok' | 'err' | 'warn' | 'pur' | 'info';

interface KpiCardProps {
  label: string;
  value: string | number;
  meta?: string;
  color?: Color;
  className?: string;
}

const colorHex: Record<Color, string> = {
  pri:  '#2563eb',
  ok:   '#10b981',
  err:  '#ef4444',
  warn: '#f59e0b',
  pur:  '#8b5cf6',
  info: '#0ea5e9',
};

export function KpiCard({ label, value, meta, color = 'pri', className }: KpiCardProps) {
  const hex = colorHex[color];
  return (
    <div
      className={cn('rounded-xl border overflow-hidden transition-all duration-150 hover:-translate-y-0.5', className)}
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ height: 3, background: hex, borderRadius: '12px 12px 0 0' }} />
      <div className="px-5 py-4">
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-2xl font-extrabold leading-none mb-1.5" style={{ color: hex }}>{value}</p>
        {meta && <p className="text-[11px]" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{meta}</p>}
      </div>
    </div>
  );
}
