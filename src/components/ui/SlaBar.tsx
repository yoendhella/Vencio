import { corSla } from '@/lib/utils';

interface SlaBarProps {
  value: number;
  width?: number;
  className?: string;
}

export function SlaBar({ value, width = 80, className }: SlaBarProps) {
  const color = corSla(value);
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={className} style={{ width }}>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs font-medium" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
