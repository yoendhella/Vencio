import { differenceInDays, parseISO, isAfter } from 'date-fns';

export type StatusCertidao = 'valida' | 'atencao' | 'vencida';

export interface ResultadoCertidao {
  status: StatusCertidao;
  diasRestantes: number;
  label: string;
  cor: string;
}

export function verificarCertidao(dataValidade: Date | string): ResultadoCertidao {
  const d = typeof dataValidade === 'string' ? parseISO(dataValidade) : dataValidade;
  const hoje = new Date();
  const dias = differenceInDays(d, hoje);

  if (!isAfter(d, hoje)) {
    return { status: 'vencida', diasRestantes: dias, label: 'Vencida', cor: '#DC2626' };
  }
  if (dias <= 30) {
    return { status: 'atencao', diasRestantes: dias, label: `Vence em ${dias}d`, cor: '#D97706' };
  }
  return { status: 'valida', diasRestantes: dias, label: `Válida (${dias}d)`, cor: '#16A34A' };
}

export function verificarRegularidade(certidoes: { tipo: string; dataValidade: Date | string }[]): {
  regular: boolean;
  pendencias: string[];
} {
  const tiposObrigatorios = ['receita_federal', 'fgts', 'inss', 'trabalhista'];
  const pendencias: string[] = [];

  for (const tipo of tiposObrigatorios) {
    const cert = certidoes.find((c) => c.tipo === tipo);
    if (!cert) {
      pendencias.push(`${tipo} ausente`);
      continue;
    }
    const resultado = verificarCertidao(cert.dataValidade);
    if (resultado.status === 'vencida') {
      pendencias.push(`${tipo} vencida`);
    }
  }

  return { regular: pendencias.length === 0, pendencias };
}
