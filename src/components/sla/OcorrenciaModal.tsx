'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function OcorrenciaModal({ open, onClose, contratoId, onSuccess }: {
  open: boolean; onClose: () => void; contratoId: string | null; onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [penalidade, setPenalidade] = useState('');

  const onSubmit = async () => {
    if (!contratoId || descricao.length < 10 || !data) return;
    setLoading(true);
    await fetch('/api/sla/ocorrencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contratoId,
        descricao,
        dataOcorrencia: new Date(data).toISOString(),
        penalidade: penalidade ? Number(penalidade) : undefined,
      }),
    });
    setLoading(false);
    setDescricao(''); setData(''); setPenalidade('');
    onSuccess();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Registrar Ocorrência SLA"
      footer={<><Button variant="secondary" onClick={onClose}>Cancelar</Button><Button loading={loading} onClick={onSubmit}>Salvar</Button></>}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data da ocorrência *</label>
          <input type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Penalidade (R$)</label>
          <input type="number" step="0.01" value={penalidade} onChange={(e) => setPenalidade(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" />
        </div>
      </div>
    </Modal>
  );
}
