import * as XLSX from 'xlsx';

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: unknown) => string;
}

// ── EXCEL EXPORT ──────────────────────────────────────────────
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
) {
  const rows = data.map((item) => {
    const row: Record<string, string> = {};
    for (const col of columns) {
      const value = item[col.key];
      row[col.label] = col.format ? col.format(value) : String(value ?? '');
    }
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');

  // Auto column width
  const colWidths = columns.map((col) => ({
    wch: Math.max(
      col.label.length,
      ...rows.map((r) => String(r[col.label] ?? '').length)
    ) + 2,
  }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ── PDF EXPORT ────────────────────────────────────────────────
export async function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string,
  title: string
) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Header
  doc.setFillColor(13, 27, 62);
  doc.rect(0, 0, 297, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 13);

  // Date
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const now = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  doc.text(`Gerado em: ${now}`, 280, 13, { align: 'right' });

  // Table
  const head = [columns.map((c) => c.label)];
  const body = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      return col.format ? col.format(value) : String(value ?? '');
    })
  );

  autoTable(doc, {
    head,
    body,
    startY: 24,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}

// ── CSV EXPORT ────────────────────────────────────────────────
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[],
  filename: string
) {
  const header = columns.map((c) => `"${c.label}"`).join(';');
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const value = item[col.key];
        const str = col.format ? col.format(value) : String(value ?? '');
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(';')
  );

  const bom = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const csv = bom + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
