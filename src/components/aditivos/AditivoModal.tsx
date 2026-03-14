'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Contrato { id: string; nome: string; numero: string; }

export function AditivoModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void; }) {
  const [loading, setLoading] = useState(false);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [form, setForm] = useState({ contratoId: '', numero: '', tipo: 'prazo', dataAditivo: '', novoValorMensal: '', novaDataTermino: '', motivo: '' });

  useEffect(() => {
    fetch('/api/contratos').then((r) => r.json()).then((d) => setContratos(d.data ?? []));
  }, []);

  useEffect(() => {
    if (!open) setForm({ contratoId: '', numero: '', tipo: 'prazo', dataAditivo: '', novoValorMensal: '', novaDataTermino: '', motivo: '' });
  }, [open]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async () => {
    if (!form.contratoId || !form.numero || !form.dataAditivo || form.motivo.length < 10) return;
    setLoading(true);
    await fetch('/api/aditivos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        novoValorMensal: form.novoValorMensal ? Number(form.novoValorMensal) : undefined,
        novaDataTermino: form.novaDataTermino || undefined,
      }),
    });
    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Aditivo"
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button loading={loading} onClick={onSubmit}>Salvar</Button></>}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contrato *</label>
          <select value={form.contratoId} onChange={(e) => set('contratoId', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
            <option value="">Selecione...</option>
            {contratos.map((c) => <option key={c.id} value={c.id}>{c.nome} ({c.numero})</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
            <input value={form.numero} onChange={(e) => set('numero', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg">
              <option value="prazo">Prazo</option>
              <option value="valor">Valor</option>
              <option value="escopo">Escopo</option>
              <option value="valor_prazo">Valor + Prazo</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data do aditivo *</label>
          <input type="datetime-local" value={form.dataAditivo} onChange={(e) => set('dataAditivo', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Novo valor mensal</label>
            <input type="number" value={form.novoValorMensal} onChange={(e) => set('novoValorMensal', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nova data término</label>
            <input type="datetime-local" value={form.novaDataTermino} onChange={(e) => set('novaDataTermino', e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
          <textarea value={form.motivo} onChange={(e) => set('motivo', e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none" />
        </div>
      </div>
    </Modal>
  );
}
