'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil, UserX, UserCheck, KeyRound } from 'lucide-react';

interface Config {
  alerta90dias: boolean; alerta60dias: boolean; alerta30dias: boolean;
  alertaReajuste: boolean; alertaCertidao: boolean; alertaSla: boolean;
  resumoSemanal: boolean; emailDestinatario: string | null;
}

interface Usuario {
  id: string; nome: string; email: string;
  perfil: 'administrador' | 'gestor' | 'operacional' | 'financeiro' | 'visualizador';
  ativo: boolean; temSenha: boolean;
}

const PERFIS = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'operacional', label: 'Operacional' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'visualizador', label: 'Visualizador' },
];

const PERFIL_VARIANT: Record<string, 'pri' | 'ok' | 'warn' | 'info' | 'gray'> = {
  administrador: 'err' as never,
  gestor: 'pri',
  operacional: 'ok',
  financeiro: 'warn',
  visualizador: 'gray',
};

function ModalUsuario({ usuario, onClose, onSaved }: { usuario: Usuario | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !usuario;
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [perfil, setPerfil] = useState(usuario?.perfil ?? 'visualizador');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    if (isNew && senha.length < 8) { setError('Senha deve ter no mínimo 8 caracteres.'); return; }
    if (senha && senha !== confirmar) { setError('Senhas não coincidem.'); return; }

    setSaving(true);
    try {
      const body: Record<string, unknown> = { nome, perfil, ativo };
      if (isNew) { body.email = email; body.senha = senha; }
      else if (senha) body.senha = senha;

      const url = isNew ? '/api/usuarios' : `/api/usuarios/${usuario.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Erro ao salvar.'); return; }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {isNew ? 'Adicionar Usuário' : 'Editar Usuário'}
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C3FAA]" />
          </div>
          {isNew && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C3FAA]" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Perfil</label>
            <select value={perfil} onChange={(e) => setPerfil(e.target.value as typeof perfil)} className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C3FAA]">
              {PERFIS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isNew ? 'Senha' : 'Nova Senha (deixar em branco para não alterar)'}
            </label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C3FAA]" />
          </div>
          {(isNew || senha) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Senha</label>
              <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} placeholder="••••••••" className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C3FAA]" />
            </div>
          )}
          {!isNew && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="w-4 h-4 accent-[#1C3FAA]" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Usuário ativo</span>
            </label>
          )}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button loading={saving} onClick={submit}>{isNew ? 'Criar usuário' : 'Salvar alterações'}</Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfigPage() {
  const [config, setConfig] = useState<Config>({
    alerta90dias: false, alerta60dias: true, alerta30dias: true,
    alertaReajuste: true, alertaCertidao: true, alertaSla: true,
    resumoSemanal: false, emailDestinatario: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modalUsuario, setModalUsuario] = useState<{ open: boolean; usuario: Usuario | null }>({ open: false, usuario: null });

  const loadUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    if (res.ok) { const d = await res.json(); setUsuarios(d.data); }
  };

  useEffect(() => { loadUsuarios(); }, []);

  const toggle = (key: keyof Config) => {
    if (typeof config[key] === 'boolean') setConfig((p) => ({ ...p, [key]: !p[key] }));
  };

  const save = async () => {
    setSaving(true);
    await fetch('/api/config/alertas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const toggleAtivo = async (u: Usuario) => {
    await fetch(`/api/usuarios/${u.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ativo: !u.ativo }) });
    loadUsuarios();
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

      {/* Gerenciamento de Usuários */}
      <Card className="mb-4">
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">Usuários do Sistema</h3>
            <Button size="sm" onClick={() => setModalUsuario({ open: true, usuario: null })}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar Usuário
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Nome</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Perfil</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Senha</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Ativo</th>
                  <th className="py-2 px-3" />
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-2.5 px-3 font-medium text-gray-900 dark:text-white">{u.nome}</td>
                    <td className="py-2.5 px-3 text-gray-500">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={PERFIL_VARIANT[u.perfil] ?? 'gray'}>
                        {PERFIS.find((p) => p.value === u.perfil)?.label ?? u.perfil}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3">
                      {u.temSenha
                        ? <span className="flex items-center gap-1 text-green-600 text-xs"><KeyRound className="h-3 w-3" /> Configurada</span>
                        : <span className="text-gray-400 text-xs">Não configurada</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge variant={u.ativo ? 'ok' : 'gray'}>{u.ativo ? 'Ativo' : 'Inativo'}</Badge>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setModalUsuario({ open: true, usuario: u })}
                          className="p-1.5 text-gray-400 hover:text-[#1C3FAA] hover:bg-blue-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleAtivo(u)}
                          className={`p-1.5 rounded transition-colors ${u.ativo ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                          title={u.ativo ? 'Desativar' : 'Reativar'}
                        >
                          {u.ativo ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-400 text-sm">Nenhum usuário encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header><h3 className="font-semibold text-gray-900 dark:text-white">Configurações de Alerta</h3></Card.Header>
          <Card.Body>
            <div className="space-y-3 mb-4">
              {checkboxes.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={config[key] as boolean} onChange={() => toggle(key)} className="w-4 h-4 accent-[#1C3FAA]" />
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
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg"
                placeholder="alertas@empresa.com.br"
              />
            </div>
            <Button loading={saving} onClick={save}>{saved ? '✓ Salvo!' : 'Salvar configurações'}</Button>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header><h3 className="font-semibold text-gray-900 dark:text-white">Integrações</h3></Card.Header>
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

      {modalUsuario.open && (
        <ModalUsuario
          usuario={modalUsuario.usuario}
          onClose={() => setModalUsuario({ open: false, usuario: null })}
          onSaved={loadUsuarios}
        />
      )}
    </div>
  );
}
