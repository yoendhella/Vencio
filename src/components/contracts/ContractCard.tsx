import {
  Calendar, DollarSign, Building2, FileText, ArrowUpRight,
  AlertTriangle, CheckCircle2, Clock, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';

// ── TYPES ──────────────────────────────────────

type VencimentoStatus = 'ativo' | 'vencendo' | 'urgente' | 'vencido';

export interface ContractData {
  id: string;
  nome: string;
  empresa: string;
  valor: number;
  dataInicio: string;
  dataVencimento: string;
  diasRestantes: number;
  status: 'ativo' | 'vencendo' | 'urgente' | 'vencido' | 'encerrado';
  progresso: number;
  categoria?: string;
}

export interface StatCardData {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

// ── HELPERS ────────────────────────────────────

function getVencimentoStatus(dias: number): VencimentoStatus {
  if (dias < 0)   return 'vencido';
  if (dias <= 7)  return 'urgente';
  if (dias <= 30) return 'vencendo';
  return 'ativo';
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── VENCIMENTO BADGE ───────────────────────────

export function VencimentoBadge({ diasRestantes, className = '' }: { diasRestantes: number; className?: string }) {
  const s = getVencimentoStatus(diasRestantes);
  const cfg = {
    ativo:    { label: diasRestantes > 365 ? `${Math.floor(diasRestantes / 30)}m` : `${diasRestantes}d`, cls: 'bg-[#E6FFF5] text-[#009E5A]', Icon: CheckCircle2, pulse: false },
    vencendo: { label: `${diasRestantes}d`, cls: 'bg-[#FFFBEB] text-[#92400E]', Icon: Clock, pulse: false },
    urgente:  { label: diasRestantes === 0 ? 'Hoje!' : `${diasRestantes}d`, cls: 'bg-red-500 text-white', Icon: AlertTriangle, pulse: true },
    vencido:  { label: `${Math.abs(diasRestantes)}d atrás`, cls: 'bg-red-100 text-red-700', Icon: AlertTriangle, pulse: false },
  }[s];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.cls} ${cfg.pulse ? 'animate-pulse' : ''} ${className}`}>
      <cfg.Icon size={11} />
      {cfg.label}
    </span>
  );
}

// ── CONTRACT CARD ──────────────────────────────

const statusLabel = { ativo: 'Ativo', vencendo: 'Vencendo', urgente: 'Urgente', vencido: 'Vencido', encerrado: 'Encerrado' };
const statusBadge: Record<string, string> = {
  ativo:     'bg-[#E6FFF5] text-[#009E5A]',
  vencendo:  'bg-[#FFFBEB] text-[#92400E]',
  urgente:   'bg-red-500 text-white',
  vencido:   'bg-red-100 text-red-700',
  encerrado: 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white/50',
};
const progressColor: Record<string, string> = {
  ativo:     'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
  vencendo:  'linear-gradient(135deg, #F59E0B 0%, #EF6C00 100%)',
  urgente:   '#EF4444',
  vencido:   '#EF4444',
  encerrado: 'var(--border)',
};

export function ContractCard({ contract, onClick }: { contract: ContractData; onClick?: (id: string) => void }) {
  const { id, nome, empresa, valor, dataVencimento, diasRestantes, status, progresso, categoria } = contract;

  return (
    <div
      onClick={() => onClick?.(id)}
      className="rounded-xl border p-5 transition-all duration-200 cursor-pointer group hover:-translate-y-0.5"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 100%)' }}
          >
            <FileText size={18} style={{ color: '#1E5FD4' }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{nome}</h3>
            <div className="flex items-center gap-1 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              <Building2 size={12} />
              <span className="text-xs truncate">{empresa}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[status]}`}>
            {statusLabel[status]}
          </span>
          <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#1E5FD4' }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <DollarSign size={13} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(valor)}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{formatDate(dataVencimento)}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Ciclo de vida</span>
          <VencimentoBadge diasRestantes={diasRestantes} />
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 5, backgroundColor: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progresso, 100)}%`, background: progressColor[status] }}
          />
        </div>
      </div>

      {categoria && (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
          style={{ backgroundColor: 'var(--border-muted)', color: 'var(--text-secondary)' }}
        >
          {categoria}
        </span>
      )}
    </div>
  );
}

// ── STATS CARD ─────────────────────────────────

export function StatsCard({ data }: { data: StatCardData }) {
  const { label, value, sublabel, icon, iconBg, iconColor, trend, trendValue } = data;
  const trendCfg = {
    up:      { Icon: TrendingUp,   color: '#009E5A', bg: '#E6FFF5' },
    down:    { Icon: TrendingDown, color: '#EF4444', bg: '#FEF2F2' },
    neutral: { Icon: Minus,        color: '#5A6B7D', bg: 'var(--border-muted)' },
  };

  return (
    <div
      className="rounded-xl border p-5 transition-shadow duration-200"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
          style={{ background: iconBg }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
        {trend && trendValue && (() => {
          const t = trendCfg[trend];
          return (
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: t.bg, color: t.color }}
            >
              <t.Icon size={13} />{trendValue}
            </span>
          );
        })()}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <div className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
        {sublabel && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sublabel}</div>}
      </div>
    </div>
  );
}
