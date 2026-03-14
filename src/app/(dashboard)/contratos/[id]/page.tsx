import { notFound } from 'next/navigation';
import { db } from '@/db';
import { contratos, fornecedores, aditivos, reajustes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate, diasRestantes, statusContrato } from '@/lib/utils';
import Link from 'next/link';

export default async function ContratoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [row] = await db
    .select()
    .from(contratos)
    .leftJoin(fornecedores, eq(contratos.fornecedorId, fornecedores.id))
    .where(eq(contratos.id, id));

  if (!row) notFound();
  const c = row.contratos;
  const f = row.fornecedores;

  const [aditivosList, reajustesList] = await Promise.all([
    db.select().from(aditivos).where(eq(aditivos.contratoId, id)),
    db.select().from(reajustes).where(eq(reajustes.contratoId, id)),
  ]);

  const dias = diasRestantes(c.dataTermino);
  const st = statusContrato(dias);

  return (
    <div>
      <PageHeader
        title={c.nome}
        description={`Contrato ${c.numero}`}
        actions={<Link href="/contratos" className="text-sm text-pri hover:underline">← Voltar</Link>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card className="lg:col-span-2">
          <Card.Header><h3 className="font-semibold">Informações Gerais</h3></Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Fornecedor</p><p className="font-medium">{f?.razaoSocial ?? '—'}</p></div>
              <div><p className="text-gray-500">Situação</p><Badge variant={c.situacao === 'ativo' ? 'ok' : 'gray'}>{c.situacao}</Badge></div>
              <div><p className="text-gray-500">Categoria</p><p className="font-medium">{c.categoria}</p></div>
              <div><p className="text-gray-500">Departamento</p><p className="font-medium">{c.departamento}</p></div>
              <div><p className="text-gray-500">Valor mensal</p><p className="font-medium">{formatCurrency(c.valorMensal)}</p></div>
              <div><p className="text-gray-500">Valor total</p><p className="font-medium">{formatCurrency(c.valorTotal)}</p></div>
              <div><p className="text-gray-500">Início</p><p className="font-medium">{formatDate(c.dataInicio)}</p></div>
              <div><p className="text-gray-500">Término</p><p className={`font-medium ${st === 'critico' ? 'text-red-600' : st === 'atencao' ? 'text-yellow-600' : ''}`}>{formatDate(c.dataTermino)} ({dias}d)</p></div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header><h3 className="font-semibold">SLA</h3></Card.Header>
          <Card.Body className="text-sm space-y-2">
            <div><p className="text-gray-500">Indicador</p><p className="font-medium">{c.slaIndicador ?? '—'}</p></div>
            <div><p className="text-gray-500">Meta</p><p className="font-medium">{c.slaMeta ? `${c.slaMeta}%` : '—'}</p></div>
            <div><p className="text-gray-500">Realizado</p><p className="font-medium">{c.slaRealizado ? `${c.slaRealizado}%` : '—'}</p></div>
            <div><p className="text-gray-500">Status</p><Badge variant={c.slaStatus === 'conforme' ? 'ok' : c.slaStatus === 'atencao' ? 'warn' : 'err'}>{c.slaStatus ?? '—'}</Badge></div>
          </Card.Body>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header><h3 className="font-semibold">Aditivos ({aditivosList.length})</h3></Card.Header>
          <Card.Body>
            {aditivosList.length === 0 ? <p className="text-sm text-gray-500">Nenhum aditivo</p> : aditivosList.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div><p className="text-sm font-medium">{a.numero}</p><p className="text-xs text-gray-500">{a.tipo} · {formatDate(a.dataAditivo)}</p></div>
                <Badge variant={a.status === 'aprovado' ? 'ok' : a.status === 'rejeitado' ? 'err' : 'warn'}>{a.status}</Badge>
              </div>
            ))}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header><h3 className="font-semibold">Reajustes ({reajustesList.length})</h3></Card.Header>
          <Card.Body>
            {reajustesList.length === 0 ? <p className="text-sm text-gray-500">Nenhum reajuste</p> : reajustesList.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div><p className="text-sm font-medium">{r.indice} — {Number(r.percentual).toFixed(2)}%</p><p className="text-xs text-gray-500">{formatDate(r.dataVigencia)}</p></div>
                <Badge variant={r.status === 'aprovado' ? 'ok' : 'warn'}>{r.status}</Badge>
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
