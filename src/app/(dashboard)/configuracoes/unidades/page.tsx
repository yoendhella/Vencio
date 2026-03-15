'use client';

import { useState } from 'react';
import { Building2, Plus, Pencil, Trash2, Search, X, Check } from 'lucide-react';
import { ExportButtons } from '@/components/ui/ExportButtons';

interface Unidade {
  id: string;
  codigo: string;
  nome: string;
  cnpj: string;
  cidade: string;
  estado: string;
  responsavel: string;
  ativa: boolean;
}

const MOCK: Unidade[] = [
  { id: '1', codigo: 'MTZ', nome: 'Matriz São Paulo', cnpj: '00.000.000/0001-00', cidade: 'São Paulo', estado: 'SP', responsavel: 'Carlos Lima', ativa: true },
  { id: '2', codigo: 'FIL-RJ', nome: 'Filial Rio de Janeiro', cnpj: '00.000.000/0002-81', cidade: 'Rio de Janeiro', estado: 'RJ', responsavel: 'Ana Costa', ativa: true },
  { id: '3', codigo: 'FIL-MG', nome: 'Filial Belo Horizonte', cnpj: '00.000.000/0003-62', cidade: 'Belo Horizonte', estado: 'MG', responsavel: 'Pedro Souza', ativa: true },
  { id: '4', codigo: 'FIL-RS', nome: 'Filial Porto Alegre', cnpj: '00.000.000/0004-43', cidade: 'Porto Alegre', estado: 'RS', responsavel: 'Maria Silva', ativa: false },
];

const EXPORT_COLS = [
  { key: 'codigo', label: 'Código' },
  { key: 'nome', label: 'Nome da Unidade' },
  { key: 'cnpj', label: 'CNPJ' },
  { key: 'cidade', label: 'Cidade' },
  { key: 'estado', label: 'Estado' },
  { key: 'responsavel', label: 'Responsável' },
  { key: 'ativa', label: 'Status', format: (v: unknown) => v ? 'Ativa' : 'Inativa' },
];

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

interface FormData {
  codigo: string;
  nome: string;
  cnpj: string;
  cidade: string;
  estado: string;
  responsavel: string;
  ativa: boolean;
}

const EMPTY_FORM: FormData = {
  codigo: '', nome: '', cnpj: '', cidade: '', estado: 'SP', responsavel: '', ativa: true,
};

export default function UnidadesPage() {
  const [items, setItems] = useState<Unidade[]>(MOCK);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Unidade | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = items.filter((u) =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.codigo.toLowerCase().includes(search.toLowerCase()) ||
    u.cidade.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (u: Unidade) => {
    setEditing(u);
    setForm({ codigo: u.codigo, nome: u.nome, cnpj: u.cnpj, cidade: u.cidade, estado: u.estado, responsavel: u.responsavel, ativa: u.ativa });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.codigo.trim() || !form.nome.trim()) return;
    if (editing) {
      setItems((prev) => prev.map((u) => u.id === editing.id ? { ...u, ...form } : u));
    } else {
      setItems((prev) => [...prev, { ...form, id: String(Date.now()) }]);
    }
    setModalOpen(false);
  };

  const confirmDelete = (id: string) => setDeleteId(id);
  const doDelete = () => {
    if (deleteId) setItems((prev) => prev.filter((u) => u.id !== deleteId));
    setDeleteId(null);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text-primary)',
    fontSize: 13,
    outline: 'none',
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(37,99,235,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={20} color="#2563eb" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Unidades do Grupo
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {items.filter(u => u.ativa).length} unidades ativas · {items.filter(u => !u.ativa).length} inativas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons
            data={filtered as unknown as Record<string, unknown>[]}
            columns={EXPORT_COLS}
            filename="unidades"
            title="Unidades do Grupo"
          />
          <button
            onClick={openNew}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: '#2563eb', color: '#fff',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: 'none',
            }}
          >
            <Plus size={14} />
            Nova Unidade
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <Search size={15} color="var(--text-muted)" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, código ou cidade..."
          style={{
            flex: 1, border: 'none', background: 'transparent',
            fontSize: 13, color: 'var(--text-primary)', outline: 'none',
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
              {['Código', 'Unidade', 'CNPJ', 'Cidade/UF', 'Responsável', 'Status', 'Ações'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  Nenhuma unidade encontrada
                </td>
              </tr>
            ) : filtered.map((u, i) => (
              <tr
                key={u.id}
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border-muted)' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#2563eb', background: 'rgba(37,99,235,0.08)', padding: '2px 7px', borderRadius: 5 }}>
                    {u.codigo}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{u.nome}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 12 }}>{u.cnpj}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.cidade} / {u.estado}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.responsavel}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: u.ativa ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
                    color: u.ativa ? '#10b981' : '#6b7280',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {u.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openEdit(u)}
                      style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                    >
                      <Pencil size={11} /> Editar
                    </button>
                    <button
                      onClick={() => confirmDelete(u.id)}
                      style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid transparent', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                    >
                      <Trash2 size={11} /> Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Nova/Editar */}
      {modalOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div style={{
            width: 560, background: 'var(--surface)', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            border: '1px solid var(--border)', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                {editing ? 'Editar Unidade' : 'Nova Unidade'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Código *</label>
                  <input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase() })} placeholder="MTZ" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome da Unidade *</label>
                  <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Matriz São Paulo" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CNPJ</label>
                <input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} placeholder="00.000.000/0001-00" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cidade</label>
                  <input value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} placeholder="São Paulo" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</label>
                  <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} style={inputStyle}>
                    {ESTADOS.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Responsável</label>
                <input value={form.responsavel} onChange={(e) => setForm({ ...form, responsavel: e.target.value })} placeholder="Nome do responsável" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setForm({ ...form, ativa: !form.ativa })}
                  style={{
                    width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                    background: form.ativa ? '#10b981' : 'var(--border)',
                    transition: 'background 0.2s',
                    position: 'relative',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, left: form.ativa ? 21 : 3, width: 16, height: 16,
                    borderRadius: '50%', background: '#fff',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Unidade {form.ativa ? 'ativa' : 'inativa'}</span>
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setModalOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={!form.codigo.trim() || !form.nome.trim()}
                style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, opacity: (!form.codigo.trim() || !form.nome.trim()) ? 0.5 : 1 }}
              >
                <Check size={13} />
                {editing ? 'Salvar Alterações' : 'Criar Unidade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ width: 400, background: 'var(--surface)', borderRadius: 16, padding: 28, border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Trash2 size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Remover Unidade?</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Esta ação não pode ser desfeita. A unidade será removida permanentemente.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Cancelar
              </button>
              <button onClick={doDelete} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
