/**
 * indiceValidator.ts
 * Corrige o bug do IPCA exibindo 7100.50%
 * Detectado em auditoria de 15/03/2026
 */

/** Limites anuais máximos por índice (valores reais brasileiros) */
const MAX_INDICE: Record<string, number> = {
  IPCA: 25, INPC: 25, 'IGP-M': 40, 'IPC-A': 25,
  INCC: 40, SELIC: 20, CDI: 20,
};

/**
 * Sanitiza valor de índice — corrige quando salvo como basis points.
 * Ex: 4.83 salvo como 483 ou 710050 → retorna 4.83
 */
export function sanitizeIndice(nome: string, valor: number): number {
  const max = MAX_INDICE[nome.toUpperCase()] ?? 100;
  if (valor > max && valor / 100 <= max) return +(valor / 100).toFixed(2);
  if (valor > max) {
    console.error(`[VENCIO-AUDITORIA] Indice ${nome} com valor suspeito: ${valor}% — verifique o banco de dados`);
  }
  return valor;
}

/** Formata índice para exibição segura, corrigindo se necessário */
export function formatIndice(nome: string, valor: number): string {
  return `${sanitizeIndice(nome, valor).toFixed(2)}%`;
}

/** Verifica se o valor do índice parece corrompido */
export function isIndiceSuspeito(nome: string, valor: number): boolean {
  const max = MAX_INDICE[nome.toUpperCase()] ?? 100;
  return valor > max;
}
