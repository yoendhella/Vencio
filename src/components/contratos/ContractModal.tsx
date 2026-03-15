'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ContractModalProps {
  open: boolean;
  onClose: () => void;
  contratoId: string | null;
  onSuccess: () => void;
}

interface Fornecedor { id: string; razaoSocial: string; }

const EMPTY = {
  numero: '', nome: '', objeto: '', tipo: 'prestacao_servico', categoria: '',
  departamento: '', unidade: '', situacao: 'ativo', fornecedorId: '', valorTotal: '',
  valorMensal: '', formaPagamento: '', indicadorReajuste: 'IPCA',
  dataInicio: '', dataTermino: '', diasAlertaAntecipado: '30',
  maxAditivos: '4', slaIndicador: '', slaMeta: '',
};

export function ContractModal({ open, onClose, contratoId, onSuccess }: ContractModalProps) {
  const [loading, setLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [form, setForm] = useState({ ...EMPTY });

  useEffect(() => {
    fetch('/api/fornecedores').then((r) => r.json()).then((d) => setFornecedores(d.data ?? []));
  }, []);

  useEffect(() => {
    if (!open) { setForm({ ...EMPTY }); return; }
    if (contratoId) {
      fetch(`/api/contratos/${contratoId}`).then((r) => r.json()).then((d) => {
        if (d.data?.contratos) {
          const c = d.data.contratos;
          setForm({
            numero: c.numero ?? '', nome: c.nome ?? '', objeto: c.objeto ?? '',
            tipo: c.tipo ?? 'prestacao_servico', categoria: c.categoria ?? '',
            departamento: c.departamento ?? '', unidade: (c as Record<string, unknown>).unidade as string ?? '', situacao: c.situacao ?? 'ativo',
            fornecedorId: c.fornecedorId ?? '', valorTotal: c.valorTotal ?? '',
            valorMensal: c.valorMensal ?? '', formaPagamento: c.formaPagamento ?? '',
            indicadorReajuste: c.indicadorReajuste ?? 'IPCA',
            dataInicio: c.dataInicio ? new Date(c.dataInicio).toISOString().slice(0, 16) : '',
            dataTermino: c.dataTermino ? new Date(c.dataTermino).toISOString().slice(0, 16) : '',
            diasAlertaAntecipado: String(c.diasAlertaAntecipado ?? 30),
            maxAditivos: String(c.maxAditivos ?? 4),
            slaIndicador: c.slaIndicador ?? '', slaMeta: c.slaMeta ?? '',
          });
        }
      });
    }
  }, [open, contratoId]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async () => {
    if (!form.numero || !form.nome || !form.fornecedorId || !form.valorTotal || !form.dataInicio || !form.dataTermino) return;
    setLoading(true);
    const payload = {
      ...form,
      valorTotal: Number(form.valorTotal),
      valorMensal: Number(form.valorMensal),
      diasAlertaAntecipado: Number(form.diasAlertaAntecipado),
      maxAditivos: Number(form.maxAditivos),
      slaMeta: form.slaMeta ? Number(form.slaMeta) : undefined,
      dataInicio: new Date(form.dataInicio).toISOString(),
      dataTermino: new Date(form.dataTermino).toISOString(),
      renovacaoAutomatica: false,
    };
    const url = contratoId ? `/api/contratos/${contratoId}` : '/api/contratos';
    const method = contratoId ? 'PATCH' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setLoading(false);
    onSuccess();
    onClose();
  };

  const field = (label: string, key: string, type = 'text', placeholder?: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input type={type} value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-pri" />
    </div>
  );

  const sel = (label: string, key: string, opts: { value: string; label: string }[]) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select value={(form as Record<string, string>)[key]} onChange={(e) => set(key, e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={contratoId ? 'Editar Contrato' : 'Novo Contrato'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button loading={loading} onClick={onSubmit}>Salvar</Button></>}
    >
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase">Identificação</p>
        <div className="grid grid-cols-2 gap-3">
          {field('Número *', 'numero')}
          {field('Nome *', 'nome')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sel('Tipo *', 'tipo', [
            { value: 'prestacao_servico', label: 'Prestação de serviço' },
            { value: 'fornecimento', label: 'Fornecimento' },
            { value: 'manutencao', label: 'Manutenção' },
            { value: 'locacao', label: 'Locação' },
            { value: 'consultoria', label: 'Consultoria' },
          ])}
          {sel('Situação', 'situacao', [
            { value: 'ativo', label: 'Ativo' },
            { value: 'em_renovacao', label: 'Em renovação' },
            { value: 'suspenso', label: 'Suspenso' },
            { value: 'encerrado', label: 'Encerrado' },
            { value: 'rescindido', label: 'Rescindido' },
          ])}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field('Categoria *', 'categoria')}
          {field('Departamento *', 'departamento')}
        </div>
        {field('Unidade do Grupo', 'unidade', 'text', 'Ex: Matriz SP, Filial RJ...')}

        <p className="text-xs font-semibold text-gray-400 uppercase pt-2">Empresa</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fornecedor *</label>
          <select value={form.fornecedorId} onChange={(e) => set('fornecedorId', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
            <option value="">Selecione...</option>
            {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.razaoSocial}</option>)}
          </select>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase pt-2">Financeiro</p>
        <div className="grid grid-cols-2 gap-3">
          {field('Valor total (R$) *', 'valorTotal', 'number')}
          {field('Valor mensal (R$) *', 'valorMensal', 'number')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sel('Índice de reajuste', 'indicadorReajuste', [
            { value: 'IPCA', label: 'IPCA' },
            { value: 'INPC', label: 'INPC' },
            { value: 'IGP-M', label: 'IGP-M' },
            { value: 'IGP-DI', label: 'IGP-DI' },
            { value: 'fixo', label: 'Fixo' },
            { value: 'sem_reajuste', label: 'Sem reajuste' },
          ])}
          {field('Forma de pagamento', 'formaPagamento')}
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase pt-2">Vigência</p>
        <div className="grid grid-cols-2 gap-3">
          {field('Data início *', 'dataInicio', 'datetime-local')}
          {field('Data término *', 'dataTermino', 'datetime-local')}
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase pt-2">SLA (opcional)</p>
        <div className="grid grid-cols-2 gap-3">
          {field('Indicador SLA', 'slaIndicador')}
          {field('Meta (%)', 'slaMeta', 'number')}
        </div>
      </div>
    </Modal>
  );
}
