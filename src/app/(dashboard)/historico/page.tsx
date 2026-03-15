import { PageHeader } from '@/components/layout/PageHeader';
import { db } from '@/db';
import { contratos, fornecedores } from '@/db/schema';
import { eq, ne } from 'drizzle-orm';
import { Badge } from '@/components/ui/Badge';
import { ExportButtons } from '@/components/ui/ExportButtons';
import { formatDate } from '@/lib/utils';

const situacaoBadge = { encerrado: 'gray', suspenso: 'warn', rescindido: 'err', em_renovacao: 'pri' } as const;
const situacaoLabel = { encerrado: 'Encerrado', suspenso: 'Suspenso', rescindido: 'Rescindido', em_renovacao: 'Em renovação' } as const;

export default async function HistoricoPage() {
  const lista = await db
    .select({
      id: contratos.id, nome: contratos.nome, numero: contratos.numero,
      situacao: contratos.situacao, categoria: contratos.categoria,
      dataInicio: contratos.dataInicio, dataTermino: contratos.dataTermino,
      fornecedorNome: fornecedores.razaoSocial,
    })
    .from(contratos)
    .leftJoin(fornecedores, eq(contratos.fornecedorId, fornecedores.id))
    .where(ne(contratos.situacao, 'ativo'))
    .orderBy(contratos.dataTermino);

  return (
    <div>
      <div className="flex items-start justify-between mb-2">
        <PageHeader title="Histórico" description="Contratos encerrados e histórico" />
        <ExportButtons
          data={lista.map((c) => ({
            Número: c.numero,
            Contrato: c.nome,
            Fornecedor: c.fornecedorNome ?? '',
            Categoria: c.categoria,
            Situação: c.situacao,
            Início: formatDate(c.dataInicio),
            Término: formatDate(c.dataTermino),
          }))}
          filename="historico-contratos"
          pdfTitle="Histórico de Contratos"
          columns={['Número', 'Contrato', 'Fornecedor', 'Categoria', 'Situação', 'Início', 'Término']}
          rows={lista.map((c) => [c.numero, c.nome, c.fornecedorNome ?? '', c.categoria, c.situacao, formatDate(c.dataInicio), formatDate(c.dataTermino)])}
        />
      </div>
      <div className="space-y-3">
        {lista.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Nenhum histórico disponível</p>
        ) : lista.map((c) => (
          <div key={c.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 flex items-start gap-4">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: c.situacao === 'rescindido' ? '#DC2626' : c.situacao === 'encerrado' ? '#6b7280' : '#1C3FAA' }} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900 dark:text-white">{c.nome}</p>
                <Badge variant={(situacaoBadge as Record<string, 'gray' | 'warn' | 'err' | 'pri'>)[c.situacao] ?? 'gray'}>
                  {(situacaoLabel as Record<string, string>)[c.situacao] ?? c.situacao}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">{c.numero} · {c.fornecedorNome} · {c.categoria}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(c.dataInicio)} — {formatDate(c.dataTermino)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
