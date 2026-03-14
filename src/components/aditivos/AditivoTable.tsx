'use client';
import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { KpiCard } from '@/components/ui/KpiCard';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { AditivoModal } from './AditivoModal';

interface Aditivo {
  id: string; numero: string; contratoId: string;
  tipo: string; dataAditivo: Date; novoValorMensal: string | null;
  novaDataTermino: Date | null; motivo: string; status: string;
  contratoNome: string | null; contratoNumero: string | null; criadoEm: Date;
}

const tipoBadge: Record<string, 'pri' | 'ok' | 'warn' | 'info'> = {
  prazo: 'info', valor: 'ok', escopo: 'pri', valor_prazo: 'warn',
};

export function AditivoTable() {
  const [aditivos, setAditivos] = useState<Aditivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    const res = await fetch('/api/aditivos');
    const d = await res.json();
    setAditivos(d.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const aprovar = async (id: string) => {
    await fetch(`/api/aditivos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'aprovado' }) });
    fetch_();
  };

  const total = aditivos.length;
  const emAnalise = aditivos.filter((a) => a.status === 'em_analise').length;
  const aprovados = aditivos.filter((a) => a.status === 'aprovado').length;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Total" value={total} color="pri" />
        <KpiCard label="Em análise" value={emAnalise} color="warn" />
        <KpiCard label="Aprovados" value={aprovados} color="ok" />
        <KpiCard label="Rejeitados" value={aditivos.filter((a) => a.status === 'rejeitado').length} color="err" />
      </div>

      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> Novo aditivo
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <Table>
          <Table.Head>
            <tr>
              <Table.Th>Nº Aditivo</Table.Th>
              <Table.Th>Contrato</Table.Th>
              <Table.Th>Tipo</Table.Th>
              <Table.Th>Data</Table.Th>
              <Table.Th>Novo valor</Table.Th>
              <Table.Th>Nova vigência</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <tr><Table.Td colSpan={8} className="text-center py-8 text-gray-500">Carregando...</Table.Td></tr>
            ) : aditivos.map((a) => (
              <Table.Row key={a.id}>
                <Table.Td className="font-mono text-xs">{a.numero}</Table.Td>
                <Table.Td>
                  <p className="font-medium text-sm">{a.contratoNome}</p>
                  <p className="text-xs text-gray-500">{a.contratoNumero}</p>
                </Table.Td>
                <Table.Td><Badge variant={tipoBadge[a.tipo] ?? 'gray'}>{a.tipo}</Badge></Table.Td>
                <Table.Td className="text-xs">{formatDate(a.dataAditivo)}</Table.Td>
                <Table.Td>{a.novoValorMensal ? formatCurrency(a.novoValorMensal) : '—'}</Table.Td>
                <Table.Td>{a.novaDataTermino ? formatDate(a.novaDataTermino) : '—'}</Table.Td>
                <Table.Td>
                  <Badge variant={a.status === 'aprovado' ? 'ok' : a.status === 'rejeitado' ? 'err' : 'warn'}>
                    {a.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {a.status === 'em_analise' && (
                    <Button size="xs" variant="success" onClick={() => aprovar(a.id)}>Aprovar</Button>
                  )}
                </Table.Td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <AditivoModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetch_} />
    </>
  );
}
