'use client';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { FilterBar } from '@/components/layout/FilterBar';
import { ExportButtons } from '@/components/ui/ExportButtons';
import { Plus, X, Check } from 'lucide-react';

interface Fornecedor {
  id: string; razaoSocial: string; cnpj: string; categoria: string;
  notaQualidade: string | null; notaPrazo: string | null;
  notaComunicacao: string | null; notaConformidade: string | null;
  totalOcorrencias: number; ativo: boolean;
}

const COLORS = ['#1C3FAA', '#16A34A', '#D97706', '#DC2626', '#7C3AED', '#0369A1'];

function Stars({ value }: { value: number }) {
  return (
    <span className="text-yellow-500 text-sm">
      {Array.from({ length: 5 }, (_, i) => i < Math.round(value) ? '★' : '☆').join('')}
    </span>
  );
}

const EMPTY_FORM = { razaoSocial: '', nomeFantasia: '', cnpj: '', categoria: '', contatoNome: '', contatoEmail: '', contatoTel: '', unidade: '', status: 'ativo' };

const inp: React.CSSProperties = { width: '100%', padding: '9px 13px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 12 };
const lbl: React.CSSProperties = { display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5 };

export function FornecedorTable() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [search, setSearch] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    fetch(`/api/fornecedores?${params}`).then((r) => r.json()).then((d) => setFornecedores(d.data ?? []));
  }, [search]);

  return (
    <>
      <FilterBar search={search} onSearch={setSearch}>
        <button
          onClick={() => { setForm(EMPTY_FORM); setModalAberto(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
        >
          <Plus size={14} /> Novo Fornecedor
        </button>
        <ExportButtons
          data={fornecedores.map((f) => ({
            'Razão Social': f.razaoSocial,
            CNPJ: f.cnpj,
            Categoria: f.categoria,
            Qualidade: f.notaQualidade ?? '',
            Prazo: f.notaPrazo ?? '',
            Comunicação: f.notaComunicacao ?? '',
            Conformidade: f.notaConformidade ?? '',
            Ocorrências: f.totalOcorrencias,
            Status: f.ativo ? 'Ativo' : 'Inativo',
          }))}
          filename="fornecedores"
          pdfTitle="Relatório de Fornecedores"
          columns={['Razão Social', 'CNPJ', 'Categoria', 'Qualidade', 'Prazo', 'Comunicação', 'Conformidade', 'Ocorrências', 'Status']}
          rows={fornecedores.map((f) => [f.razaoSocial, f.cnpj, f.categoria, f.notaQualidade ?? '', f.notaPrazo ?? '', f.notaComunicacao ?? '', f.notaConformidade ?? '', f.totalOcorrencias, f.ativo ? 'Ativo' : 'Inativo'])}
        />
      </FilterBar>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {fornecedores.map((f, i) => {
          const initials = f.razaoSocial.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
          const notas = [f.notaQualidade, f.notaPrazo, f.notaComunicacao, f.notaConformidade].map(Number);
          const media = notas.reduce((s, n) => s + n, 0) / notas.filter((n) => n > 0).length || 0;
          return (
            <div key={f.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{f.razaoSocial}</p>
                  <p className="text-xs text-gray-500">{f.cnpj}</p>
                  <Badge variant="info" className="mt-1">{f.categoria}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div><p className="text-gray-500">Qualidade</p><Stars value={Number(f.notaQualidade ?? 0)} /></div>
                <div><p className="text-gray-500">Prazo</p><Stars value={Number(f.notaPrazo ?? 0)} /></div>
                <div><p className="text-gray-500">Comunicação</p><Stars value={Number(f.notaComunicacao ?? 0)} /></div>
                <div><p className="text-gray-500">Conformidade</p><Stars value={Number(f.notaConformidade ?? 0)} /></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Nota média</span>
                  <span className="font-medium">{media.toFixed(1)}/5</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(media / 5) * 100}%`, backgroundColor: media >= 4 ? '#16A34A' : media >= 3 ? '#D97706' : '#DC2626' }} />
                </div>
              </div>
              {f.totalOcorrencias > 0 && (
                <p className="text-xs text-red-600 mt-2">{f.totalOcorrencias} ocorrência(s) registrada(s)</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Novo Fornecedor */}
      {modalAberto && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalAberto(false); }}
        >
          <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)', width: '100%', maxWidth: 560, padding: '28px 32px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>Novo Fornecedor</h3>
              <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Razão Social *</label>
                <input value={form.razaoSocial} onChange={(e) => setForm((p) => ({ ...p, razaoSocial: e.target.value }))} style={inp} placeholder="Razão social do fornecedor" />
              </div>
              <div>
                <label style={lbl}>Nome Fantasia</label>
                <input value={form.nomeFantasia} onChange={(e) => setForm((p) => ({ ...p, nomeFantasia: e.target.value }))} style={inp} placeholder="Nome fantasia" />
              </div>
              <div>
                <label style={lbl}>CNPJ *</label>
                <input value={form.cnpj} onChange={(e) => setForm((p) => ({ ...p, cnpj: e.target.value }))} style={inp} placeholder="00.000.000/0000-00" />
              </div>
              <div>
                <label style={lbl}>Categoria</label>
                <input value={form.categoria} onChange={(e) => setForm((p) => ({ ...p, categoria: e.target.value }))} style={inp} placeholder="Ex: Limpeza, TI, Segurança" />
              </div>
              <div>
                <label style={lbl}>Nome do Contato</label>
                <input value={form.contatoNome} onChange={(e) => setForm((p) => ({ ...p, contatoNome: e.target.value }))} style={inp} placeholder="Nome do responsável" />
              </div>
              <div>
                <label style={lbl}>E-mail</label>
                <input type="email" value={form.contatoEmail} onChange={(e) => setForm((p) => ({ ...p, contatoEmail: e.target.value }))} style={inp} placeholder="email@fornecedor.com" />
              </div>
              <div>
                <label style={lbl}>Telefone</label>
                <input value={form.contatoTel} onChange={(e) => setForm((p) => ({ ...p, contatoTel: e.target.value }))} style={inp} placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label style={lbl}>Unidade Atendida</label>
                <input value={form.unidade} onChange={(e) => setForm((p) => ({ ...p, unidade: e.target.value }))} style={inp} placeholder="Ex: Matriz SP" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={lbl}>Status</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} style={inp}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="em_analise">Em análise</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setModalAberto(false)} style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancelar
              </button>
              <button
                disabled={!form.razaoSocial.trim() || !form.cnpj.trim()}
                onClick={async () => {
                  await fetch('/api/fornecedores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ razaoSocial: form.razaoSocial, cnpj: form.cnpj, categoria: form.categoria || 'Geral', nomeResponsavel: form.contatoNome, email: form.contatoEmail, telefone: form.contatoTel }) });
                  setModalAberto(false);
                  const params = new URLSearchParams();
                  if (search) params.set('q', search);
                  fetch(`/api/fornecedores?${params}`).then((r) => r.json()).then((d) => setFornecedores(d.data ?? []));
                }}
                style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(110deg,#1a4fa0,#0ea87a)', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', opacity: (!form.razaoSocial.trim() || !form.cnpj.trim()) ? 0.5 : 1 }}
              >
                <Check size={14} /> Salvar Fornecedor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
