'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { exportToExcel, exportToPDF, type PdfOptions } from '@/lib/exportUtils';

interface ExportButtonsProps {
  /** Dados para Excel (array de objetos) */
  data: Record<string, unknown>[];
  /** Nome base do arquivo */
  filename: string;
  /** Título do relatório PDF */
  pdfTitle: string;
  /** Cabeçalhos das colunas do PDF */
  columns: string[];
  /** Linhas da tabela do PDF */
  rows: (string | number)[][];
  /** Filtros ativos (exibidos no PDF) */
  filters?: string;
  /** Nome da aba do Excel */
  sheetName?: string;
  /** Orientação do PDF */
  pdfOrientation?: 'portrait' | 'landscape';
  /** Desabilitar botões */
  disabled?: boolean;
}

export function ExportButtons({
  data,
  filename,
  pdfTitle,
  columns,
  rows,
  filters,
  sheetName,
  pdfOrientation = 'landscape',
  disabled = false,
}: ExportButtonsProps) {
  const [loadingXls, setLoadingXls] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  async function handleExcel() {
    if (disabled || !data.length) return;
    setLoadingXls(true);
    try {
      exportToExcel(data, filename, sheetName);
    } finally {
      setLoadingXls(false);
    }
  }

  async function handlePdf() {
    if (disabled || !rows.length) return;
    setLoadingPdf(true);
    try {
      await exportToPDF({ columns, rows, title: pdfTitle, filename, filters, orientation: pdfOrientation });
    } finally {
      setLoadingPdf(false);
    }
  }

  const base: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 8,
    fontSize: 12.5, fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all .15s',
    fontFamily: 'inherit',
    border: '1px solid',
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={handleExcel}
        disabled={disabled || loadingXls}
        title="Exportar para Excel (.xlsx)"
        style={{
          ...base,
          background: 'rgba(16,185,129,0.10)',
          borderColor: 'rgba(16,185,129,0.35)',
          color: '#10b981',
        }}
      >
        {loadingXls
          ? <Loader2 size={13} className="animate-spin" />
          : <FileSpreadsheet size={13} />
        }
        Excel
      </button>

      <button
        onClick={handlePdf}
        disabled={disabled || loadingPdf}
        title="Exportar para PDF"
        style={{
          ...base,
          background: 'rgba(239,68,68,0.10)',
          borderColor: 'rgba(239,68,68,0.35)',
          color: '#ef4444',
        }}
      >
        {loadingPdf
          ? <Loader2 size={13} className="animate-spin" />
          : <FileText size={13} />
        }
        PDF
      </button>
    </div>
  );
}

export default ExportButtons;
