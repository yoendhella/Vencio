import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, differenceInDays, parseISO, isAfter, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { StatusAlerta, StatusSla } from '@/types';

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));

export const formatCurrency = (v: number | string) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v));

export const formatDate = (d: Date | string | null) => {
  if (!d) return '—';
  return format(typeof d === 'string' ? parseISO(d) : d, 'dd/MM/yyyy', { locale: ptBR });
};

export const formatMonthYear = (d: Date | string) =>
  format(typeof d === 'string' ? parseISO(d) : d, 'MMM/yy', { locale: ptBR });

export const diasRestantes = (d: Date | string) =>
  differenceInDays(typeof d === 'string' ? parseISO(d) : d, new Date());

export const statusContrato = (dias: number): StatusAlerta =>
  dias <= 30 ? 'critico' : dias <= 90 ? 'atencao' : 'ok';

export const statusSlaFn = (p: number): StatusSla =>
  p >= 95 ? 'conforme' : p >= 80 ? 'atencao' : 'risco';

export const corSla = (p: number) => p >= 95 ? '#16A34A' : p >= 80 ? '#D97706' : '#DC2626';

export const statusCertidao = (v: Date | string): 'valida' | 'atencao' | 'vencida' => {
  const d = typeof v === 'string' ? parseISO(v) : v;
  const hoje = new Date();
  if (!isAfter(d, hoje)) return 'vencida';
  if (!isAfter(d, addDays(hoje, 30))) return 'atencao';
  return 'valida';
};

export const calcularSaldo = (total: number, mensal: number, inicio: Date | string) => {
  const meses = Math.max(0, differenceInDays(new Date(), typeof inicio === 'string' ? parseISO(inicio) : inicio) / 30);
  return Math.max(0, total - mensal * meses);
};
