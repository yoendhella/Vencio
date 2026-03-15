'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, FileDown, Loader2 } from 'lucide-react';
import { exportToExcel, exportToCSV, exportToPDF, type ExportColumn } from '@/lib/exportUtils';

interface ExportButtonsProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ExportColumn[];
  filename: string;
  title?: string;
  formats?: ('excel' | 'pdf' | 'csv')[];
  className?: string;
}

export function ExportButtons<T extends Record<string, unknown>>({
  data,
  columns,
  filename,
  title,
  formats = ['excel', 'pdf', 'csv'],
  className = '',
}: ExportButtonsProps<T>) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExcel = () => {
    setLoading('excel');
    try {
      exportToExcel(data, columns, filename);
    } finally {
      setLoading(null);
    }
  };

  const handleCSV = () => {
    setLoading('csv');
    try {
      exportToCSV(data, columns, filename);
    } finally {
      setLoading(null);
    }
  };

  const handlePDF = async () => {
    setLoading('pdf');
    try {
      await exportToPDF(data, columns, filename, title ?? filename);
    } finally {
      setLoading(null);
    }
  };

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    transition: 'all 0.15s',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {formats.includes('excel') && (
        <button
          onClick={handleExcel}
          disabled={loading !== null || data.length === 0}
          style={btnBase}
          title="Exportar Excel"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = '#10b981';
            (e.currentTarget as HTMLElement).style.color = '#10b981';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
        >
          {loading === 'excel' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <FileSpreadsheet size={13} />
          )}
          Excel
        </button>
      )}

      {formats.includes('pdf') && (
        <button
          onClick={handlePDF}
          disabled={loading !== null || data.length === 0}
          style={btnBase}
          title="Exportar PDF"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
        >
          {loading === 'pdf' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <FileText size={13} />
          )}
          PDF
        </button>
      )}

      {formats.includes('csv') && (
        <button
          onClick={handleCSV}
          disabled={loading !== null || data.length === 0}
          style={btnBase}
          title="Exportar CSV"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(37,99,235,0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = '#2563eb';
            (e.currentTarget as HTMLElement).style.color = '#2563eb';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
          }}
        >
          {loading === 'csv' ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <FileDown size={13} />
          )}
          CSV
        </button>
      )}
    </div>
  );
}

export default ExportButtons;
