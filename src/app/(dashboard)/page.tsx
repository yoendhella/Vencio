import { KpiCard } from '@/components/ui/KpiCard';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { contratos, fornecedores, reajustes, aditivos, certidoes } from '@/db/schema';
import { eq, lte, and, count, sum, gte } from 'drizzle-orm';
import { addDays, startOfYear, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency, diasRestantes, statusContrato } from '@/lib/utils';
import { VencimentoChart } from '@/components/dashboard/VencimentoChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { CategoryBars } from '@/components/dashboard/CategoryBars';
import { Suspense } from 'react';
import { UnidadeFilter } from '@/components/dashboard/UnidadeFilter';

async function getDashboardData() {
  const hoje = new Date();
  const em30 = addDays(hoje, 30);
  const anoInicio = startOfYear(hoje);

  const [
    ativosResult, criticosResult, reajPendResult, mensalResult,
    certAtencaoResult, aditivosAnoResult, slaRiscoResult, fornAtivosResult,
  ] = await Promise.all([
    db.select({ total: count() }).from(contratos).where(eq(contratos.situacao, 'ativo')),
    db.select({ total: count() }).from(contratos).where(and(eq(contratos.situacao, 'ativo'), lte(contratos.dataTermino, em30))),
    db.select({ total: count() }).from(reajustes).where(eq(reajustes.status, 'pendente')),
    db.select({ total: sum(contratos.valorMensal) }).from(contratos).where(eq(contratos.situacao, 'ativo')),
    db.select({ total: count() }).from(certidoes).where(lte(certidoes.dataValidade, addDays(hoje, 30))),
    db.select({ total: count() }).from(aditivos).where(gte(aditivos.criadoEm, anoInicio)),
    db.select({ total: count() }).from(contratos).where(eq(contratos.slaStatus, 'risco')),
    db.select({ total: count() }).from(fornecedores).where(eq(fornecedores.ativo, true)),
  ]);

  const contratosList = await db
    .select({
      id: contratos.id,
      nome: contratos.nome,
      numero: contratos.numero,
      categoria: contratos.categoria,
      dataTermino: contratos.dataTermino,
      valorMensal: contratos.valorMensal,
      situacao: contratos.situacao,
    })
    .from(contratos)
    .where(eq(contratos.situacao, 'ativo'))
    .limit(50);

  return {
    ativos: ativosResult[0].total,
    criticos: criticosResult[0].total,
    reajustesPendentes: reajPendResult[0].total,
    valorMensalTotal: mensalResult[0].total ?? '0',
    certAtencao: certAtencaoResult[0].total,
    aditivosAno: aditivosAnoResult[0].total,
    slaRisco: slaRiscoResult[0].total,
    fornecedoresAtivos: fornAtivosResult[0].total,
    contratos: contratosList,
  };
}

interface PageProps {
  searchParams: Promise<{ unidade?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  await auth();
  const { unidade } = await searchParams;
  const data = await getDashboardData();

  // Extrair unidades únicas dos contratos (campo não está no schema atual, mas preparamos para expansão)
  const unidades: string[] = [];

  // Filtrar contratos por unidade se selecionado (expansão futura quando campo estiver no schema)
  const contratosFiltered = data.contratos;

  const alertas = contratosFiltered
    .filter((c) => statusContrato(diasRestantes(c.dataTermino)) !== 'ok')
    .sort((a, b) => diasRestantes(a.dataTermino) - diasRestantes(b.dataTermino))
    .slice(0, 5);

  const categorias = contratosFiltered.reduce<Record<string, number>>((acc, c) => {
    acc[c.categoria] = (acc[c.categoria] ?? 0) + Number(c.valorMensal);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <PageHeader
          title="Dashboard"
          description={`Visão geral — ${format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}`}
        />
        <Suspense fallback={null}>
          <UnidadeFilter unidades={unidades} />
        </Suspense>
      </div>

      {unidade && (
        <div className="mb-4 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>Filtrando por:</span>
          <strong>{unidade}</strong>
        </div>
      )}

      {/* KPIs Linha 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard label="Contratos ativos" value={data.ativos} color="pri" meta="situação ativa" />
        <KpiCard label="Críticos ≤30 dias" value={data.criticos} color="err" meta="vencimento iminente" />
        <KpiCard label="Reajustes pendentes" value={data.reajustesPendentes} color="warn" meta="aguardando aprovação" />
        <KpiCard label="Valor mensal total" value={formatCurrency(data.valorMensalTotal)} color="ok" meta="contratos ativos" />
      </div>

      {/* KPIs Linha 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Certidões em atenção" value={data.certAtencao} color="warn" meta="≤30 dias ou vencidas" />
        <KpiCard label="Aditivos no ano" value={data.aditivosAno} color="info" meta={String(new Date().getFullYear())} />
        <KpiCard label="SLA em risco" value={data.slaRisco} color="err" meta="abaixo da meta" />
        <KpiCard label="Fornecedores ativos" value={data.fornecedoresAtivos} color="pur" meta="cadastrados" />
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <AlertsPanel alertas={alertas} />
        <CategoryBars categorias={categorias} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VencimentoChart contratos={data.contratos} />
        <Card>
          <Card.Header>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Top 5 Fornecedores por Valor</h3>
          </Card.Header>
          <Card.Body>
            {data.contratos
              .reduce<{ nome: string; valor: number }[]>((acc, c) => {
                const existing = acc.find((x) => x.nome === c.nome);
                if (existing) existing.valor += Number(c.valorMensal);
                else acc.push({ nome: c.nome, valor: Number(c.valorMensal) });
                return acc;
              }, [])
              .sort((a, b) => b.valor - a.valor)
              .slice(0, 5)
              .map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b last:border-0"
                  style={{ borderColor: 'var(--border-muted)' }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{item.nome}</span>
                  <span className="text-sm font-bold flex-shrink-0" style={{ color: '#10b981' }}>{formatCurrency(item.valor)}/mês</span>
                </div>
              ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
