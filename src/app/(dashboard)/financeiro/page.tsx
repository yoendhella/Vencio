import { PageHeader } from '@/components/layout/PageHeader';
import { db } from '@/db';
import { contratos, fornecedores, reajustes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { KpiCard } from '@/components/ui/KpiCard';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, calcularSaldo } from '@/lib/utils';
import { addDays } from 'date-fns';

async function getData() {
  const lista = await db
    .select({
      id: contratos.id,
      nome: contratos.nome,
      numero: contratos.numero,
      valorMensal: contratos.valorMensal,
      valorTotal: contratos.valorTotal,
      formaPagamento: contratos.formaPagamento,
      centroCusto: contratos.centroCusto,
      dataInicio: contratos.dataInicio,
      dataTermino: contratos.dataTermino,
      indicadorReajuste: contratos.indicadorReajuste,
      fornecedorNome: fornecedores.razaoSocial,
    })
    .from(contratos)
    .leftJoin(fornecedores, eq(contratos.fornecedorId, fornecedores.id))
    .where(eq(contratos.situacao, 'ativo'));

  const reajList = await db.select().from(reajustes).where(eq(reajustes.status, 'aprovado'));
  return { lista, reajList };
}

export default async function FinanceiroPage() {
  const { lista, reajList } = await getData();
  const hoje = new Date();
  const em7 = addDays(hoje, 7);

  const totalMensal = lista.reduce((s, c) => s + Number(c.valorMensal), 0);
  const totalContratado = lista.reduce((s, c) => s + Number(c.valorTotal), 0);
  const prox7 = lista.filter((c) => new Date(c.dataTermino) <= em7).length;
  const impactoReajustes = reajList.reduce((s, r) => s + (Number(r.novoValor) - Number(r.valorAnterior)), 0);

  return (
    <div>
      <PageHeader title="Financeiro" description="Visão financeira dos contratos" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total contratado" value={formatCurrency(totalContratado)} color="pri" />
        <KpiCard label="Mensal comprometido" value={formatCurrency(totalMensal)} color="ok" />
        <KpiCard label="Pagamentos próximos 7d" value={prox7} color="warn" />
        <KpiCard label="Impacto reajustes" value={formatCurrency(impactoReajustes)} color="info" meta="diferença aprovada" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 mb-6">
        <Table>
          <Table.Head>
            <tr>
              <Table.Th>Contrato</Table.Th>
              <Table.Th>Valor mensal</Table.Th>
              <Table.Th>Valor total</Table.Th>
              <Table.Th>Saldo restante</Table.Th>
              <Table.Th>Forma pagamento</Table.Th>
              <Table.Th>Centro custo</Table.Th>
              <Table.Th>Vencimento</Table.Th>
              <Table.Th>Índice</Table.Th>
            </tr>
          </Table.Head>
          <Table.Body>
            {lista.map((c) => {
              const saldo = calcularSaldo(Number(c.valorTotal), Number(c.valorMensal), c.dataInicio);
              const critico = new Date(c.dataTermino) <= em7;
              return (
                <Table.Row key={c.id}>
                  <Table.Td>
                    <p className="font-medium text-sm">{c.nome}</p>
                    <p className="text-xs text-gray-500">{c.fornecedorNome}</p>
                  </Table.Td>
                  <Table.Td className="font-medium">{formatCurrency(c.valorMensal)}</Table.Td>
                  <Table.Td>{formatCurrency(c.valorTotal)}</Table.Td>
                  <Table.Td className="font-medium text-green-700">{formatCurrency(saldo)}</Table.Td>
                  <Table.Td className="text-xs">{c.formaPagamento ?? '—'}</Table.Td>
                  <Table.Td className="text-xs">{c.centroCusto ?? '—'}</Table.Td>
                  <Table.Td className={critico ? 'text-red-600 font-medium' : ''}>{formatDate(c.dataTermino)}</Table.Td>
                  <Table.Td><Badge variant="gray">{c.indicadorReajuste}</Badge></Table.Td>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Timeline de Reajustes Aprovados</h3>
        {reajList.length === 0 ? <p className="text-sm text-gray-500">Nenhum reajuste aprovado</p> : (
          <div className="space-y-2">
            {reajList.sort((a, b) => new Date(a.dataVigencia).getTime() - new Date(b.dataVigencia).getTime()).map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.indice} — {Number(r.percentual).toFixed(2)}%</p>
                  <p className="text-xs text-gray-500">{formatDate(r.dataVigencia)}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-500">{formatCurrency(r.valorAnterior)} → <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(r.novoValor)}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
