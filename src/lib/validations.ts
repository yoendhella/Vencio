import { z } from 'zod';

export const contratoSchema = z.object({
  numero: z.string().min(1),
  nome: z.string().min(3).max(200),
  objeto: z.string().optional(),
  tipo: z.enum(['prestacao_servico', 'fornecimento', 'manutencao', 'locacao', 'consultoria']),
  categoria: z.string().min(1),
  departamento: z.string().min(1),
  situacao: z.enum(['ativo', 'encerrado', 'suspenso', 'em_renovacao', 'rescindido']).default('ativo'),
  fornecedorId: z.string().uuid(),
  responsavelInternoId: z.string().uuid().optional(),
  valorTotal: z.coerce.number().positive(),
  valorMensal: z.coerce.number().positive(),
  formaPagamento: z.string().optional(),
  centroCusto: z.string().optional(),
  contaContabil: z.string().optional(),
  indicadorReajuste: z.enum(['IPCA', 'INPC', 'IGP-M', 'IGP-DI', 'fixo', 'sem_reajuste']).default('IPCA'),
  periodicidadeReajuste: z.string().optional(),
  dataAssinatura: z.string().datetime().optional(),
  dataInicio: z.string().datetime(),
  dataTermino: z.string().datetime(),
  diasAlertaAntecipado: z.coerce.number().int().min(7).max(180).default(30),
  maxAditivos: z.coerce.number().int().min(1).max(10).default(4),
  renovacaoAutomatica: z.boolean().default(false),
  modalidadeContratacao: z.string().optional(),
  slaIndicador: z.string().optional(),
  slaMeta: z.coerce.number().min(0).max(100).optional(),
});

export const aditivoSchema = z.object({
  numero: z.string().min(1),
  contratoId: z.string().uuid(),
  tipo: z.enum(['prazo', 'valor', 'escopo', 'valor_prazo']),
  dataAditivo: z.string().datetime(),
  novoValorMensal: z.coerce.number().positive().optional(),
  novaDataTermino: z.string().datetime().optional(),
  motivo: z.string().min(10),
});

export const reajusteSchema = z.object({
  contratoId: z.string().uuid(),
  indice: z.string().min(1),
  percentual: z.coerce.number(),
  valorAnterior: z.coerce.number().positive(),
  novoValor: z.coerce.number().positive(),
  dataVigencia: z.string().datetime(),
});

export const fornecedorSchema = z.object({
  razaoSocial: z.string().min(3),
  cnpj: z.string().min(14),
  nomeResponsavel: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  categoria: z.string().min(1),
  notaQualidade: z.coerce.number().min(0).max(5).optional(),
  notaPrazo: z.coerce.number().min(0).max(5).optional(),
  notaComunicacao: z.coerce.number().min(0).max(5).optional(),
  notaConformidade: z.coerce.number().min(0).max(5).optional(),
});

export const ocorrenciaSchema = z.object({
  contratoId: z.string().uuid(),
  descricao: z.string().min(10),
  dataOcorrencia: z.string().datetime(),
  penalidade: z.coerce.number().min(0).optional(),
});
