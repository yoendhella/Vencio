import * as XLSX from 'xlsx';

// ── EXCEL ─────────────────────────────────────────────────────────────────────
export function exportToExcel(
  data: Record<string, unknown>[],
  filename: string,
  sheetName = 'Dados'
) {
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto column width
  if (data.length > 0) {
    const keys = Object.keys(data[0]);
    ws['!cols'] = keys.map((k) => ({
      wch: Math.max(
        k.length,
        ...data.map((r) => String(r[k] ?? '').length)
      ) + 2,
    }));
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ── PDF ───────────────────────────────────────────────────────────────────────
export interface PdfOptions {
  title: string;
  filename: string;
  columns: string[];
  rows: (string | number)[][];
  filters?: string;
  orientation?: 'portrait' | 'landscape';
}

export async function exportToPDF({
  title,
  filename,
  columns,
  rows,
  filters,
  orientation = 'landscape',
}: PdfOptions) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });
  const pageW = orientation === 'landscape' ? 297 : 210;

  // Header bar
  doc.setFillColor(13, 27, 62);
  doc.rect(0, 0, pageW, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 14);

  const now = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Gerado em: ${now}`, pageW - 14, 14, { align: 'right' });

  // Filters line
  let startY = 28;
  if (filters) {
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    doc.text(`Filtros: ${filters}`, 14, startY);
    startY += 6;
  }

  autoTable(doc, {
    head: [columns],
    body: rows.map((r) => r.map(String)),
    startY,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}
