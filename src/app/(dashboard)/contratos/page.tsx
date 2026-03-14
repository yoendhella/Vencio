import { PageHeader } from '@/components/layout/PageHeader';
import { ContractTable } from '@/components/contratos/ContractTable';

export default function ContratosPage() {
  return (
    <div>
      <PageHeader title="Contratos" description="Gestão de todos os contratos" />
      <ContractTable />
    </div>
  );
}
