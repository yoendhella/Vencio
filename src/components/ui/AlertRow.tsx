import { cn } from '@/lib/utils';

type Variant = 'danger' | 'warning' | 'info' | 'success';

interface AlertRowProps {
  variant?: Variant;
  title: string;
  desc?: string;
  action?: React.ReactNode;
  meta?: string;
  className?: string;
}

const dotColors: Record<Variant, string> = {
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  success: 'bg-green-500',
};

export function AlertRow({ variant = 'info', title, desc, action, meta, className }: AlertRowProps) {
  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors', className)}>
      <span className={cn('mt-1.5 h-2 w-2 rounded-full flex-shrink-0', dotColors[variant])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{title}</p>
        {desc && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {meta && <span className="text-xs text-gray-400 flex-shrink-0">{meta}</span>}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
