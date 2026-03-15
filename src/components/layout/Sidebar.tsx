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
      className="flex-shrink-0 flex flex-col h-screen transition-all duration-300 ease-in-out overflow-hidden"
      style={{
        width: collapsed ? 68 : 240,
        background: '#0b1733',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo header */}
      <div
        className="flex items-center justify-between px-4 h-16 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #091424 0%, #0e2245 50%, #0b2040 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {collapsed
          ? <VencioIcon variant="default" size={28} />
          : <VencioLogo variant="white" size={22} />
        }
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150 cursor-pointer ml-auto flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden py-2.5"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.12) transparent' }}
      >
        {groups.map((group) => (
          <div key={group.title} className="mb-3">
            {!collapsed && (
              <p
                className="px-[18px] pt-3 pb-1 text-[9px] font-bold uppercase tracking-[1.8px] whitespace-nowrap overflow-hidden"
                style={{ color: 'rgba(232,238,248,0.25)' }}
              >
                {group.title}
              </p>
            )}
            <ul className="flex flex-col" style={{ gap: 1 }}>
              {group.items.map(({ label, href, icon: Icon, badge }) => {
                const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2.5 mx-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer relative overflow-hidden whitespace-nowrap"
                      style={{
                        padding: collapsed ? '9px 14px' : '9px 14px',
                        justifyContent: collapsed ? 'center' : undefined,
                        background: active ? 'rgba(37,99,235,0.22)' : 'transparent',
                        color: active ? '#93c5fd' : 'rgba(232,238,248,0.58)',
                        fontWeight: active ? 600 : 500,
                      }}
                      onMouseEnter={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                        if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(232,238,248,0.9)';
                      }}
                      onMouseLeave={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(232,238,248,0.58)';
                      }}
                    >
                      {/* Left accent bar */}
                      {active && (
                        <span
                          className="absolute left-0"
                          style={{
                            top: '20%', bottom: '20%', width: 3,
                            borderRadius: '0 2px 2px 0',
                            background: 'linear-gradient(180deg, #2563eb, #10b981)',
                          }}
                        />
                      )}
                      <Icon size={15} className="flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{label}</span>
                          {badge !== undefined && (
                            <span
                              className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-white text-[9.5px] font-bold flex-shrink-0"
                              style={{ background: '#ef4444' }}
                            >
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badge !== undefined && (
                        <span
                          className="absolute rounded-full"
                          style={{ top: 4, right: 4, width: 7, height: 7, background: '#ef4444' }}
                        />
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

  return (
    <div
      className="px-3 py-2.5 text-[10px] text-center flex-shrink-0 whitespace-nowrap overflow-hidden"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        color: 'rgba(232,238,248,0.28)',
      }}
    >
      {!collapsed && (
        kpis ? (
          <>
            <span style={{ color: '#10b981', fontWeight: 600 }}>{kpis.ativos ?? 0} ativos</span>
            {' · '}
            <span style={{ color: '#ef4444', fontWeight: 600 }}>{kpis.criticos ?? 0} críticos</span>
            {' · '}
            {mes}
          </>
        ) : mes
      )}
    </div>
  );
}

export default Sidebar;
