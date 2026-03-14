'use client';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  search?: string;
  onSearch?: (v: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function FilterBar({ search, onSearch, children, className }: FilterBarProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-4 flex-wrap', className)}>
      {onSearch !== undefined && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search ?? ''}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pri w-56"
          />
        </div>
      )}
      {children}
    </div>
  );
}
