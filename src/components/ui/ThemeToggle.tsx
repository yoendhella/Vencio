'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  if (variant === 'icon') {
    const isDark = resolvedTheme === 'dark';
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 cursor-pointer hover:bg-[var(--border)] ${className}`}
        style={{ color: 'var(--text-secondary)' }}
        title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        aria-label="Alternar tema"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  }

  const options = [
    { value: 'light'  as const, label: 'Claro',   Icon: Sun },
    { value: 'dark'   as const, label: 'Escuro',  Icon: Moon },
    { value: 'system' as const, label: 'Sistema', Icon: Monitor },
  ];

  return (
    <div
      className={`flex items-center gap-1 p-1 rounded-lg border ${className}`}
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer ${
            theme === value
              ? 'bg-primary text-white shadow-sm'
              : 'hover:bg-[var(--surface)]'
          }`}
          style={theme !== value ? { color: 'var(--text-secondary)' } : undefined}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
