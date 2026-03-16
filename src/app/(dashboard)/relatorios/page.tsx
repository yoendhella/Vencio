'use client';

import { useState } from 'react';
import { BarChart2, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';

const RELATORIOS = [
  {
    id: 'contratos_ativos',
    titulo: 'Contratos Ativos',
    descricao: 'Lista completa com valores e vencimentos',
    colunas: ['Número', 'Contrato', 'Fornecedor', 'Valor/Mês', 'Vencimento', 'Índice', 'Situação'],
    dados: [
      { Número: 'CTR-2024-001', Contrato: 'Limpeza Predial - Sede',    Fornecedor: 'CleanPro LTDA',        'Valor/Mês': 'R$ 10.000,00', Vencimento: '21/03/2026', Índice: 'IPCA',  Situação: 'ativo' },
      { Número: 'CTR-2024-002', Contrato: 'Manutenção Predial',         Fornecedor: 'TechBuild Engenharia', 'Valor/Mês': 'R$ 20.000,00', Vencimento: '26/03/2026', Índice: 'INPC',  Situação: 'ativo' },
      { Número: 'CTR-2024-003', Contrato: 'Segurança Patrimonial',      Fornecedor: 'VigiMax Segurança',    'Valor/Mês': 'R$ 15.000,00', Vencimento: '28/03/2026', Índice: 'IPCA',  Situação: 'ativo' },
      { Número: 'CTR-2024-004', Contrato: 'Suporte TI - Help Desk',     Fornecedor: 'SupportTech Brasil',   'Valor/Mês': 'R$ 30.000,00', Vencimento: '02/06/2026', Índice: 'IGP-M', Situação: 'ativo' },
      { Número: 'CTR-2024-005', Contrato: 'Gestão RH - Terceirizado',   Fornecedor: 'PeopleFirst Gestão',   'Valor/Mês': 'R$ 12.000,00', Vencimento: '02/07/2026', Índice: 'IPCA',  Situação: 'ativo' },
    ],
  },
  {
    id: 'reajustes_aprovados',
    titulo: 'Reajustes Aprovados',
    descricao: 'Histórico de reajustes e impacto financeiro',
    colunas: ['Contrato', 'Índice', 'Percentual', 'Valor Anterior', 'Valor Novo', 'Vigência', 'Aprovado por'],
    dados: [
      { Contrato: 'CTR-2024-005', Índice: 'IPCA',  Percentual: '4,62%', 'Valor Anterior': 'R$ 12.000,00', 'Valor Novo': 'R$ 12.554,00', Vigência: '14/09/2025', 'Aprovado por': 'Financeiro' },
      { Contrato: 'CTR-2024-004', Índice: 'IGP-M', Percentual: '6,54%', 'Valor Anterior': 'R$ 30.000,00', 'Valor Novo': 'R$ 31.962,00', Vigência: '14/12/2025', 'Aprovado por': 'Financeiro' },
    ],
  },
  {
    id: 'certidoes_vencidas',
    titulo: 'Certidões Vencidas',
    descricao: 'Certidões expiradas por fornecedor',
    colunas: ['Fornecedor', 'Tipo de Certidão', 'Validade', 'Status', 'Risco'],
    dados: [
      { Fornecedor: 'CleanPro LTDA',       'Tipo de Certidão': 'Receita Federal', Validade: '27/02/2026', Status: 'VENCIDA', Risco: 'RISCO FISCAL' },
      { Fornecedor: 'VigiMax Segurança',   'Tipo de Certidão': 'FGTS',            Validade: '09/03/2026', Status: 'VENCIDA', Risco: 'RISCO TRABALHISTA' },
      { Fornecedor: 'TechBuild Engenharia','Tipo de Certidão': 'Trabalhista',      Validade: '29/03/2026', Status: 'ATENÇÃO', Risco: '30 DIAS' },
    ],
  },
  {
    id: 'aditivos_contratuais',
    titulo: 'Aditivos Contratuais',
    descricao: 'Todos os aditivos registrados',
    colunas: ['Nº Aditivo', 'Contrato', 'Tipo', 'Data', 'Novo Valor', 'Nova Vigência', 'Status'],
    dados: [
      { 'Nº Aditivo': 'ADT-001/2024', Contrato: 'CTR-2024-001', Tipo: 'valor',       Data: '14/09/2025', 'Novo Valor': 'R$ 11.000,00', 'Nova Vigência': '—',          Status: 'aprovado' },
      { 'Nº Aditivo': 'ADT-002/2024', Contrato: 'CTR-2024-002', Tipo: 'prazo',       Data: '14/12/2025', 'Novo Valor': '—',            'Nova Vigência': '12/06/2026', Status: 'aprovado' },
      { 'Nº Aditivo': 'ADT-003/2024', Contrato: 'CTR-2024-004', Tipo: 'valor',       Data: '04/03/2026', 'Novo Valor': 'R$ 32.000,00', 'Nova Vigência': '—',          Status: 'em análise' },
      { 'Nº Aditivo': 'ADT-004/2024', Contrato: 'CTR-2024-005', Tipo: 'valor+prazo', Data: '09/03/2026', 'Novo Valor': 'R$ 13.500,00', 'Nova Vigência': '14/09/2026', Status: 'em análise' },
    ],
  },
  {
    id: 'fornecedores_avaliacoes',
    titulo: 'Fornecedores e Avaliações',
    descricao: 'Notas e métricas de qualidade',
    colunas: ['Fornecedor', 'CNPJ', 'Categoria', 'Qualidade', 'Prazo', 'Comunicação', 'Conformidade', 'Nota Média'],
    dados: [
      { Fornecedor: 'CleanPro LTDA',        CNPJ: '11.111.111/0001-11', Categoria: 'Limpeza',    Qualidade: '5', Prazo: '4', Comunicação: '4', Conformidade: '4', 'Nota Média': '4.3/5' },
      { Fornecedor: 'TechBuild Engenharia', CNPJ: '22.222.222/0001-22', Categoria: 'Manutenção', Qualidade: '5', Prazo: '5', Comunicação: '5', Conformidade: '5', 'Nota Média': '4.8/5' },
      { Fornecedor: 'VigiMax Segurança',    CNPJ: '33.333.333/0001-33', Categoria: 'Segurança',  Qualidade: '4', Prazo: '4', Comunicação: '3', Conformidade: '4', 'Nota Média': '3.9/5' },
    ],
  },
  {
    id: 'log_auditoria',
    titulo: 'Log de Auditoria',
    descricao: 'Histórico completo de ações',
    colunas: ['Data', 'Usuário', 'Ação', 'Entidade', 'Detalhes'],
    dados: [
      { Data: '15/03/2026 09:14', Usuário: 'admin@empresa.com.br', Ação: 'CRIOU',    Entidade: 'contrato',    Detalhes: 'CTR-2024-001 - Limpeza Predial' },
      { Data: '14/03/2026 14:32', Usuário: 'financeiro@empresa.com.br', Ação: 'APROVOU', Entidade: 'reajuste', Detalhes: 'IPCA 4.62% - CTR-2024-005' },
      { Data: '13/03/2026 11:05', Usuário: 'carlos@empresa.com.br',  Ação: 'EDITOU',  Entidade: 'fornecedor', Detalhes: 'TechBuild Engenharia' },
    ],
  },
] as const;

type Relatorio = typeof RELATORIOS[number];

export default function RelatoriosPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleExcel(rel: Relatorio) {
    setLoading(rel.id + '_excel');
    try {
      exportToExcel([...rel.dados], rel.id);
    } finally {
      setLoading(null);
    }
  }

  async function handlePDF(rel: Relatorio) {
    setLoading(rel.id + '_pdf');
    try {
      const rows = (rel.dados as Record<string, string>[]).map((d) =>
        (rel.colunas as readonly string[]).map((c) => String(d[c] ?? ''))
      );
      await exportToPDF({
        columns: [...rel.colunas],
        rows,
        title: rel.titulo,
        filename: rel.id,
      });
    } finally {
      setLoading(null);
    }
  }

  const btnStyle = (color: string): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 8,
    border: `1px solid ${color}55`, background: `${color}15`,
    color, fontSize: 12.5, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Relatórios</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Exportação de dados em Excel e PDF</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {RELATORIOS.map((rel) => (
          <div
            key={rel.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(28,63,170,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BarChart2 size={20} color="#1C3FAA" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{rel.titulo}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{rel.descricao} — {rel.dados.length} registros</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => handleExcel(rel)}
                disabled={loading === rel.id + '_excel'}
                style={btnStyle('#10b981')}
              >
                <FileSpreadsheet size={13} />
                {loading === rel.id + '_excel' ? 'Gerando...' : 'Excel'}
              </button>
              <button
                onClick={() => handlePDF(rel)}
                disabled={loading === rel.id + '_pdf'}
                style={btnStyle('#ef4444')}
              >
                <FileText size={13} />
                {loading === rel.id + '_pdf' ? 'Gerando...' : 'PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
