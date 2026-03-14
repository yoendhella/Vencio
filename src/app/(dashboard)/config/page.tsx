'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Plus, Pencil, UserX, UserCheck, KeyRound,
  Eye, EyeOff, ChevronDown, AlertCircle, AlertTriangle,
} from 'lucide-react';

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
  { value: 'gestor',        label: 'Gestor' },
  { value: 'operacional',   label: 'Operacional' },
  { value: 'financeiro',    label: 'Financeiro' },
  { value: 'visualizador',  label: 'Visualizador' },
];

const PERFIL_VARIANT: Record<string, string> = {
  administrador: 'err',
  gestor:        'pri',
  operacional:   'ok',
  financeiro:    'warn',
  visualizador:  'gray',
};

function getPasswordStrength(pass: string) {
  if (!pass) return null;
  if (pass.length < 6) return { label: 'Fraca', color: 'bg-red-500', width: 'w-1/3' };
  if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass))
    return { label: 'Média', color: 'bg-yellow-500', width: 'w-2/3' };
  return { label: 'Forte', color: 'bg-green-500', width: 'w-full' };
}

const inputCls = (err?: string) =>
  `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E5FD4] transition-colors dark:bg-gray-800 dark:text-white ${
    err
      ? 'border-red-500 ring-1 ring-red-500 dark:border-red-500'
      : 'border-gray-300 dark:border-gray-600'
  }`;

// ── MODAL ──────────────────────────────────────────────────────────────────

function ModalUsuario({
  usuario, onClose, onSaved,
}: {
  usuario: Usuario | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !usuario;

  // Campos base
  const [nome,  setNome]  = useState(usuario?.nome  ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [perfil, setPerfil] = useState<Usuario['perfil']>(usuario?.perfil ?? 'visualizador');
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true);

  // Erros campos base
  const [emailError, setEmailError] = useState('');

  // Seção de senha
  const [showPwSection,  setShowPwSection]  = useState(isNew);
  const [showPw,         setShowPw]         = useState(false);
  const [novaSenha,      setNovaSenha]      = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaError,     setSenhaError]     = useState('');

  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const validateEmail = (v: string) => {
    if (!v) return 'E-mail é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'E-mail inválido';
    return '';
  };

  const submit = async () => {
    setError(''); setSenhaError(''); setEmailError('');

    const eErr = validateEmail(email);
    if (eErr) { setEmailError(eErr); return; }

    if (isNew && novaSenha.length < 8) { setSenhaError('Senha deve ter no mínimo 8 caracteres.'); return; }
    if (novaSenha && novaSenha !== confirmarSenha) { setSenhaError('Senhas não coincidem.'); return; }
    if (novaSenha && novaSenha.length > 0 && novaSenha.length < 8) { setSenhaError('Mínimo 8 caracteres.'); return; }

    setSaving(true);
    try {
      const body: Record<string, unknown> = { nome, perfil };
      if (isNew) {
        body.email = email;
        body.senha = novaSenha;
      } else {
        // Só enviar email se mudou
        if (email !== usuario!.email) body.email = email;
        if (novaSenha) body.senha = novaSenha;
        body.ativo = ativo;
      }

      const url    = isNew ? '/api/usuarios' : `/api/usuarios/${usuario!.id}`;
      const method = isNew ? 'POST' : 'PATCH';
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data   = await res.json();

      if (!res.ok) {
        const msg = String(data.error ?? 'Erro ao salvar.');
        if (msg.toLowerCase().includes('e-mail') || msg.toLowerCase().includes('email')) setEmailError(msg);
        else setError(msg);
        return;
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const strength = getPasswordStrength(novaSenha);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isNew ? 'Adicionar Usuário' : 'Editar Usuário'}
          </h2>
          {!isNew && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{usuario!.email}</p>
          )}
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Nome</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputCls()}
              placeholder="Nome completo"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
              className={inputCls(emailError)}
              placeholder="nome@empresa.com.br"
            />
            {emailError && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />{emailError}
              </p>
            )}
          </div>

          {/* Perfil */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Perfil</label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value as Usuario['perfil'])}
              className={inputCls()}
            >
              {PERFIS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          {/* Seção senha */}
          {isNew ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Senha</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => { setNovaSenha(e.target.value); setSenhaError(''); }}
                    className={`${inputCls(senhaError)} pr-10`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-1.5">
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                      <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Força: {strength.label}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirmar senha</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => { setConfirmarSenha(e.target.value); setSenhaError(''); }}
                  className={inputCls(senhaError)}
                  placeholder="Repita a senha"
                />
                {senhaError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />{senhaError}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Trocar senha — colapsável */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => setShowPwSection(!showPwSection)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-[var(--bg)] transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span className="flex items-center gap-2">
                    <KeyRound size={15} style={{ color: '#1E5FD4' }} />
                    Trocar senha
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${showPwSection ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-muted)' }}
                  />
                </button>
                {showPwSection && (
                  <div className="px-4 pb-4 pt-3 space-y-3 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Nova senha</label>
                      <div className="relative">
                        <input
                          type={showPw ? 'text' : 'password'}
                          value={novaSenha}
                          onChange={(e) => { setNovaSenha(e.target.value); setSenhaError(''); }}
                          className={`${inputCls(senhaError && !confirmarSenha ? senhaError : '')} pr-10`}
                          placeholder="Mínimo 8 caracteres"
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {strength && (
                        <div className="mt-1.5">
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                            <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                          </div>
                          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Força: {strength.label}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirmar nova senha</label>
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={confirmarSenha}
                        onChange={(e) => { setConfirmarSenha(e.target.value); setSenhaError(''); }}
                        className={inputCls(senhaError)}
                        placeholder="Repita a nova senha"
                      />
                      {senhaError && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />{senhaError}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggle ativo */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="w-4 h-4 accent-[#1E5FD4]"
                />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Usuário ativo</span>
              </label>
            </>
          )}

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle size={14} />{error}
            </p>
          )}
        </div>

        <div className="px-6 py-4 flex justify-end gap-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button loading={saving} onClick={submit}>
            {isNew ? 'Criar usuário' : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── CONFIRM MODAL ──────────────────────────────────────────────────────────

function ConfirmToggle({
  usuario, onCancel, onConfirm,
}: {
  usuario: { id: string; nome: string; ativo: boolean };
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div
        className="rounded-xl shadow-2xl w-full max-w-sm p-6 animate-slide-up"
        style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFFBEB]">
            <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {usuario.ativo ? 'Inativar' : 'Ativar'} usuário
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Esta ação pode ser revertida</p>
          </div>
        </div>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
          Deseja {usuario.ativo ? 'inativar' : 'ativar'} o usuário{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{usuario.nome}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel} className="flex-1">Cancelar</Button>
          <button
            onClick={onConfirm}
            className={`flex-1 inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer rounded-lg px-4 py-2 text-sm text-white ${
              usuario.ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {usuario.ativo ? 'Inativar' : 'Ativar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────

export default function ConfigPage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [config, setConfig] = useState<Config>({
    alerta90dias: false, alerta60dias: true, alerta30dias: true,
    alertaReajuste: true, alertaCertidao: true, alertaSla: true,
    resumoSemanal: false, emailDestinatario: null,
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const [usuarios,     setUsuarios]     = useState<Usuario[]>([]);
  const [modalUsuario, setModalUsuario] = useState<{ open: boolean; usuario: Usuario | null }>({ open: false, usuario: null });
  const [confirmToggle, setConfirmToggle] = useState<{ id: string; nome: string; ativo: boolean } | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsuarios = async () => {
    const res = await fetch('/api/usuarios');
    if (res.ok) { const d = await res.json(); setUsuarios(d.data); }
  };

  useEffect(() => { loadUsuarios(); }, []);

  const toggle = (key: keyof Config) => {
    if (typeof config[key] === 'boolean') setConfig((p) => ({ ...p, [key]: !p[key] }));
  };

  const saveConfig = async () => {
    setSaving(true);
    await fetch('/api/config/alertas', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleToggleStatus = (u: Usuario) => {
    if (u.id === currentUserId) {
      showToast('Você não pode inativar sua própria conta.', 'err');
      return;
    }
    setConfirmToggle({ id: u.id, nome: u.nome, ativo: u.ativo });
  };

  const confirmToggleStatus = async () => {
    if (!confirmToggle) return;
    const res = await fetch(`/api/usuarios/${confirmToggle.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !confirmToggle.ativo }),
    });
    setConfirmToggle(null);
    if (res.ok) {
      showToast(`Usuário ${confirmToggle.ativo ? 'inativado' : 'ativado'} com sucesso.`);
      loadUsuarios();
    } else {
      showToast('Erro ao atualizar status.', 'err');
    }
  };

  const checkboxes: { key: keyof Config; label: string }[] = [
    { key: 'alerta30dias',   label: 'Alertas 30 dias antes do vencimento' },
    { key: 'alerta60dias',   label: 'Alertas 60 dias antes do vencimento' },
    { key: 'alerta90dias',   label: 'Alertas 90 dias antes do vencimento' },
    { key: 'alertaReajuste', label: 'Alertas de reajustes pendentes' },
    { key: 'alertaCertidao', label: 'Alertas de certidões vencendo' },
    { key: 'alertaSla',      label: 'Alertas de SLA em risco' },
    { key: 'resumoSemanal',  label: 'Resumo semanal (toda segunda-feira)' },
  ];

  return (
    <div>
      <PageHeader title="Configurações" description="Alertas, usuários e integrações" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-4 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-slide-up ${
          toast.type === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Usuários */}
      <Card className="mb-4">
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Usuários do Sistema</h3>
            <Button size="sm" onClick={() => setModalUsuario({ open: true, usuario: null })}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar Usuário
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  {['Nome', 'Email', 'Perfil', 'Senha', 'Ativo', ''].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-[var(--bg)] transition-colors" style={{ borderColor: 'var(--border-muted)' }}>
                    <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {u.nome}
                      {u.id === currentUserId && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">você</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={(PERFIL_VARIANT[u.perfil] ?? 'gray') as never}>
                        {PERFIS.find((p) => p.value === u.perfil)?.label ?? u.perfil}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3">
                      {u.temSenha
                        ? <span className="flex items-center gap-1 text-green-600 text-xs"><KeyRound size={12} /> Configurada</span>
                        : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Não configurada</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                        title={u.ativo ? 'Clique para inativar' : 'Clique para ativar'}
                      >
                        <Badge variant={u.ativo ? 'ok' : 'gray'}>{u.ativo ? 'Ativo' : 'Inativo'}</Badge>
                      </button>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setModalUsuario({ open: true, usuario: u })}
                          className="p-1.5 rounded transition-colors hover:bg-[var(--border)]"
                          style={{ color: 'var(--text-muted)' }}
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`p-1.5 rounded transition-colors ${u.ativo ? 'hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30' : 'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/30'}`}
                          style={{ color: 'var(--text-muted)' }}
                          title={u.ativo ? 'Desativar' : 'Reativar'}
                        >
                          {u.ativo ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>Nenhum usuário encontrado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <Card.Header><h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Configurações de Alerta</h3></Card.Header>
          <Card.Body>
            <div className="space-y-3 mb-4">
              {checkboxes.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={config[key] as boolean} onChange={() => toggle(key)} className="w-4 h-4 accent-[#1E5FD4]" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                </label>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Email destinatário</label>
              <input
                type="email"
                value={config.emailDestinatario ?? ''}
                onChange={(e) => setConfig((p) => ({ ...p, emailDestinatario: e.target.value }))}
                className={inputCls()}
                placeholder="alertas@empresa.com.br"
              />
            </div>
            <Button loading={saving} onClick={saveConfig}>{saved ? '✓ Salvo!' : 'Salvar configurações'}</Button>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header><h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Integrações</h3></Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-green-200 dark:border-green-800 bg-[#E6FFF5]">
                <div><p className="text-sm font-medium text-green-800">IBGE — Índices</p><p className="text-xs text-green-600">API conectada</p></div>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Ativo</span>
              </div>
              {[
                { label: 'ERP — SAP/Totvs', sub: 'Não configurado' },
                { label: 'Assinatura Digital', sub: 'DocuSign / Clicksign' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                  </div>
                  <span className="text-xs bg-gray-400 text-white px-2 py-0.5 rounded-full">Inativo</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Modals */}
      {modalUsuario.open && (
        <ModalUsuario
          usuario={modalUsuario.usuario}
          onClose={() => setModalUsuario({ open: false, usuario: null })}
          onSaved={() => { loadUsuarios(); showToast(modalUsuario.usuario ? 'Usuário atualizado.' : 'Usuário criado com sucesso.'); }}
        />
      )}
      {confirmToggle && (
        <ConfirmToggle
          usuario={confirmToggle}
          onCancel={() => setConfirmToggle(null)}
          onConfirm={confirmToggleStatus}
        />
      )}
    </div>
  );
}
