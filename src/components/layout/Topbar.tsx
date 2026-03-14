'use client';
import { Bell, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface TopbarProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function Topbar({ user }: TopbarProps) {
  const initials = (user.name ?? user.email ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const colors = ['#1E5FD4', '#00C97A', '#F59E0B', '#EF4444', '#7C3AED', '#0369A1'];
  const color = colors[(user.email?.charCodeAt(0) ?? 0) % colors.length];

  return (
    <header
      className="h-14 flex items-center justify-between px-6 flex-shrink-0 border-b"
      style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div />
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Notificações"
        >
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l" style={{ borderColor: 'var(--border)' }}>
          <div
            className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
              {user.name ?? 'Usuário'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
