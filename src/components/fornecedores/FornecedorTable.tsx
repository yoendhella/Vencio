'use client';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { FilterBar } from '@/components/layout/FilterBar';
import { ExportButtons } from '@/components/ui/ExportButtons';

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

export function FornecedorTable() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    fetch(`/api/fornecedores?${params}`).then((r) => r.json()).then((d) => setFornecedores(d.data ?? []));
  }, [search]);

  return (
    <>
      <FilterBar search={search} onSearch={setSearch}>
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
    </>
  );
}
