import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileBarChart, Download } from 'lucide-react';

const relatorios = [
  { title: 'Contratos ativos', desc: 'Lista completa com valores e vencimentos', endpoint: '/api/contratos?status=ativo' },
  { title: 'Reajustes aprovados', desc: 'Histórico de reajustes e impacto financeiro', endpoint: '/api/reajustes?status=aprovado' },
  { title: 'Certidões vencidas', desc: 'Certidões expiradas por fornecedor', endpoint: '/api/certidoes?vencidas=true' },
  { title: 'Aditivos contratuais', desc: 'Todos os aditivos registrados', endpoint: '/api/aditivos' },
  { title: 'Fornecedores e avaliações', desc: 'Notas e métricas de qualidade', endpoint: '/api/fornecedores' },
  { title: 'Log de auditoria', desc: 'Histórico completo de ações', endpoint: '/api/auditoria?limit=1000' },
];

export default function RelatoriosPage() {
  return (
    <div>
      <PageHeader title="Relatórios" description="Exportação de dados em CSV" />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {relatorios.map((r) => (
          <Card key={r.title}>
            <Card.Body>
              <div className="flex items-start gap-3">
                <FileBarChart className="h-8 w-8 text-pri flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{r.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
                  <a href={r.endpoint} download className="mt-3 inline-flex items-center gap-2 text-sm text-pri hover:underline">
                    <Download className="h-4 w-4" /> Exportar JSON
                  </a>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}
