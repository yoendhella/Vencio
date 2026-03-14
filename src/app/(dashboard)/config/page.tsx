'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Config {
  alerta90dias: boolean; alerta60dias: boolean; alerta30dias: boolean;
  alertaReajuste: boolean; alertaCertidao: boolean; alertaSla: boolean;
  resumoSemanal: boolean; emailDestinatario: string | null;
}

export default function ConfigPage() {
  const [config, setConfig] = useState<Config>({
    alerta90dias: false, alerta60dias: true, alerta30dias: true,
    alertaReajuste: true, alertaCertidao: true, alertaSla: true,
    resumoSemanal: false, emailDestinatario: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof Config) => {
    if (typeof config[key] === 'boolean') {
      setConfig((p) => ({ ...p, [key]: !p[key] }));
    }
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/config/alertas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const checkboxes: { key: keyof Config; label: string }[] = [
    { key: 'alerta30dias', label: 'Alertas 30 dias antes do vencimento' },
    { key: 'alerta60dias', label: 'Alertas 60 dias antes do vencimento' },
    { key: 'alerta90dias', label: 'Alertas 90 dias antes do vencimento' },
    { key: 'alertaReajuste', label: 'Alertas de reajustes pendentes' },
    { key: 'alertaCertidao', label: 'Alertas de certidões vencendo' },
    { key: 'alertaSla', label: 'Alertas de SLA em risco' },
    { key: 'resumoSemanal', label: 'Resumo semanal (toda segunda-feira)' },
  ];

  return (
    <div>
      <PageHeader title="Configurações" description="Alertas, usuários e integrações" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header><h3 className="font-semibold">Configurações de Alerta</h3></Card.Header>
          <Card.Body>
            <div className="space-y-3 mb-4">
              {checkboxes.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config[key] as boolean}
                    onChange={() => toggle(key)}
                    className="w-4 h-4 accent-pri"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email destinatário</label>
              <input
                type="email"
                value={config.emailDestinatario ?? ''}
                onChange={(e) => setConfig((p) => ({ ...p, emailDestinatario: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg"
                placeholder="alertas@empresa.com.br"
              />
            </div>
            <Button loading={saving} onClick={save}>{saved ? '✓ Salvo!' : 'Salvar configurações'}</Button>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header><h3 className="font-semibold">Integrações</h3></Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div><p className="text-sm font-medium text-green-800 dark:text-green-200">IBGE — Índices</p><p className="text-xs text-green-600">API conectada</p></div>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Ativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">ERP — SAP/Totvs</p><p className="text-xs text-gray-500">Não configurado</p></div>
                <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full">Inativo</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div><p className="text-sm font-medium text-gray-700 dark:text-gray-300">Assinatura Digital</p><p className="text-xs text-gray-500">DocuSign / Clicksign</p></div>
                <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full">Inativo</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
