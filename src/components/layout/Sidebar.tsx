'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, FilePlus, DollarSign, FolderOpen,
  Bell, TrendingUp, BarChart3, Users, History,
  Shield, FileBarChart, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { VencioLogo, VencioAppIcon } from '@/components/ui/VencioLogo';
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
        background: 'linear-gradient(180deg, #0D1B3E 0%, #132240 100%)',
        boxShadow: '4px 0 24px rgba(13,27,62,0.2)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 flex-shrink-0 border-b border-white/10">
        {collapsed
          ? <VencioAppIcon size={38} />
          : <VencioLogo variant="white" size={28} />
        }
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-7 h-7 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer ml-auto flex-shrink-0"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <p className="px-5 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
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
                      className={`flex items-center gap-3 mx-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                        collapsed ? 'px-2.5 py-2.5 justify-center' : 'px-3 py-2'
                      } ${
                        active
                          ? 'bg-white/[0.12] text-white'
                          : 'text-white/60 hover:bg-white/[0.07] hover:text-white'
                      }`}
                      style={active && !collapsed ? { borderLeft: '3px solid #00C97A', paddingLeft: 'calc(0.75rem - 3px)' } : undefined}
                    >
                      <Icon
                        size={18}
                        className="flex-shrink-0"
                        style={{ color: active ? '#00C97A' : undefined }}
                      />
                      {!collapsed && (
                        <>
                          <span className="flex-1 truncate">{label}</span>
                          {badge !== undefined && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                              {badge}
                            </span>
                          )}
                        </>
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

  if (collapsed) return <div className="h-12 border-t border-white/10" />;

  return (
    <div className="px-5 py-3 border-t border-white/10">
      <p className="text-[11px] text-white/40">
        {kpis ? (
          <>
            <span className="text-[#00C97A] font-semibold">{kpis.ativos ?? 0} ativos</span>
            {' · '}
            <span className="text-red-400 font-semibold">{kpis.criticos ?? 0} críticos</span>
            {' · '}
            {mes}
          </>
        ) : mes}
      </p>
    </div>
  );
}

export default Sidebar;
