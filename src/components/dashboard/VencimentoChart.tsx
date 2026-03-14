'use client';
import { Card } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatMonthYear } from '@/lib/utils';
import { addMonths } from 'date-fns';

interface Contrato {
  dataTermino: Date;
  valorMensal: string;
}

export function VencimentoChart({ contratos }: { contratos: Contrato[] }) {
  const hoje = new Date();
  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = addMonths(hoje, i);
    return { label: formatMonthYear(d), year: d.getFullYear(), month: d.getMonth(), count: 0, valor: 0 };
  });

  contratos.forEach((c) => {
    const d = new Date(c.dataTermino);
    const idx = meses.findIndex((m) => m.year === d.getFullYear() && m.month === d.getMonth());
    if (idx >= 0) {
      meses[idx].count++;
      meses[idx].valor += Number(c.valorMensal);
    }
  });

  return (
    <Card>
      <Card.Header>
        <h3 className="font-semibold text-gray-900 dark:text-white">Vencimentos por Mês</h3>
      </Card.Header>
      <Card.Body>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={meses} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v, 'Contratos']} />
            <Bar dataKey="count" fill="#1C3FAA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
