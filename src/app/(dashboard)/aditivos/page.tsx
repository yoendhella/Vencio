import { PageHeader } from '@/components/layout/PageHeader';
import { AditivoTable } from '@/components/aditivos/AditivoTable';

export default function AditivosPage() {
  return (
    <div>
      <PageHeader title="Aditivos Contratuais" description="Gestão de aditivos e aprovações" />
      <AditivoTable />
    </div>
  );
}
