'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, FilePlus, DollarSign, FolderOpen,
  Bell, TrendingUp, BarChart3, Users, History,
  Shield, FileBarChart, Settings, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
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
      } catch {
        // silently fail
      }
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
        { label: 'Alertas', href: '/alertas', icon: Bell, badge: alertCount > 0 ? alertCount : undefined, badgeColor: 'bg-red-100 text-red-700' },
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
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen overflow-y-auto">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pri rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg">ContratoPro</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">{group.title}</p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                    active
                      ? 'bg-blue-50 dark:bg-blue-950 text-pri font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', item.badgeColor ?? 'bg-gray-100 text-gray-600')}>
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="h-3 w-3" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <SidebarFooter />
    </aside>
  );
}

function SidebarFooter() {
  const [kpis, setKpis] = useState<{ ativos?: number; criticos?: number } | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/kpis')
      .then((r) => r.json())
      .then((d) => setKpis(d.data))
      .catch(() => null);
  }, []);

  const now = new Date();
  const mes = now.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
      <p className="text-xs text-gray-400">
        {kpis ? (
          <>
            <span className="font-medium text-green-600">{kpis.ativos ?? 0} ativos</span>
            {' · '}
            <span className="font-medium text-red-600">{kpis.criticos ?? 0} críticos</span>
            {' · '}
            {mes}
          </>
        ) : (
          <span className="text-gray-400">{mes}</span>
        )}
      </p>
    </div>
  );
}
