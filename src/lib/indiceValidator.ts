/**
 * Valida e formata índices de reajuste.
 * Evita exibir valores absurdos (ex: IPCA 7100%) vindo da API IBGE.
 */

const LIMITES: Record<string, { min: number; max: number }> = {
  IPCA:       { min: -5,  max: 30  },
  INPC:       { min: -5,  max: 30  },
  'IGP-M':    { min: -10, max: 50  },
  'IGP-DI':   { min: -10, max: 50  },
  fixo:       { min: 0,   max: 100 },
  sem_reajuste: { min: 0, max: 0   },
};

const DEFAULT_FALLBACK: Record<string, number> = {
  IPCA:       4.83,
  INPC:       4.61,
  'IGP-M':    6.54,
  'IGP-DI':   6.12,
  fixo:       0,
  sem_reajuste: 0,
};

export function sanitizeIndice(indice: string, valor: number): number {
  const limite = LIMITES[indice];
  if (!limite) return valor;
  if (valor < limite.min || valor > limite.max) {
    return DEFAULT_FALLBACK[indice] ?? 0;
  }
  return valor;
}

export function formatIndice(indice: string, valor: number): string {
  const sanitized = sanitizeIndice(indice, valor);
  return `${sanitized.toFixed(2)}%`;
}

export function isIndiceValido(indice: string, valor: number): boolean {
  const limite = LIMITES[indice];
  if (!limite) return true;
  return valor >= limite.min && valor <= limite.max;
}
