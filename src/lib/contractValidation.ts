import { differenceInDays, parseISO } from 'date-fns';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateContractDates(
  dataInicio: string | Date,
  dataTermino: string | Date,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const inicio = typeof dataInicio === 'string' ? parseISO(dataInicio) : dataInicio;
  const termino = typeof dataTermino === 'string' ? parseISO(dataTermino) : dataTermino;

  if (termino <= inicio) {
    errors.push('A data de término deve ser posterior à data de início.');
  }

  const duracaoDias = differenceInDays(termino, inicio);
  if (duracaoDias < 30) {
    warnings.push('Contrato com duração inferior a 30 dias.');
  }
  if (duracaoDias > 365 * 5) {
    warnings.push('Contrato com duração superior a 5 anos.');
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateValores(valorTotal: number, valorMensal: number, dataInicio: string | Date, dataTermino: string | Date): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (valorTotal <= 0) errors.push('O valor total deve ser positivo.');
  if (valorMensal <= 0) errors.push('O valor mensal deve ser positivo.');

  if (valorTotal > 0 && valorMensal > 0) {
    const inicio = typeof dataInicio === 'string' ? parseISO(dataInicio) : dataInicio;
    const termino = typeof dataTermino === 'string' ? parseISO(dataTermino) : dataTermino;
    const meses = Math.max(1, differenceInDays(termino, inicio) / 30);
    const totalCalculado = valorMensal * meses;
    const diff = Math.abs(totalCalculado - valorTotal) / valorTotal;

    if (diff > 0.15) {
      warnings.push(
        `O valor total (${valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) difere significativamente do esperado com base no valor mensal.`
      );
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateContrato(data: {
  dataInicio: string | Date;
  dataTermino: string | Date;
  valorTotal: number;
  valorMensal: number;
}): ValidationResult {
  const dateResult = validateContractDates(data.dataInicio, data.dataTermino);
  const valueResult = validateValores(data.valorTotal, data.valorMensal, data.dataInicio, data.dataTermino);

  return {
    valid: dateResult.valid && valueResult.valid,
    errors: [...dateResult.errors, ...valueResult.errors],
    warnings: [...dateResult.warnings, ...valueResult.warnings],
  };
}
