import { Card } from '@/components/ui/Card';
import { AlertRow } from '@/components/ui/AlertRow';
import { diasRestantes, formatDate } from '@/lib/utils';
import Link from 'next/link';

interface AlertItem {
  id: string;
  nome: string;
  numero: string;
  dataTermino: Date;
}

export function AlertsPanel({ alertas }: { alertas: AlertItem[] }) {
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">Alertas Prioritários</h3>
          <Link href="/alertas" className="text-xs text-pri hover:underline">Ver todos</Link>
        </div>
      </Card.Header>
      <Card.Body className="p-2">
        {alertas.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhum alerta crítico</p>
        ) : (
          alertas.map((a) => {
            const dias = diasRestantes(a.dataTermino);
            return (
              <AlertRow
                key={a.id}
                variant={dias <= 7 ? 'danger' : dias <= 30 ? 'warning' : 'info'}
                title={a.nome}
                desc={`Contrato ${a.numero} · Vence ${formatDate(a.dataTermino)}`}
                meta={`${dias}d`}
              />
            );
          })
        )}
      </Card.Body>
    </Card>
  );
}
