import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';

export function CategoryBars({ categorias }: { categorias: Record<string, number> }) {
  const sorted = Object.entries(categorias).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] ?? 1;

  const colors = ['#1C3FAA', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0369A1'];

  return (
    <Card>
      <Card.Header>
        <h3 className="font-semibold text-gray-900 dark:text-white">Distribuição por Categoria</h3>
      </Card.Header>
      <Card.Body>
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Sem dados</p>
        ) : (
          <div className="space-y-3">
            {sorted.map(([cat, val], i) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(val)}/mês</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(val / max) * 100}%`, backgroundColor: colors[i % colors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
