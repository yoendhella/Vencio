'use client';
import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { SlaBar } from '@/components/ui/SlaBar';
import { KpiCard } from '@/components/ui/KpiCard';
import { Button } from '@/components/ui/Button';
import { OcorrenciaModal } from './OcorrenciaModal';

interface SlaItem {
  id: string; nome: string; numero: string;
  slaIndicador: string | null; slaMeta: string | null; slaRealizado: string | null;
  slaStatus: string | null; fornecedorNome: string | null;
}

export function SlaTable() {
  const [items, setItems] = useState<SlaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetch_ = async () => {
    setLoading(true);
    const r = await fetch('/api/sla');
    const d = await r.json();
    setItems(d.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const noSla = items.filter((i) => i.slaStatus === 'conforme').length;
  const emRisco = items.filter((i) => i.slaStatus === 'risco').length;
  const atencao = items.filter((i) => i.slaStatus === 'atencao').length;

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <KpiCard label="No SLA" value={noSla} color="ok" />
        <KpiCard label="Em atenção" value={atencao} color="warn" />
        <KpiCard label="Em risco" value={emRisco} color="err" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <Table>
          <Table.Head>
            <tr>
              <Table.Th>Contrato</Table.Th>
              <Table.Th>Fornecedor</Table.Th>
              <Table.Th>Indicador</Table.Th>
              <Table.Th>Meta</Table.Th>
              <Table.Th>Realizado</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ocorrência</Table.Th>
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <tr><Table.Td colSpan={7} className="text-center py-8 text-gray-500">Carregando...</Table.Td></tr>
            ) : items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Td>
                  <p className="font-medium text-sm">{item.nome}</p>
                  <p className="text-xs text-gray-500">{item.numero}</p>
                </Table.Td>
                <Table.Td className="text-sm">{item.fornecedorNome ?? '—'}</Table.Td>
                <Table.Td className="text-sm">{item.slaIndicador ?? '—'}</Table.Td>
                <Table.Td className="text-sm">{item.slaMeta ? `${item.slaMeta}%` : '—'}</Table.Td>
                <Table.Td>{item.slaRealizado ? <SlaBar value={Number(item.slaRealizado)} width={80} /> : '—'}</Table.Td>
                <Table.Td>
                  <Badge variant={item.slaStatus === 'conforme' ? 'ok' : item.slaStatus === 'atencao' ? 'warn' : 'err'}>
                    {item.slaStatus ?? '—'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Button size="xs" variant="ghost" onClick={() => { setSelectedId(item.id); setModalOpen(true); }}>
                    + Registrar
                  </Button>
                </Table.Td>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <OcorrenciaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        contratoId={selectedId}
        onSuccess={fetch_}
      />
    </>
  );
}
