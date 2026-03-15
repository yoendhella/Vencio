'use client';

import { useState } from 'react';
import { Building2, Plus, Search, Edit2, Trash2, X, Check, MapPin, User } from 'lucide-react';
import { ExportButtons } from '@/components/ui/ExportButtons';

export interface Unidade {
  id: string;
  nome: string;
  tipo: 'matriz' | 'filial';
  cnpj: string;
  cep: string;
  rua: string;
  cidade: string;
  estado: string;
  responsavel: string;
  status: 'ativa' | 'inativa';
}

const mockUnidades: Unidade[] = [
  {
    id: '1', nome: 'Matriz São Paulo', tipo: 'matriz',
    cnpj: '12.345.678/0001-00', cep: '01310-100',
    rua: 'Av. Paulista, 1000', cidade: 'São Paulo', estado: 'SP',
    responsavel: 'Carlos Mendes', status: 'ativa',
  },
  {
    id: '2', nome: 'Filial Rio de Janeiro', tipo: 'filial',
    cnpj: '12.345.678/0002-81', cep: '20040-020',
    rua: 'Av. Rio Branco, 500', cidade: 'Rio de Janeiro', estado: 'RJ',
    responsavel: 'Ana Lima', status: 'ativa',
  },
  {
    id: '3', nome: 'Filial Belo Horizonte', tipo: 'filial',
    cnpj: '12.345.678/0003-62', cep: '30140-110',
    rua: 'Av. Afonso Pena, 200', cidade: 'Belo Horizonte', estado: 'MG',
    responsavel: 'Pedro Alves', status: 'ativa',
  },
  {
    id: '4', nome: 'Filial Brasília', tipo: 'filial',
    cnpj: '12.345.678/0004-43', cep: '70040-010',
    rua: 'SCS Quadra 01, Bloco A', cidade: 'Brasília', estado: 'DF',
    responsavel: 'Mariana Costa', status: 'inativa',
  },
];

const emptyForm: Omit<Unidade, 'id'> = {
  nome: '', tipo: 'filial', cnpj: '', cep: '',
  rua: '', cidade: '', estado: '', responsavel: '', status: 'ativa',
};

function StatusBadge({ status }: { status: string }) {
  const isAtiva = status === 'ativa';
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 12,
      fontSize: 11, fontWeight: 600,
      background: isAtiva ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)',
      color: isAtiva ? '#10b981' : '#9ca3af',
      border: `1px solid ${isAtiva ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.3)'}`,
    }}>
      {isAtiva ? 'Ativa' : 'Inativa'}
    </span>
  );
}

function TipoBadge({ tipo }: { tipo: 'matriz' | 'filial' }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 12,
      fontSize: 11, fontWeight: 700,
      background: tipo === 'matriz' ? 'rgba(124,58,237,0.12)' : 'rgba(37,99,235,0.1)',
      color: tipo === 'matriz' ? '#a78bfa' : '#60a5fa',
      border: `1px solid ${tipo === 'matriz' ? 'rgba(124,58,237,0.3)' : 'rgba(37,99,235,0.25)'}`,
    }}>
      {tipo === 'matriz' ? 'MATRIZ' : 'FILIAL'}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        display: 'block', fontSize: 10.5, fontWeight: 700,
        letterSpacing: '0.8px', textTransform: 'uppercase',
        color: 'var(--text-muted)', marginBottom: 5,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 13px',
  background: 'var(--bg)',
  border: '1.5px solid var(--border)',
  borderRadius: 8, fontSize: 13,
  color: 'var(--text-primary)',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
};

const PDF_COLS = ['Unidade', 'Tipo', 'CNPJ', 'CEP', 'Endereço', 'Cidade', 'UF', 'Responsável', 'Status'];

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState<Unidade[]>(mockUnidades);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Unidade | null>(null);
  const [form, setForm] = useState<Omit<Unidade, 'id'>>(emptyForm);

  const filtered = unidades.filter((u) =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.cidade.toLowerCase().includes(search.toLowerCase()) ||
    u.cnpj.includes(search)
  );

  const openNew = () => { setEditing(null); setForm(emptyForm); setModal(true); };
  const openEdit = (u: Unidade) => {
    setEditing(u);
    setForm({ nome: u.nome, tipo: u.tipo, cnpj: u.cnpj, cep: u.cep, rua: u.rua, cidade: u.cidade, estado: u.estado, responsavel: u.responsavel, status: u.status });
    setModal(true);
  };

  const handleSave = () => {
    if (!form.nome.trim()) return;
    if (editing) {
      setUnidades((p) => p.map((u) => u.id === editing.id ? { ...u, ...form } : u));
    } else {
      setUnidades((p) => [...p, { id: Date.now().toString(), ...form }]);
    }
    setModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja remover esta unidade?')) {
      setUnidades((p) => p.filter((u) => u.id !== id));
    }
  };

  const stats = {
    total: unidades.length,
    ativas: unidades.filter((u) => u.status === 'ativa').length,
    filiais: unidades.filter((u) => u.tipo === 'filial').length,
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Unidades do Grupo
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Gerencie a Matriz e as Filiais do grupo empresarial
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total de Unidades', value: stats.total, color: '#2563eb' },
          { label: 'Unidades Ativas',   value: stats.ativas,  color: '#10b981' },
          { label: 'Filiais',           value: stats.filiais, color: '#38bdf8' },
        ].map((c) => (
          <div key={c.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '16px 18px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.color, borderRadius: '12px 12px 0 0' }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Barra de ações */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            style={{ ...inputStyle, paddingLeft: 36 }}
            placeholder="Buscar por nome, cidade ou CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ExportButtons
            data={filtered.map((u) => ({
              Unidade: u.nome, Tipo: u.tipo, CNPJ: u.cnpj, CEP: u.cep,
              Endereço: u.rua, Cidade: u.cidade, UF: u.estado,
              Responsável: u.responsavel, Status: u.status,
            }))}
            filename="unidades"
            pdfTitle="Unidades do Grupo"
            columns={PDF_COLS}
            rows={filtered.map((u) => [u.nome, u.tipo, u.cnpj, u.cep, u.rua, u.cidade, u.estado, u.responsavel, u.status])}
          />
          <button
            onClick={openNew}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)',
              color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Nova Unidade
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Unidade', 'Tipo', 'CNPJ', 'Localização', 'Responsável', 'Status', ''].map((h) => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase',
                  color: 'var(--text-muted)', borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-hover)',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhuma unidade encontrada
                </td>
              </tr>
            ) : filtered.map((u, i) => (
              <tr
                key={u.id}
                style={{ background: i % 2 !== 0 ? 'var(--surface-hover)' : 'transparent', transition: 'background 0.1s' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--surface-hover)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = i % 2 !== 0 ? 'var(--surface-hover)' : 'transparent'}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: u.tipo === 'matriz' ? 'rgba(124,58,237,0.12)' : 'rgba(37,99,235,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Building2 size={15} color={u.tipo === 'matriz' ? '#a78bfa' : '#60a5fa'} />
                    </div>
                    <strong style={{ color: 'var(--text-primary)' }}>{u.nome}</strong>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><TipoBadge tipo={u.tipo} /></td>
                <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: '#60a5fa' }}>{u.cnpj}</td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={11} /> {u.cidade}/{u.estado}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <User size={11} /> {u.responsavel}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}><StatusBadge status={u.status} /></td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => openEdit(u)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6, display: 'flex' }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#2563eb'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 6, borderRadius: 6, display: 'flex' }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModal(false); }}
        >
          <div style={{
            background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)',
            width: '100%', maxWidth: 580, padding: '28px 32px',
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                {editing ? 'Editar Unidade' : 'Nova Unidade'}
              </h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Nome da Unidade *">
                  <input style={inputStyle} value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} placeholder="Ex: Filial Rio de Janeiro" />
                </Field>
              </div>
              <Field label="Tipo *">
                <select style={inputStyle} value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as 'matriz' | 'filial' }))}>
                  <option value="matriz">Matriz</option>
                  <option value="filial">Filial</option>
                </select>
              </Field>
              <Field label="CNPJ">
                <input style={inputStyle} value={form.cnpj} onChange={(e) => setForm((p) => ({ ...p, cnpj: e.target.value }))} placeholder="00.000.000/0000-00" />
              </Field>
              <Field label="CEP">
                <input style={inputStyle} value={form.cep} onChange={(e) => setForm((p) => ({ ...p, cep: e.target.value }))} placeholder="00000-000" />
              </Field>
              <Field label="Status">
                <select style={inputStyle} value={form.status} onChange={(e) => setForm((p => ({ ...p, status: e.target.value as 'ativa' | 'inativa' })))}>
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Rua / Logradouro">
                  <input style={inputStyle} value={form.rua} onChange={(e) => setForm((p) => ({ ...p, rua: e.target.value }))} placeholder="Av. Paulista, 1000" />
                </Field>
              </div>
              <Field label="Cidade">
                <input style={inputStyle} value={form.cidade} onChange={(e) => setForm((p) => ({ ...p, cidade: e.target.value }))} placeholder="São Paulo" />
              </Field>
              <Field label="Estado (UF)">
                <input style={inputStyle} value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value.toUpperCase() }))} placeholder="SP" maxLength={2} />
              </Field>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="Responsável Local">
                  <input style={inputStyle} value={form.responsavel} onChange={(e) => setForm((p) => ({ ...p, responsavel: e.target.value }))} placeholder="Nome do responsável" />
                </Field>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setModal(false)} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.nome.trim()}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', opacity: !form.nome.trim() ? 0.5 : 1 }}
              >
                <Check size={14} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
