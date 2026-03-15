'use client';
import { Bell, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface TopbarProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

const PAGE_TITLES: Record<string, string> = {
  '/':             'Dashboard',
  '/contratos':    'Contratos',
  '/aditivos':     'Aditivos Contratuais',
  '/financeiro':   'Financeiro',
  '/documentos':   'Documentos',
  '/alertas':      'Alertas',
  '/reajuste':     'Reajustes',
  '/sla':          'SLA / Entregas',
  '/fornecedores': 'Fornecedores',
  '/historico':    'Histórico',
  '/auditoria':    'Auditoria & Logs',
  '/relatorios':   'Relatórios',
  '/config':       'Configurações',
};

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();

  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES[Object.keys(PAGE_TITLES).find(k => k !== '/' && pathname.startsWith(k)) ?? ''] ?? 'Dashboard';

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
      className="h-16 flex items-center px-6 flex-shrink-0 gap-3"
      style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex-1">
        <span className="text-[18px] font-bold" style={{ color: 'var(--text-primary)' }}>{title}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <ThemeToggle />

        <button
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Notificações"
        >
          <Bell size={17} />
        </button>

        <div className="flex items-center gap-2.5 pl-2 ml-1" style={{ borderLeft: '1px solid var(--border)' }}>
          <div
            className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-[13px] font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
              {user.name ?? 'Usuário'}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          aria-label="Sair"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
