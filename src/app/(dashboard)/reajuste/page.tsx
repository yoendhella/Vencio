'use client';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Indice { valor: number; mes: string; }
interface Reajuste {
  id: string; indice: string; percentual: string; valorAnterior: string;
  novoValor: string; dataVigencia: Date; status: string; contratoNome: string | null; contratoNumero: string | null;
}

export default function ReajustePage() {
  const [indices, setIndices] = useState<Record<string, Indice>>({});
  const [reajustes, setReajustes] = useState<Reajuste[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [ri, rr] = await Promise.all([fetch('/api/indices'), fetch('/api/reajustes')]);
    const [di, dr] = await Promise.all([ri.json(), rr.json()]);
    setIndices(di.data ?? {});
    setReajustes(dr.data ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const aprovar = async (id: string) => {
    setLoading(true);
    await fetch(`/api/reajustes/${id}/aprovar`, { method: 'POST' });
    await fetchData();
    setLoading(false);
  };

  const indiceColors: Record<string, string> = { IPCA: 'bg-blue-50 border-blue-200', INPC: 'bg-green-50 border-green-200', 'IGP-M': 'bg-yellow-50 border-yellow-200' };

  return (
    <div>
      <PageHeader title="Reajustes" description="Índices e aprovação de reajustes" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {Object.entries(indices).map(([nome, idx]) => (
          <div key={nome} className={`rounded-lg border p-4 ${indiceColors[nome] ?? 'bg-gray-50 border-gray-200'}`}>
            <p className="text-sm font-medium text-gray-600">{nome}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{idx.valor.toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">{idx.mes}</p>
          </div>
        ))}
      </div>

      <Card>
        <Card.Header><h3 className="font-semibold">Timeline de Reajustes</h3></Card.Header>
        <Card.Body className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {reajustes
              .sort((a, b) => new Date(a.dataVigencia).getTime() - new Date(b.dataVigencia).getTime())
              .map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: r.status === 'aprovado' ? '#16A34A' : '#D97706' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.contratoNome} ({r.contratoNumero})</p>
                    <p className="text-xs text-gray-500">{r.indice} — {Number(r.percentual).toFixed(2)}% · Vigência: {formatDate(r.dataVigencia)}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>{formatCurrency(r.valorAnterior)} → <span className="font-medium">{formatCurrency(r.novoValor)}</span></p>
                  </div>
                  <Badge variant={r.status === 'aprovado' ? 'ok' : 'warn'}>{r.status}</Badge>
                  {r.status === 'pendente' && (
                    <Button size="xs" variant="success" loading={loading} onClick={() => aprovar(r.id)}>Aprovar</Button>
                  )}
                </div>
              ))}
            {reajustes.length === 0 && <p className="text-sm text-gray-500 p-6">Nenhum reajuste</p>}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
