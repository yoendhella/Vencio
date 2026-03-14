import { PageHeader } from '@/components/layout/PageHeader';
import { SlaTable } from '@/components/sla/SlaTable';

export default function SlaPage() {
  return (
    <div>
      <PageHeader title="SLA / Entregas" description="Monitoramento de níveis de serviço" />
      <SlaTable />
    </div>
  );
}
