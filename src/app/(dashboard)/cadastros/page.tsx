'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Tag, FileText, DollarSign, UserCheck,
  TrendingUp, Plus, Search, Edit2, Trash2, X, Check,
} from 'lucide-react';
import { ExportButtons } from '@/components/ui/ExportButtons';

// ── Tipos ─────────────────────────────────────────────────────────────────

interface Categoria {
  id: string; nome: string; codigoInterno: string; descricao: string; status: 'ativa' | 'inativa';
}
interface TipoContrato {
  id: string; nome: string; prazoMeses: number; requerAditivo: boolean; status: 'ativo' | 'inativo';
}
interface CentroCusto {
  id: string; codigo: string; descricao: string; responsavel: string; unidade: string; status: 'ativo' | 'inativo';
}
interface Responsavel {
  id: string; nomeCompleto: string; cargo: string; email: string; telefone: string; unidade: string; status: 'ativo' | 'inativo';
}
interface IndiceReajuste {
  id: string; nome: string; percentualAtual: number; fonte: string; dataAtualizacao: string; status: 'ativo' | 'inativo';
}

// ── Mock data ─────────────────────────────────────────────────────────────

const mockCategorias: Categoria[] = [
  { id: '1', nome: 'Limpeza',    codigoInterno: 'LMP', descricao: 'Serviços de limpeza e conservação',  status: 'ativa'  },
  { id: '2', nome: 'Segurança',  codigoInterno: 'SEG', descricao: 'Vigilância e segurança patrimonial', status: 'ativa'  },
  { id: '3', nome: 'TI',         codigoInterno: 'TI',  descricao: 'Suporte e infraestrutura de TI',     status: 'ativa'  },
  { id: '4', nome: 'Manutenção', codigoInterno: 'MNT', descricao: 'Manutenção predial e equipamentos',  status: 'ativa'  },
  { id: '5', nome: 'RH',         codigoInterno: 'RH',  descricao: 'Recursos Humanos terceirizados',     status: 'inativa'},
];
const mockTipos: TipoContrato[] = [
  { id: '1', nome: 'Prestação de Serviços',     prazoMeses: 12, requerAditivo: true,  status: 'ativo'  },
  { id: '2', nome: 'Locação de Equipamentos',   prazoMeses: 24, requerAditivo: false, status: 'ativo'  },
  { id: '3', nome: 'Manutenção Preventiva',     prazoMeses: 12, requerAditivo: true,  status: 'ativo'  },
  { id: '4', nome: 'Fornecimento de Materiais', prazoMeses: 6,  requerAditivo: false, status: 'inativo'},
];
const mockCentros: CentroCusto[] = [
  { id: '1', codigo: 'CC-001', descricao: 'Administrativo Matriz', responsavel: 'Carlos Mendes', unidade: 'Matriz SP', status: 'ativo' },
  { id: '2', codigo: 'CC-002', descricao: 'Operacional Filial RJ', responsavel: 'Ana Lima',      unidade: 'Filial RJ', status: 'ativo' },
  { id: '3', codigo: 'CC-003', descricao: 'TI Corporativo',        responsavel: 'Pedro Alves',   unidade: 'Matriz SP', status: 'ativo' },
];
const mockResponsaveis: Responsavel[] = [
  { id: '1', nomeCompleto: 'Carlos Mendes', cargo: 'Gerente Administrativo',  email: 'carlos@empresa.com', telefone: '(11) 99999-0001', unidade: 'Matriz SP', status: 'ativo' },
  { id: '2', nomeCompleto: 'Ana Lima',      cargo: 'Coordenadora Operacional', email: 'ana@empresa.com',    telefone: '(21) 99999-0002', unidade: 'Filial RJ', status: 'ativo' },
  { id: '3', nomeCompleto: 'Pedro Alves',   cargo: 'Analista de TI',           email: 'pedro@empresa.com',  telefone: '(11) 99999-0003', unidade: 'Matriz SP', status: 'ativo' },
];
const mockIndices: IndiceReajuste[] = [
  { id: '1', nome: 'IPCA',  percentualAtual: 4.83, fonte: 'IBGE', dataAtualizacao: '2026-02-28', status: 'ativo' },
  { id: '2', nome: 'IGP-M', percentualAtual: 6.12, fonte: 'FGV',  dataAtualizacao: '2026-02-28', status: 'ativo' },
  { id: '3', nome: 'INPC',  percentualAtual: 4.51, fonte: 'IBGE', dataAtualizacao: '2026-02-28', status: 'ativo' },
  { id: '4', nome: 'IPC-A', percentualAtual: 4.72, fonte: 'IBGE', dataAtualizacao: '2026-02-28', status: 'ativo' },
  { id: '5', nome: 'INCC',  percentualAtual: 5.34, fonte: 'FGV',  dataAtualizacao: '2026-02-28', status: 'ativo' },
];

// ── Tabs ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'categorias',   label: 'Categorias',          icon: Tag        },
  { id: 'tipos',        label: 'Tipos de Contrato',   icon: FileText   },
  { id: 'centros',      label: 'Centros de Custo',    icon: DollarSign },
  { id: 'responsaveis', label: 'Responsáveis',         icon: UserCheck  },
  { id: 'indices',      label: 'Índices de Reajuste', icon: TrendingUp },
];

// ── Componentes auxiliares ────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    ativo:   { label: 'Ativo',   color: '#10b981' },
    ativa:   { label: 'Ativa',   color: '#10b981' },
    inativo: { label: 'Inativo', color: '#6b7280' },
    inativa: { label: 'Inativa', color: '#6b7280' },
  };
  const s = map[status] ?? { label: status, color: '#6b7280' };
  return (
    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>
      {s.label}
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', width: '100%', maxWidth: 520, padding: '28px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inp: React.CSSProperties = { width: '100%', padding: '9px 13px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

function FormActions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
      <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
      <button onClick={onSave} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}><Check size={14} />Salvar</button>
    </div>
  );
}

const tStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
const th: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' };
const td: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-muted)' };
const iconBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 5, borderRadius: 6, display: 'flex', alignItems: 'center' };

// ── Inner (precisa de useSearchParams) ───────────────────────────────────

function CadastrosInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabFromUrl = searchParams.get('tab') ?? 'categorias';
  const [tab, setTab] = useState(tabFromUrl);

  useEffect(() => {
    const t = searchParams.get('tab') ?? 'categorias';
    setTab(t);
  }, [searchParams]);

  function changeTab(id: string) {
    setTab(id);
    setSearch('');
    setModal(null);
    router.push(`/cadastros?tab=${id}`, { scroll: false });
  }

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<string | null>(null);

  const [categorias,   setCategorias]   = useState<Categoria[]>(mockCategorias);
  const [tipos,        setTipos]        = useState<TipoContrato[]>(mockTipos);
  const [centros,      setCentros]      = useState<CentroCusto[]>(mockCentros);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>(mockResponsaveis);
  const [indices,      setIndices]      = useState<IndiceReajuste[]>(mockIndices);

  const [catForm,    setCatForm]    = useState<Omit<Categoria, 'id'>>({ nome: '', codigoInterno: '', descricao: '', status: 'ativa' });
  const [tipoForm,   setTipoForm]   = useState<Omit<TipoContrato, 'id'>>({ nome: '', prazoMeses: 12, requerAditivo: false, status: 'ativo' });
  const [centroForm, setCentroForm] = useState<Omit<CentroCusto, 'id'>>({ codigo: '', descricao: '', responsavel: '', unidade: '', status: 'ativo' });
  const [respForm,   setRespForm]   = useState<Omit<Responsavel, 'id'>>({ nomeCompleto: '', cargo: '', email: '', telefone: '', unidade: '', status: 'ativo' });
  const [idxForm,    setIdxForm]    = useState<Omit<IndiceReajuste, 'id'>>({ nome: '', percentualAtual: 0, fonte: '', dataAtualizacao: '', status: 'ativo' });

  const newId = () => Date.now().toString();

  function handleSave() {
    if (tab === 'categorias')   setCategorias((p) => [...p, { id: newId(), ...catForm }]);
    if (tab === 'tipos')        setTipos((p) => [...p, { id: newId(), ...tipoForm }]);
    if (tab === 'centros')      setCentros((p) => [...p, { id: newId(), ...centroForm }]);
    if (tab === 'responsaveis') setResponsaveis((p) => [...p, { id: newId(), ...respForm }]);
    if (tab === 'indices')      setIndices((p) => [...p, { id: newId(), ...idxForm }]);
    setModal(null);
  }

  function handleDelete(id: string) {
    if (tab === 'categorias')   setCategorias((p) => p.filter((x) => x.id !== id));
    if (tab === 'tipos')        setTipos((p) => p.filter((x) => x.id !== id));
    if (tab === 'centros')      setCentros((p) => p.filter((x) => x.id !== id));
    if (tab === 'responsaveis') setResponsaveis((p) => p.filter((x) => x.id !== id));
    if (tab === 'indices')      setIndices((p) => p.filter((x) => x.id !== id));
  }

  function rowActions(onDelete: () => void) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button style={iconBtn} title="Editar"
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#2563eb'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
        ><Edit2 size={13} /></button>
        <button onClick={onDelete} style={{ ...iconBtn, color: '#ef444488' }} title="Excluir"
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#ef444488'}
        ><Trash2 size={13} /></button>
      </div>
    );
  }

  // ── Export helpers ─────────────────────────────────────────────────────
  function getExportProps() {
    const q = search.toLowerCase();
    if (tab === 'categorias') {
      const rows = categorias.filter((r) => r.nome.toLowerCase().includes(q) || r.codigoInterno.toLowerCase().includes(q));
      return { data: rows.map((r) => ({ Nome: r.nome, Código: r.codigoInterno, Descrição: r.descricao, Status: r.status })), columns: ['Nome', 'Código', 'Descrição', 'Status'] as string[], pdfRows: rows.map((r) => [r.nome, r.codigoInterno, r.descricao, r.status]) as (string | number)[][], pdfTitle: 'Categorias de Contratos', filename: 'categorias' };
    }
    if (tab === 'tipos') {
      const rows = tipos.filter((r) => r.nome.toLowerCase().includes(q));
      return { data: rows.map((r) => ({ Nome: r.nome, 'Prazo (meses)': r.prazoMeses, 'Req. Aditivo': r.requerAditivo ? 'Sim' : 'Não', Status: r.status })), columns: ['Nome', 'Prazo (meses)', 'Req. Aditivo', 'Status'] as string[], pdfRows: rows.map((r) => [r.nome, r.prazoMeses, r.requerAditivo ? 'Sim' : 'Não', r.status]) as (string | number)[][], pdfTitle: 'Tipos de Contrato', filename: 'tipos-contrato' };
    }
    if (tab === 'centros') {
      const rows = centros.filter((r) => r.codigo.toLowerCase().includes(q) || r.descricao.toLowerCase().includes(q));
      return { data: rows.map((r) => ({ Código: r.codigo, Descrição: r.descricao, Responsável: r.responsavel, Unidade: r.unidade, Status: r.status })), columns: ['Código', 'Descrição', 'Responsável', 'Unidade', 'Status'] as string[], pdfRows: rows.map((r) => [r.codigo, r.descricao, r.responsavel, r.unidade, r.status]) as (string | number)[][], pdfTitle: 'Centros de Custo', filename: 'centros-custo' };
    }
    if (tab === 'responsaveis') {
      const rows = responsaveis.filter((r) => r.nomeCompleto.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
      return { data: rows.map((r) => ({ Nome: r.nomeCompleto, Cargo: r.cargo, Email: r.email, Telefone: r.telefone, Unidade: r.unidade, Status: r.status })), columns: ['Nome', 'Cargo', 'Email', 'Telefone', 'Unidade', 'Status'] as string[], pdfRows: rows.map((r) => [r.nomeCompleto, r.cargo, r.email, r.telefone, r.unidade, r.status]) as (string | number)[][], pdfTitle: 'Responsáveis por Contratos', filename: 'responsaveis' };
    }
    const rows = indices.filter((r) => r.nome.toLowerCase().includes(q));
    return { data: rows.map((r) => ({ Nome: r.nome, '% Atual': r.percentualAtual, Fonte: r.fonte, Atualização: r.dataAtualizacao, Status: r.status })), columns: ['Nome', '% Atual', 'Fonte', 'Atualização', 'Status'] as string[], pdfRows: rows.map((r) => [r.nome, `${r.percentualAtual.toFixed(2)}%`, r.fonte, new Date(r.dataAtualizacao).toLocaleDateString('pt-BR'), r.status]) as (string | number)[][], pdfTitle: 'Índices de Reajuste', filename: 'indices-reajuste' };
  }

  function renderTable() {
    const q = search.toLowerCase();

    if (tab === 'categorias') {
      const rows = categorias.filter((r) => r.nome.toLowerCase().includes(q) || r.codigoInterno.toLowerCase().includes(q));
      return (
        <table style={tStyle}>
          <thead><tr>{['Nome', 'Código', 'Descrição', 'Status', ''].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 !== 0 ? 'var(--surface-hover)' : 'transparent' }}>
              <td style={td}><strong>{r.nome}</strong></td>
              <td style={td}><span style={{ fontFamily: 'monospace', color: '#60a5fa' }}>{r.codigoInterno}</span></td>
              <td style={{ ...td, color: 'var(--text-secondary)' }}>{r.descricao}</td>
              <td style={td}><StatusBadge status={r.status} /></td>
              <td style={{ ...td, textAlign: 'right' }}>{rowActions(() => handleDelete(r.id))}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    if (tab === 'tipos') {
      const rows = tipos.filter((r) => r.nome.toLowerCase().includes(q));
      return (
        <table style={tStyle}>
          <thead><tr>{['Nome', 'Prazo (meses)', 'Req. Aditivo', 'Status', ''].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 !== 0 ? 'var(--surface-hover)' : 'transparent' }}>
              <td style={td}><strong>{r.nome}</strong></td>
              <td style={td}>{r.prazoMeses}</td>
              <td style={td}>{r.requerAditivo ? <span style={{ color: '#10b981' }}>✓ Sim</span> : <span style={{ color: '#6b7280' }}>Não</span>}</td>
              <td style={td}><StatusBadge status={r.status} /></td>
              <td style={{ ...td, textAlign: 'right' }}>{rowActions(() => handleDelete(r.id))}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    if (tab === 'centros') {
      const rows = centros.filter((r) => r.codigo.toLowerCase().includes(q) || r.descricao.toLowerCase().includes(q));
      return (
        <table style={tStyle}>
          <thead><tr>{['Código', 'Descrição', 'Responsável', 'Unidade', 'Status', ''].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 !== 0 ? 'var(--surface-hover)' : 'transparent' }}>
              <td style={td}><span style={{ fontFamily: 'monospace', color: '#60a5fa' }}>{r.codigo}</span></td>
              <td style={td}><strong>{r.descricao}</strong></td>
              <td style={{ ...td, color: 'var(--text-secondary)' }}>{r.responsavel}</td>
              <td style={{ ...td, color: 'var(--text-secondary)' }}>{r.unidade}</td>
              <td style={td}><StatusBadge status={r.status} /></td>
              <td style={{ ...td, textAlign: 'right' }}>{rowActions(() => handleDelete(r.id))}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    if (tab === 'responsaveis') {
      const rows = responsaveis.filter((r) => r.nomeCompleto.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
      return (
        <table style={tStyle}>
          <thead><tr>{['Nome', 'Cargo', 'E-mail', 'Unidade', 'Status', ''].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 !== 0 ? 'var(--surface-hover)' : 'transparent' }}>
              <td style={td}><strong>{r.nomeCompleto}</strong></td>
              <td style={{ ...td, color: 'var(--text-secondary)' }}>{r.cargo}</td>
              <td style={{ ...td, color: '#60a5fa' }}>{r.email}</td>
              <td style={{ ...td, color: 'var(--text-secondary)' }}>{r.unidade}</td>
              <td style={td}><StatusBadge status={r.status} /></td>
              <td style={{ ...td, textAlign: 'right' }}>{rowActions(() => handleDelete(r.id))}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }

    if (tab === 'indices') {
      const rows = indices.filter((r) => r.nome.toLowerCase().includes(q));
      return (
        <table style={tStyle}>
          <thead><tr>{['Nome', '% Atual', 'Fonte', 'Atualização', 'Status', ''].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => (
            <tr key={r.id} style={{ background: i % 2 !== 0 ? 'var(--surface-hover)' : 'transparent' }}>
              <td style={td}><strong style={{ color: '#60a5fa' }}>{r.nome}</strong></td>
              <td style={td}><span style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>{r.percentualAtual.toFixed(2)}%</span></td>
              <td style={{ ...td, color: 'var(--text-secondary)' }}>{r.fonte}</td>
              <td style={{ ...td, color: 'var(--text-secondary)' }}>{new Date(r.dataAtualizacao).toLocaleDateString('pt-BR')}</td>
              <td style={td}><StatusBadge status={r.status} /></td>
              <td style={{ ...td, textAlign: 'right' }}>{rowActions(() => handleDelete(r.id))}</td>
            </tr>
          ))}</tbody>
        </table>
      );
    }
  }

  function renderModal() {
    if (!modal) return null;
    const title = `Novo ${TABS.find((t) => t.id === tab)?.label ?? 'Cadastro'}`;

    if (tab === 'categorias') return (
      <Modal title={title} onClose={() => setModal(null)}>
        <Field label="Nome *"><input style={inp} value={catForm.nome} onChange={(e) => setCatForm((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: Limpeza" /></Field>
        <Field label="Código Interno"><input style={inp} value={catForm.codigoInterno} onChange={(e) => setCatForm((p) => ({ ...p, codigoInterno: e.target.value.toUpperCase() }))} placeholder="Ex: LMP" /></Field>
        <Field label="Descrição"><input style={inp} value={catForm.descricao} onChange={(e) => setCatForm((p) => ({ ...p, descricao: e.target.value }))} placeholder="Descrição da categoria" /></Field>
        <Field label="Status"><select style={inp} value={catForm.status} onChange={(e) => setCatForm((p) => ({ ...p, status: e.target.value as 'ativa' | 'inativa' }))}><option value="ativa">Ativa</option><option value="inativa">Inativa</option></select></Field>
        <FormActions onCancel={() => setModal(null)} onSave={handleSave} />
      </Modal>
    );
    if (tab === 'tipos') return (
      <Modal title={title} onClose={() => setModal(null)}>
        <Field label="Nome *"><input style={inp} value={tipoForm.nome} onChange={(e) => setTipoForm((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: Prestação de Serviços" /></Field>
        <Field label="Prazo Padrão (meses)"><input style={inp} type="number" value={tipoForm.prazoMeses} onChange={(e) => setTipoForm((p) => ({ ...p, prazoMeses: +e.target.value }))} /></Field>
        <Field label="Requer Aditivo para Renovação"><select style={inp} value={tipoForm.requerAditivo ? 'sim' : 'nao'} onChange={(e) => setTipoForm((p) => ({ ...p, requerAditivo: e.target.value === 'sim' }))}><option value="sim">Sim</option><option value="nao">Não</option></select></Field>
        <Field label="Status"><select style={inp} value={tipoForm.status} onChange={(e) => setTipoForm((p) => ({ ...p, status: e.target.value as 'ativo' | 'inativo' }))}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></Field>
        <FormActions onCancel={() => setModal(null)} onSave={handleSave} />
      </Modal>
    );
    if (tab === 'centros') return (
      <Modal title={title} onClose={() => setModal(null)}>
        <Field label="Código *"><input style={inp} value={centroForm.codigo} onChange={(e) => setCentroForm((p) => ({ ...p, codigo: e.target.value }))} placeholder="Ex: CC-001" /></Field>
        <Field label="Descrição *"><input style={inp} value={centroForm.descricao} onChange={(e) => setCentroForm((p) => ({ ...p, descricao: e.target.value }))} placeholder="Ex: Administrativo Matriz" /></Field>
        <Field label="Responsável"><input style={inp} value={centroForm.responsavel} onChange={(e) => setCentroForm((p) => ({ ...p, responsavel: e.target.value }))} placeholder="Nome do responsável" /></Field>
        <Field label="Unidade"><input style={inp} value={centroForm.unidade} onChange={(e) => setCentroForm((p) => ({ ...p, unidade: e.target.value }))} placeholder="Ex: Matriz SP" /></Field>
        <Field label="Status"><select style={inp} value={centroForm.status} onChange={(e) => setCentroForm((p) => ({ ...p, status: e.target.value as 'ativo' | 'inativo' }))}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></Field>
        <FormActions onCancel={() => setModal(null)} onSave={handleSave} />
      </Modal>
    );
    if (tab === 'responsaveis') return (
      <Modal title={title} onClose={() => setModal(null)}>
        <Field label="Nome Completo *"><input style={inp} value={respForm.nomeCompleto} onChange={(e) => setRespForm((p) => ({ ...p, nomeCompleto: e.target.value }))} placeholder="Nome completo" /></Field>
        <Field label="Cargo / Função"><input style={inp} value={respForm.cargo} onChange={(e) => setRespForm((p) => ({ ...p, cargo: e.target.value }))} placeholder="Ex: Gerente Administrativo" /></Field>
        <Field label="E-mail"><input style={inp} type="email" value={respForm.email} onChange={(e) => setRespForm((p) => ({ ...p, email: e.target.value }))} placeholder="email@empresa.com" /></Field>
        <Field label="Telefone"><input style={inp} value={respForm.telefone} onChange={(e) => setRespForm((p) => ({ ...p, telefone: e.target.value }))} placeholder="(00) 00000-0000" /></Field>
        <Field label="Unidade"><input style={inp} value={respForm.unidade} onChange={(e) => setRespForm((p) => ({ ...p, unidade: e.target.value }))} placeholder="Ex: Matriz SP" /></Field>
        <Field label="Status"><select style={inp} value={respForm.status} onChange={(e) => setRespForm((p) => ({ ...p, status: e.target.value as 'ativo' | 'inativo' }))}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></Field>
        <FormActions onCancel={() => setModal(null)} onSave={handleSave} />
      </Modal>
    );
    if (tab === 'indices') return (
      <Modal title={title} onClose={() => setModal(null)}>
        <Field label="Nome *"><input style={inp} value={idxForm.nome} onChange={(e) => setIdxForm((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: IPCA" /></Field>
        <Field label="Percentual Atual (%)"><input style={inp} type="number" step="0.01" value={idxForm.percentualAtual} onChange={(e) => setIdxForm((p) => ({ ...p, percentualAtual: +e.target.value }))} /></Field>
        <Field label="Fonte"><input style={inp} value={idxForm.fonte} onChange={(e) => setIdxForm((p) => ({ ...p, fonte: e.target.value }))} placeholder="Ex: IBGE, FGV" /></Field>
        <Field label="Data de Atualização"><input style={inp} type="date" value={idxForm.dataAtualizacao} onChange={(e) => setIdxForm((p) => ({ ...p, dataAtualizacao: e.target.value }))} /></Field>
        <Field label="Status"><select style={inp} value={idxForm.status} onChange={(e) => setIdxForm((p) => ({ ...p, status: e.target.value as 'ativo' | 'inativo' }))}><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></Field>
        <FormActions onCancel={() => setModal(null)} onSave={handleSave} />
      </Modal>
    );
    return null;
  }

  const exp = getExportProps();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Cadastros</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Gerencie as tabelas auxiliares do sistema</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => changeTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 16px', borderRadius: 8, border: '1px solid',
              borderColor: active ? '#2563eb' : 'var(--border)',
              background: active ? 'rgba(37,99,235,0.14)' : 'transparent',
              color: active ? '#93c5fd' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: active ? 600 : 400,
              cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit',
            }}>
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input style={{ ...inp, paddingLeft: 36 }} placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExportButtons data={exp.data} filename={exp.filename} pdfTitle={exp.pdfTitle} columns={exp.columns} rows={exp.pdfRows} />
          <button onClick={() => setModal('novo')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Plus size={14} /> Novo Cadastro
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>{renderTable()}</div>
      </div>

      {renderModal()}
    </div>
  );
}

// Wrap em Suspense por causa do useSearchParams
export default function CadastrosPage() {
  return (
    <Suspense fallback={null}>
      <CadastrosInner />
    </Suspense>
  );
}
