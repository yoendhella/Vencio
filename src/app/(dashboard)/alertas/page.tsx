import { PageHeader } from '@/components/layout/PageHeader';
import { db } from '@/db';
import { contratos, certidoes, reajustes, fornecedores } from '@/db/schema';
import { eq, lte, and } from 'drizzle-orm';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertRow } from '@/components/ui/AlertRow';
import { formatDate, diasRestantes, statusCertidao } from '@/lib/utils';
import { addDays } from 'date-fns';
import Link from 'next/link';

async function getData() {
  const hoje = new Date();
  const em30 = addDays(hoje, 30);

  const [criticos, certs, reaj, sla] = await Promise.all([
    db.select({
      id: contratos.id, nome: contratos.nome, numero: contratos.numero,
      dataTermino: contratos.dataTermino, fornecedorNome: fornecedores.razaoSocial,
    }).from(contratos).leftJoin(fornecedores, eq(contratos.fornecedorId, fornecedores.id))
      .where(and(eq(contratos.situacao, 'ativo'), lte(contratos.dataTermino, em30))),
    db.select({
      id: certidoes.id, tipo: certidoes.tipo, dataValidade: certidoes.dataValidade,
      fornecedorNome: fornecedores.razaoSocial,
    }).from(certidoes).leftJoin(fornecedores, eq(certidoes.fornecedorId, fornecedores.id))
      .where(lte(certidoes.dataValidade, em30)),
    db.select({
      id: reajustes.id, indice: reajustes.indice, percentual: reajustes.percentual,
      contratoId: reajustes.contratoId, criadoEm: reajustes.criadoEm,
    }).from(reajustes).where(eq(reajustes.status, 'pendente')),
    db.select({
      id: contratos.id, nome: contratos.nome, slaStatus: contratos.slaStatus, slaRealizado: contratos.slaRealizado,
    }).from(contratos).where(eq(contratos.slaStatus, 'risco')),
  ]);

  return { criticos, certs, reaj, sla };
}

export default async function AlertasPage() {
  const { criticos, certs, reaj, sla } = await getData();

  return (
    <div>
      <PageHeader title="Alertas" description="Central de alertas e pendências" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Críticos — Vencimento ≤30 dias</h3>
              <Badge variant="err">{criticos.length}</Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-2">
            {criticos.length === 0 ? <p className="text-sm text-gray-500 p-2">Nenhum</p> : criticos.map((c) => (
              <AlertRow key={c.id} variant="danger"
                title={c.nome}
                desc={`${c.fornecedorNome} · Vence ${formatDate(c.dataTermino)}`}
                meta={`${diasRestantes(c.dataTermino)}d`}
                action={<Link href={`/contratos/${c.id}`} className="text-xs text-pri hover:underline">Renovar</Link>}
              />
            ))}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Certidões Vencidas / em Atenção</h3>
              <Badge variant="warn">{certs.length}</Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-2">
            {certs.length === 0 ? <p className="text-sm text-gray-500 p-2">Nenhuma</p> : certs.map((c) => {
              const st = statusCertidao(c.dataValidade);
              return (
                <AlertRow key={c.id} variant={st === 'vencida' ? 'danger' : 'warning'}
                  title={`${c.tipo.replace('_', ' ')} — ${c.fornecedorNome}`}
                  desc={`Validade: ${formatDate(c.dataValidade)}`}
                  action={<Link href="/documentos" className="text-xs text-pri hover:underline">Solicitar</Link>}
                />
              );
            })}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Reajustes Pendentes</h3>
              <Badge variant="warn">{reaj.length}</Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-2">
            {reaj.length === 0 ? <p className="text-sm text-gray-500 p-2">Nenhum</p> : reaj.map((r) => (
              <AlertRow key={r.id} variant="warning"
                title={`${r.indice} — ${Number(r.percentual).toFixed(2)}%`}
                desc={`Criado em ${formatDate(r.criadoEm)}`}
                action={<Link href="/reajuste" className="text-xs text-pri hover:underline">Aprovar</Link>}
              />
            ))}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">SLA em Risco</h3>
              <Badge variant="err">{sla.length}</Badge>
            </div>
          </Card.Header>
          <Card.Body className="p-2">
            {sla.length === 0 ? <p className="text-sm text-gray-500 p-2">Nenhum</p> : sla.map((s) => (
              <AlertRow key={s.id} variant="danger"
                title={s.nome}
                desc={`Realizado: ${s.slaRealizado ?? '—'}%`}
                action={<Link href="/sla" className="text-xs text-pri hover:underline">Ver SLA</Link>}
              />
            ))}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
