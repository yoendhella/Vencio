'use client';
import { useState, useEffect } from 'react';
import { Table } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { SlaBar } from '@/components/ui/SlaBar';
import { Button } from '@/components/ui/Button';
import { FilterBar } from '@/components/layout/FilterBar';
import { ContractModal } from './ContractModal';
import { ExportButtons } from '@/components/ui/ExportButtons';
import { formatCurrency, formatDate, diasRestantes } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface Contrato {
  id: string;
  numero: string;
  nome: string;
  departamento: string;
  categoria: string;
  valorMensal: string;
  indicadorReajuste: string;
  dataTermino: Date;
  situacao: string;
  slaMeta: string | null;
  slaRealizado: string | null;
  fornecedorNome: string | null;
}

const situacaoBadge: Record<string, 'ok' | 'err' | 'warn' | 'gray' | 'pri'> = {
  ativo: 'ok',
  encerrado: 'gray',
  suspenso: 'warn',
  em_renovacao: 'pri',
  rescindido: 'err',
};

export function ContractTable() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchContratos = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (status) params.set('status', status);
    const res = await fetch(`/api/contratos?${params}`);
    const data = await res.json();
    setContratos(data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchContratos(); }, [search, status]);

  return (
    <>
      <FilterBar search={search} onSearch={setSearch}>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="em_renovacao">Em renovação</option>
          <option value="encerrado">Encerrado</option>
          <option value="suspenso">Suspenso</option>
        </select>
        <ExportButtons
          data={contratos.map((c) => ({
            Número: c.numero,
            Contrato: c.nome,
            Departamento: c.departamento,
            Categoria: c.categoria,
            'Valor Mensal': formatCurrency(c.valorMensal),
            Índice: c.indicadorReajuste,
            Vencimento: formatDate(c.dataTermino),
            Situação: c.situacao,
          }))}
          filename="contratos"
          pdfTitle="Relatório de Contratos"
          columns={['Número', 'Contrato', 'Departamento', 'Categoria', 'Valor Mensal', 'Índice', 'Vencimento', 'Situação']}
          rows={contratos.map((c) => [c.numero, c.nome, c.departamento, c.categoria, formatCurrency(c.valorMensal), c.indicadorReajuste, formatDate(c.dataTermino), c.situacao])}
        />
        <Button size="sm" onClick={() => { setEditingId(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4" /> Novo contrato
        </Button>
      </FilterBar>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <Table>
          <Table.Head>
            <tr>
              <Table.Th>Nº</Table.Th>
              <Table.Th>Contrato / Empresa</Table.Th>
              <Table.Th>Depto</Table.Th>
              <Table.Th>Valor/mês</Table.Th>
              <Table.Th>Índice</Table.Th>
              <Table.Th>Vencimento</Table.Th>
              <Table.Th>Situação</Table.Th>
              <Table.Th>SLA</Table.Th>
              <Table.Th>{""}</Table.Th>
            </tr>
          </Table.Head>
          <Table.Body>
            {loading ? (
              <tr><Table.Td colSpan={9} className="text-center py-8 text-gray-500">Carregando...</Table.Td></tr>
            ) : contratos.length === 0 ? (
              <tr><Table.Td colSpan={9} className="text-center py-8 text-gray-500">Nenhum contrato encontrado</Table.Td></tr>
            ) : contratos.map((c) => {
              const dias = diasRestantes(c.dataTermino);
              const sla = c.slaRealizado ? Number(c.slaRealizado) : null;
              return (
                <Table.Row key={c.id}>
                  <Table.Td className="font-mono text-xs">{c.numero}</Table.Td>
                  <Table.Td>
                    <div>
                      <Link href={`/contratos/${c.id}`} className="font-medium text-gray-900 dark:text-white hover:text-pri">{c.nome}</Link>
                      <p className="text-xs text-gray-500">{c.fornecedorNome}</p>
                    </div>
                  </Table.Td>
                  <Table.Td className="text-xs">{c.departamento}</Table.Td>
                  <Table.Td className="font-medium">{formatCurrency(c.valorMensal)}</Table.Td>
                  <Table.Td><Badge variant="gray">{c.indicadorReajuste}</Badge></Table.Td>
                  <Table.Td>
                    <div>
                      <p className="text-xs">{formatDate(c.dataTermino)}</p>
                      <div className="h-1.5 w-20 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(5, ((90 - dias) / 90) * 100))}%`, backgroundColor: dias <= 30 ? '#DC2626' : dias <= 90 ? '#D97706' : '#16A34A' }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">{dias}d</p>
                    </div>
                  </Table.Td>
                  <Table.Td><Badge variant={situacaoBadge[c.situacao] ?? 'gray'} dot>{c.situacao}</Badge></Table.Td>
                  <Table.Td>{sla !== null ? <SlaBar value={sla} width={70} /> : <span className="text-gray-400 text-xs">—</span>}</Table.Td>
                  <Table.Td>
                    <Button size="xs" variant="ghost" onClick={() => { setEditingId(c.id); setModalOpen(true); }}>Editar</Button>
                  </Table.Td>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>

      <ContractModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        contratoId={editingId}
        onSuccess={fetchContratos}
      />
    </>
  );
}
