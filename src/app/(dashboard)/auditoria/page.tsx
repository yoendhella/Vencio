'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table } from '@/components/ui/Table';
import { KpiCard } from '@/components/ui/KpiCard';
import { Button } from '@/components/ui/Button';
import { FilterBar } from '@/components/layout/FilterBar';
import { formatDate } from '@/lib/utils';

interface Log {
  id: string; nomeUsuario: string; acao: string; entidade: string;
  detalhes: string | null; criadoEm: Date;
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (search) params.set('acao', search);
    fetch(`/api/auditoria?${params}`).then((r) => r.json()).then((d) => setLogs(d.data ?? []));
  }, [page, search]);

  const alteracoes = logs.filter((l) => l.acao.startsWith('EDITOU') || l.acao.startsWith('CRIOU')).length;
  const aprovacoes = logs.filter((l) => l.acao.includes('APROVOU')).length;

  return (
    <div>
      <PageHeader title="Auditoria & Logs" description="Registro de ações no sistema" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Ações registradas" value={logs.length} color="pri" />
        <KpiCard label="Alterações" value={alteracoes} color="info" />
        <KpiCard label="Aprovações" value={aprovacoes} color="ok" />
        <KpiCard label="Acessos negados" value={0} color="err" />
      </div>
      <FilterBar search={search} onSearch={setSearch} />
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <Table>
          <Table.Head>
            <tr>
              <Table.Th>Data/hora</Table.Th>
              <Table.Th>Usuário</Table.Th>
              <Table.Th>Ação</Table.Th>
              <Table.Th>Entidade</Table.Th>
              <Table.Th>Detalhes</Table.Th>
            </tr>
          </Table.Head>
          <Table.Body>
            {logs.length === 0 ? (
              <tr><Table.Td colSpan={5} className="text-center py-8 text-gray-500">Nenhum log</Table.Td></tr>
            ) : logs.map((l) => (
              <Table.Row key={l.id}>
                <Table.Td className="text-xs">{formatDate(l.criadoEm)}</Table.Td>
                <Table.Td className="text-sm">{l.nomeUsuario}</Table.Td>
                <Table.Td><span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{l.acao}</span></Table.Td>
                <Table.Td className="text-sm">{l.entidade}</Table.Td>
                <Table.Td className="text-xs text-gray-500 max-w-xs truncate">{l.detalhes ?? '—'}</Table.Td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <Button size="xs" variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</Button>
          <span className="text-sm text-gray-500">Página {page}</span>
          <Button size="xs" variant="secondary" onClick={() => setPage((p) => p + 1)} disabled={logs.length < 25}>Próxima</Button>
        </div>
      </div>
    </div>
  );
}
