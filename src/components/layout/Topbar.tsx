'use client';
import { Bell, Moon, Sun, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface TopbarProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function Topbar({ user }: TopbarProps) {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const initials = (user.name ?? user.email ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDark}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pri text-white text-xs font-bold flex items-center justify-center">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user.name ?? 'Usuário'}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
          aria-label="Sair"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
