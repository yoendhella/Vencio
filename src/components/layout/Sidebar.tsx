'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, FilePlus, DollarSign, FolderOpen,
  Bell, TrendingUp, BarChart3, Users, History,
  Shield, FileBarChart, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { VencioLogo, VencioIcon } from '@/components/ui/VencioLogo';
import { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

function useAlertCount() {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/alertas');
        if (res.ok) {
          const data = await res.json();
          setCount(data.data?.total ?? 0);
        }
      } catch { /* silently fail */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

export function Sidebar() {
  const pathname = usePathname();
  const alertCount = useAlertCount();
  const [collapsed, setCollapsed] = useState(false);

  const groups: NavGroup[] = [
    {
      title: 'Painel',
      items: [{ label: 'Dashboard', href: '/', icon: LayoutDashboard }],
    },
    {
      title: 'Contratos',
      items: [
        { label: 'Contratos', href: '/contratos', icon: FileText },
        { label: 'Aditivos Contratuais', href: '/aditivos', icon: FilePlus },
        { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
        { label: 'Documentos', href: '/documentos', icon: FolderOpen },
      ],
    },
    {
      title: 'Operacional',
      items: [
        { label: 'Alertas', href: '/alertas', icon: Bell, badge: alertCount > 0 ? alertCount : undefined },
        { label: 'Reajustes', href: '/reajuste', icon: TrendingUp },
        { label: 'SLA / Entregas', href: '/sla', icon: BarChart3 },
      ],
    },
    {
      title: 'Cadastros',
      items: [
        { label: 'Fornecedores', href: '/fornecedores', icon: Users },
        { label: 'Histórico', href: '/historico', icon: History },
      ],
    },
    {
      title: 'Governança',
      items: [
        { label: 'Auditoria & Logs', href: '/auditoria', icon: Shield },
        { label: 'Relatórios', href: '/relatorios', icon: FileBarChart },
        { label: 'Configurações', href: '/config', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className="flex-shrink-0 flex flex-col h-screen transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 64 : 240,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        boxShadow: '4px 0 16px rgba(13,27,62,0.07)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 h-16 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {collapsed
          ? <VencioIcon variant="default" size={30} />
          : <VencioLogo variant="dark" size={26} />
        }
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150 cursor-pointer ml-auto flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}>
        {groups.map((group) => (
          <div key={group.title} className="mb-3">
            {!collapsed && (
              <p
                className="px-5 mb-1 text-[9px] font-bold uppercase tracking-[1.8px]"
                style={{ color: 'var(--text-muted)' }}
              >
                {group.title}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map(({ label, href, icon: Icon, badge }) => {
                const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-2.5 mx-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer relative ${
                        collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2'
                      }`}
                      style={{
                        background: active
                          ? 'rgba(37,99,235,0.10)'
                          : 'transparent',
                        color: active
                          ? '#2563eb'
                          : 'var(--text-secondary)',
                        fontWeight: active ? 600 : 500,
                        borderLeft: active && !collapsed ? '3px solid #10b981' : undefined,
                        paddingLeft: active && !collapsed ? 'calc(0.75rem - 3px)' : undefined,
                      }}
                      onMouseEnter={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                      }}
                      onMouseLeave={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }}
                    >
                      <Icon
                        size={16}
                        className="flex-shrink-0"
                        style={{ color: active ? '#10b981' : 'var(--text-muted)', opacity: active ? 1 : 0.8 }}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{label}</span>
                          {badge !== undefined && (
                            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9.5px] font-bold">
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badge !== undefined && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const [kpis, setKpis] = useState<{ ativos?: number; criticos?: number } | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/kpis')
      .then((r) => r.json())
      .then((d) => setKpis(d.data))
      .catch(() => null);
  }, []);

  const mes = new Date().toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

  if (collapsed) return <div className="h-12" style={{ borderTop: '1px solid var(--border)' }} />;

  return (
    <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
        {kpis ? (
          <>
            <span className="font-semibold" style={{ color: '#10b981' }}>{kpis.ativos ?? 0} ativos</span>
            {' · '}
            <span className="font-semibold" style={{ color: '#ef4444' }}>{kpis.criticos ?? 0} críticos</span>
            {' · '}
            {mes}
          </>
        ) : mes}
      </p>
    </div>
  );
}

export default Sidebar;
