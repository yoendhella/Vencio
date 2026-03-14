import { PageHeader } from '@/components/layout/PageHeader';
import { FornecedorTable } from '@/components/fornecedores/FornecedorTable';

export default function FornecedoresPage() {
  return (
    <div>
      <PageHeader title="Fornecedores" description="Cadastro e avaliação de fornecedores" />
      <FornecedorTable />
    </div>
  );
}
