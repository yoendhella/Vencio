'use client';

import { useState } from 'react';
import {
  Tag, FileText, DollarSign, UserCheck,
  TrendingUp, Plus, Search, Edit2, Trash2, X, Check,
} from 'lucide-react';

// ── Tipos ──────────────────────────────────────────────────────────────────

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

// ── Mock inicial (substituir por fetch quando APIs estiverem prontas) ───────

const initCategorias: Categoria[] = [
  { id: '1', nome: 'Limpeza',    codigoInterno: 'LMP', descricao: 'Serviços de limpeza e conservação',   status: 'ativa'  },
  { id: '2', nome: 'Segurança',  codigoInterno: 'SEG', descricao: 'Vigilância e segurança patrimonial',   status: 'ativa'  },
  { id: '3', nome: 'TI',         codigoInterno: 'TI',  descricao: 'Suporte e infraestrutura de TI',       status: 'ativa'  },
  { id: '4', nome: 'Manutenção', codigoInterno: 'MNT', descricao: 'Manutenção predial e equipamentos',    status: 'ativa'  },
  { id: '5', nome: 'RH',         codigoInterno: 'RH',  descricao: 'Recursos Humanos terceirizados',       status: 'inativa'},
];

const initTipos: TipoContrato[] = [
  { id: '1', nome: 'Prestação de Serviços',    prazoMeses: 12, requerAditivo: true,  status: 'ativo'  },
  { id: '2', nome: 'Locação de Equipamentos',  prazoMeses: 24, requerAditivo: false, status: 'ativo'  },
  { id: '3', nome: 'Manutenção Preventiva',    prazoMeses: 12, requerAditivo: true,  status: 'ativo'  },
  { id: '4', nome: 'Fornecimento de Materiais',prazoMeses:  6, requerAditivo: false, status: 'inativo'},
];

const initCentros: CentroCusto[] = [
  { id: '1', codigo: 'CC-001', descricao: 'Administrativo Matriz',  responsavel: 'Carlos Mendes', unidade: 'Matriz SP', status: 'ativo' },
  { id: '2', codigo: 'CC-002', descricao: 'Operacional Filial RJ',  responsavel: 'Ana Lima',      unidade: 'Filial RJ', status: 'ativo' },
  { id: '3', codigo: 'CC-003', descricao: 'TI Corporativo',          responsavel: 'Pedro Alves',   unidade: 'Matriz SP', status: 'ativo' },
];

const initResponsaveis: Responsavel[] = [
  { id: '1', nomeCompleto: 'Carlos Mendes', cargo: 'Gerente Administrativo',    email: 'carlos@empresa.com', telefone: '(11) 99999-0001', unidade: 'Matriz SP', status: 'ativo' },
  { id: '2', nomeCompleto: 'Ana Lima',      cargo: 'Coordenadora Operacional',   email: 'ana@empresa.com',    telefone: '(21) 99999-0002', unidade: 'Filial RJ', status: 'ativo' },
  { id: '3', nomeCompleto: 'Pedro Alves',   cargo: 'Analista de TI',             email: 'pedro@empresa.com',  telefone: '(11) 99999-0003', unidade: 'Matriz SP', status: 'ativo' },
];

const initIndices: IndiceReajuste[] = [
  { id: '1', nome: 'IPCA',  percentualAtual: 4.83, fonte: 'IBGE', dataAtualizacao: '2026-02-28', status: 'ativo' },
  { id: '2', nome: 'IGP-M', percentualAtual: 6.12, fonte: 'FGV',  dataAtualizacao: '2026-02-29', status: 'ativo' },
  { id: '3', nome: 'INPC',  percentualAtual: 4.51, fonte: 'IBGE', dataAtualizacao: '2026-02-28', status: 'ativo' },
  { id: '4', nome: 'IPC-A', percentualAtual: 4.72, fonte: 'IBGE', dataAtualizacao: '2026-02-28', status: 'ativo' },
  { id: '5', nome: 'INCC',  percentualAtual: 5.34, fonte: 'FGV',  dataAtualizacao: '2026-02-29', status: 'ativo' },
];

// ── Sub-componentes ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    ativo:      { label: 'Ativo',      color: '#10b981' },
    ativa:      { label: 'Ativa',      color: '#10b981' },
    inativo:    { label: 'Inativo',    color: '#6b7280' },
    inativa:    { label: 'Inativa',    color: '#6b7280' },
    em_analise: { label: 'Em análise', color: '#f59e0b' },
  };
  const s = map[status] ?? { label: status, color: '#6b7280' };
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 12,
      fontSize: 11, fontWeight: 600,
      background: s.color + '22', color: s.color, border: `1px solid ${s.color}44`,
    }}>
      {s.label}
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)',
          width: '100%', maxWidth: 540, padding: '28px 32px', position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputSt: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg)', border: '1.5px solid var(--border)',
  borderRadius: 8, fontSize: 14, color: 'var(--text-primary)',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

function FormActions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
      <button onClick={onCancel} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
        Cancelar
      </button>
      <button onClick={onSave} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
        <Check size={14} /> Salvar
      </button>
    </div>
  );
}

const TABS = [
  { id: 'categorias',   label: 'Categorias',         icon: Tag        },
  { id: 'tipos',        label: 'Tipos de Contrato',  icon: FileText   },
  { id: 'centros',      label: 'Centros de Custo',   icon: DollarSign },
  { id: 'responsaveis', label: 'Responsáveis',        icon: UserCheck  },
  { id: 'indices',      label: 'Índices de Reajuste', icon: TrendingUp },
];

const thSt: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: 10.5, fontWeight: 700,
  letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-muted)',
  borderBottom: '1px solid var(--border)', background: 'var(--bg)',
};
const tdSt: React.CSSProperties = {
  padding: '13px 16px', fontSize: 13, color: 'var(--text-primary)',
  borderBottom: '1px solid var(--border-muted)',
};

// ── Página ────────────────────────────────────────────────────────────────

export default function CadastrosPage() {
  const [tab, setTab]       = useState('categorias');
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState(false);

  const [categorias,   setCategorias]   = useState<Categoria[]>(initCategorias);
  const [tipos,        setTipos]        = useState<TipoContrato[]>(initTipos);
  const [centros,      setCentros]      = useState<CentroCusto[]>(initCentros);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>(initResponsaveis);
  const [indices,      setIndices]      = useState<IndiceReajuste[]>(initIndices);

  const [catForm,    setCatForm]    = useState<Omit<Categoria,   'id'>>({ nome: '', codigoInterno: '', descricao: '', status: 'ativa' });
  const [tipoForm,   setTipoForm]   = useState<Omit<TipoContrato,'id'>>({ nome: '', prazoMeses: 12, requerAditivo: false, status: 'ativo' });
  const [centroForm, setCentroForm] = useState<Omit<CentroCusto, 'id'>>({ codigo: '', descricao: '', responsavel: '', unidade: '', status: 'ativo' });
  const [respForm,   setRespForm]   = useState<Omit<Responsavel, 'id'>>({ nomeCompleto: '', cargo: '', email: '', telefone: '', unidade: '', status: 'ativo' });
  const [idxForm,    setIdxForm]    = useState<Omit<IndiceReajuste,'id'>>({ nome: '', percentualAtual: 0, fonte: '', dataAtualizacao: '', status: 'ativo' });

  const newId = () => Date.now().toString();

  function handleSave() {
    if (tab === 'categorias')   setCategorias(p => [...p, { id: newId(), ...catForm }]);
    if (tab === 'tipos')        setTipos(p => [...p, { id: newId(), ...tipoForm }]);
    if (tab === 'centros')      setCentros(p => [...p, { id: newId(), ...centroForm }]);
    if (tab === 'responsaveis') setResponsaveis(p => [...p, { id: newId(), ...respForm }]);
    if (tab === 'indices')      setIndices(p => [...p, { id: newId(), ...idxForm }]);
    setModal(false);
  }

  function handleDelete(id: string) {
    if (tab === 'categorias')   setCategorias(p => p.filter(x => x.id !== id));
    if (tab === 'tipos')        setTipos(p => p.filter(x => x.id !== id));
    if (tab === 'centros')      setCentros(p => p.filter(x => x.id !== id));
    if (tab === 'responsaveis') setResponsaveis(p => p.filter(x => x.id !== id));
    if (tab === 'indices')      setIndices(p => p.filter(x => x.id !== id));
  }

  function RowActions({ onDelete }: { onDelete: () => void }) {
    return (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 5, borderRadius: 6, display: 'flex', alignItems: 'center' }} title="Editar">
          <Edit2 size={13} />
        </button>
        <button
          onClick={onDelete}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 5, borderRadius: 6, display: 'flex', alignItems: 'center' }}
          title="Excluir"
        >
          <Trash2 size={13} />
        </button>
      </div>
    );
  }

  const q = search.toLowerCase();

  function renderTable() {
    if (tab === 'categorias') {
      const rows = categorias.filter(r => r.nome.toLowerCase().includes(q) || r.codigoInterno.toLowerCase().includes(q));
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Nome', 'Código', 'Descrição', 'Status', ''].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={tdSt}><strong>{r.nome}</strong></td>
                <td style={tdSt}><span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{r.codigoInterno}</span></td>
                <td style={{ ...tdSt, color: 'var(--text-secondary)' }}>{r.descricao}</td>
                <td style={tdSt}><StatusBadge status={r.status} /></td>
                <td style={{ ...tdSt, textAlign: 'right' }}><RowActions onDelete={() => handleDelete(r.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === 'tipos') {
      const rows = tipos.filter(r => r.nome.toLowerCase().includes(q));
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Nome', 'Prazo (meses)', 'Req. Aditivo', 'Status', ''].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={tdSt}><strong>{r.nome}</strong></td>
                <td style={tdSt}>{r.prazoMeses}</td>
                <td style={tdSt}>{r.requerAditivo ? <span style={{ color: '#10b981' }}>✓ Sim</span> : <span style={{ color: 'var(--text-muted)' }}>Não</span>}</td>
                <td style={tdSt}><StatusBadge status={r.status} /></td>
                <td style={{ ...tdSt, textAlign: 'right' }}><RowActions onDelete={() => handleDelete(r.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === 'centros') {
      const rows = centros.filter(r => r.codigo.toLowerCase().includes(q) || r.descricao.toLowerCase().includes(q));
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Código', 'Descrição', 'Responsável', 'Unidade', 'Status', ''].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={tdSt}><span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{r.codigo}</span></td>
                <td style={tdSt}><strong>{r.descricao}</strong></td>
                <td style={{ ...tdSt, color: 'var(--text-secondary)' }}>{r.responsavel}</td>
                <td style={{ ...tdSt, color: 'var(--text-secondary)' }}>{r.unidade}</td>
                <td style={tdSt}><StatusBadge status={r.status} /></td>
                <td style={{ ...tdSt, textAlign: 'right' }}><RowActions onDelete={() => handleDelete(r.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === 'responsaveis') {
      const rows = responsaveis.filter(r => r.nomeCompleto.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Nome', 'Cargo', 'E-mail', 'Unidade', 'Status', ''].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={tdSt}><strong>{r.nomeCompleto}</strong></td>
                <td style={{ ...tdSt, color: 'var(--text-secondary)' }}>{r.cargo}</td>
                <td style={{ ...tdSt, color: '#2563eb' }}>{r.email}</td>
                <td style={{ ...tdSt, color: 'var(--text-secondary)' }}>{r.unidade}</td>
                <td style={tdSt}><StatusBadge status={r.status} /></td>
                <td style={{ ...tdSt, textAlign: 'right' }}><RowActions onDelete={() => handleDelete(r.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === 'indices') {
      const rows = indices.filter(r => r.nome.toLowerCase().includes(q));
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Nome', '% Atual', 'Fonte', 'Atualização', 'Status', ''].map(h => <th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                <td style={tdSt}><strong style={{ color: '#2563eb' }}>{r.nome}</strong></td>
                <td style={tdSt}><span style={{ fontSize: 15, fontWeight: 700, color: '#10b981' }}>{r.percentualAtual.toFixed(2)}%</span></td>
                <td style={{ ...tdSt, color: 'var(--text-secondary)' }}>{r.fonte}</td>
                <td style={{ ...tdSt, color: 'var(--text-secondary)' }}>{new Date(r.dataAtualizacao).toLocaleDateString('pt-BR')}</td>
                <td style={tdSt}><StatusBadge status={r.status} /></td>
                <td style={{ ...tdSt, textAlign: 'right' }}><RowActions onDelete={() => handleDelete(r.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }

  function renderModal() {
    if (!modal) return null;
    const title = `Novo ${TABS.find(t => t.id === tab)?.label ?? 'Cadastro'}`;

    if (tab === 'categorias') return (
      <Modal title={title} onClose={() => setModal(false)}>
        <Field label="Nome *"><input style={inputSt} value={catForm.nome} onChange={e => setCatForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Limpeza" /></Field>
        <Field label="Código Interno"><input style={inputSt} value={catForm.codigoInterno} onChange={e => setCatForm(p => ({ ...p, codigoInterno: e.target.value }))} placeholder="Ex: LMP" /></Field>
        <Field label="Descrição"><input style={inputSt} value={catForm.descricao} onChange={e => setCatForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Descrição da categoria" /></Field>
        <Field label="Status">
          <select style={inputSt} value={catForm.status} onChange={e => setCatForm(p => ({ ...p, status: e.target.value as Categoria['status'] }))}>
            <option value="ativa">Ativa</option><option value="inativa">Inativa</option>
          </select>
        </Field>
        <FormActions onCancel={() => setModal(false)} onSave={handleSave} />
      </Modal>
    );

    if (tab === 'tipos') return (
      <Modal title={title} onClose={() => setModal(false)}>
        <Field label="Nome *"><input style={inputSt} value={tipoForm.nome} onChange={e => setTipoForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Prestação de Serviços" /></Field>
        <Field label="Prazo Padrão (meses)"><input style={inputSt} type="number" value={tipoForm.prazoMeses} onChange={e => setTipoForm(p => ({ ...p, prazoMeses: +e.target.value }))} /></Field>
        <Field label="Requer Aditivo para Renovação">
          <select style={inputSt} value={tipoForm.requerAditivo ? 'sim' : 'nao'} onChange={e => setTipoForm(p => ({ ...p, requerAditivo: e.target.value === 'sim' }))}>
            <option value="sim">Sim</option><option value="nao">Não</option>
          </select>
        </Field>
        <Field label="Status">
          <select style={inputSt} value={tipoForm.status} onChange={e => setTipoForm(p => ({ ...p, status: e.target.value as TipoContrato['status'] }))}>
            <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
          </select>
        </Field>
        <FormActions onCancel={() => setModal(false)} onSave={handleSave} />
      </Modal>
    );

    if (tab === 'centros') return (
      <Modal title={title} onClose={() => setModal(false)}>
        <Field label="Código *"><input style={inputSt} value={centroForm.codigo} onChange={e => setCentroForm(p => ({ ...p, codigo: e.target.value }))} placeholder="Ex: CC-001" /></Field>
        <Field label="Descrição *"><input style={inputSt} value={centroForm.descricao} onChange={e => setCentroForm(p => ({ ...p, descricao: e.target.value }))} placeholder="Ex: Administrativo Matriz" /></Field>
        <Field label="Responsável"><input style={inputSt} value={centroForm.responsavel} onChange={e => setCentroForm(p => ({ ...p, responsavel: e.target.value }))} /></Field>
        <Field label="Unidade"><input style={inputSt} value={centroForm.unidade} onChange={e => setCentroForm(p => ({ ...p, unidade: e.target.value }))} placeholder="Ex: Matriz SP" /></Field>
        <Field label="Status">
          <select style={inputSt} value={centroForm.status} onChange={e => setCentroForm(p => ({ ...p, status: e.target.value as CentroCusto['status'] }))}>
            <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
          </select>
        </Field>
        <FormActions onCancel={() => setModal(false)} onSave={handleSave} />
      </Modal>
    );

    if (tab === 'responsaveis') return (
      <Modal title={title} onClose={() => setModal(false)}>
        <Field label="Nome Completo *"><input style={inputSt} value={respForm.nomeCompleto} onChange={e => setRespForm(p => ({ ...p, nomeCompleto: e.target.value }))} /></Field>
        <Field label="Cargo / Função"><input style={inputSt} value={respForm.cargo} onChange={e => setRespForm(p => ({ ...p, cargo: e.target.value }))} /></Field>
        <Field label="E-mail"><input style={inputSt} type="email" value={respForm.email} onChange={e => setRespForm(p => ({ ...p, email: e.target.value }))} /></Field>
        <Field label="Telefone"><input style={inputSt} value={respForm.telefone} onChange={e => setRespForm(p => ({ ...p, telefone: e.target.value }))} placeholder="(00) 00000-0000" /></Field>
        <Field label="Unidade"><input style={inputSt} value={respForm.unidade} onChange={e => setRespForm(p => ({ ...p, unidade: e.target.value }))} /></Field>
        <Field label="Status">
          <select style={inputSt} value={respForm.status} onChange={e => setRespForm(p => ({ ...p, status: e.target.value as Responsavel['status'] }))}>
            <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
          </select>
        </Field>
        <FormActions onCancel={() => setModal(false)} onSave={handleSave} />
      </Modal>
    );

    if (tab === 'indices') return (
      <Modal title={title} onClose={() => setModal(false)}>
        <Field label="Nome *"><input style={inputSt} value={idxForm.nome} onChange={e => setIdxForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: IPCA" /></Field>
        <Field label="Percentual Atual (%)"><input style={inputSt} type="number" step="0.01" value={idxForm.percentualAtual} onChange={e => setIdxForm(p => ({ ...p, percentualAtual: +e.target.value }))} /></Field>
        <Field label="Fonte"><input style={inputSt} value={idxForm.fonte} onChange={e => setIdxForm(p => ({ ...p, fonte: e.target.value }))} placeholder="Ex: IBGE, FGV" /></Field>
        <Field label="Data de Atualização"><input style={inputSt} type="date" value={idxForm.dataAtualizacao} onChange={e => setIdxForm(p => ({ ...p, dataAtualizacao: e.target.value }))} /></Field>
        <Field label="Status">
          <select style={inputSt} value={idxForm.status} onChange={e => setIdxForm(p => ({ ...p, status: e.target.value as IndiceReajuste['status'] }))}>
            <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
          </select>
        </Field>
        <FormActions onCancel={() => setModal(false)} onSave={handleSave} />
      </Modal>
    );

    return null;
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: 'var(--text-primary)' }}>

      {/* Cabeçalho */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>Cadastros</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Gerencie as tabelas auxiliares do sistema</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSearch(''); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 16px', borderRadius: 8, border: '1px solid',
                borderColor: active ? '#2563eb' : 'var(--border)',
                background: active ? 'rgba(37,99,235,0.10)' : 'transparent',
                color: active ? '#2563eb' : 'var(--text-secondary)',
                fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: 'pointer', transition: 'all .15s', fontFamily: 'inherit',
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Barra de ações */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            style={{ ...inputSt, paddingLeft: 36 }}
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <Plus size={14} /> Novo Cadastro
        </button>
      </div>

      {/* Tabela */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {renderTable()}
        </div>
      </div>

      {renderModal()}
    </div>
  );
}
