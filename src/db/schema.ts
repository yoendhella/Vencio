import {
  pgTable, pgEnum, text, integer, decimal,
  boolean, timestamp, uuid,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ENUMS
export const situacaoContrato = pgEnum('situacao_contrato', ['ativo', 'encerrado', 'suspenso', 'em_renovacao', 'rescindido']);
export const tipoContrato = pgEnum('tipo_contrato', ['prestacao_servico', 'fornecimento', 'manutencao', 'locacao', 'consultoria']);
export const indiceReajuste = pgEnum('indice_reajuste', ['IPCA', 'INPC', 'IGP-M', 'IGP-DI', 'fixo', 'sem_reajuste']);
export const tipoAditivo = pgEnum('tipo_aditivo', ['prazo', 'valor', 'escopo', 'valor_prazo']);
export const statusAditivo = pgEnum('status_aditivo', ['em_analise', 'aprovado', 'rejeitado']);
export const tipoCertidao = pgEnum('tipo_certidao', ['receita_federal', 'fgts', 'inss', 'trabalhista', 'estadual', 'municipal']);
export const tipoDocumento = pgEnum('tipo_documento', ['contrato', 'aditivo', 'proposta', 'nf_fiscal', 'certidao', 'sla', 'outro']);
export const perfilUsuario = pgEnum('perfil_usuario', ['administrador', 'gestor', 'operacional', 'financeiro', 'visualizador']);
export const statusSla = pgEnum('status_sla', ['conforme', 'atencao', 'risco']);

// TABELA: usuarios
export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  senhaHash: text('senha_hash'),
  perfil: perfilUsuario('perfil').notNull().default('visualizador'),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// TABELA: fornecedores
export const fornecedores = pgTable('fornecedores', {
  id: uuid('id').defaultRandom().primaryKey(),
  razaoSocial: text('razao_social').notNull(),
  cnpj: text('cnpj').notNull().unique(),
  nomeResponsavel: text('nome_responsavel'),
  telefone: text('telefone'),
  email: text('email'),
  categoria: text('categoria').notNull(),
  notaQualidade: decimal('nota_qualidade', { precision: 3, scale: 1 }),
  notaPrazo: decimal('nota_prazo', { precision: 3, scale: 1 }),
  notaComunicacao: decimal('nota_comunicacao', { precision: 3, scale: 1 }),
  notaConformidade: decimal('nota_conformidade', { precision: 3, scale: 1 }),
  totalOcorrencias: integer('total_ocorrencias').notNull().default(0),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
  atualizadoEm: timestamp('atualizado_em').notNull().defaultNow(),
});

// TABELA: contratos
export const contratos = pgTable('contratos', {
  id: uuid('id').defaultRandom().primaryKey(),
  numero: text('numero').notNull().unique(),
  nome: text('nome').notNull(),
  objeto: text('objeto'),
  tipo: tipoContrato('tipo').notNull(),
  categoria: text('categoria').notNull(),
  departamento: text('departamento').notNull(),
  situacao: situacaoContrato('situacao').notNull().default('ativo'),
  fornecedorId: uuid('fornecedor_id').notNull().references(() => fornecedores.id),
  responsavelInternoId: uuid('responsavel_interno_id').references(() => usuarios.id),
  valorTotal: decimal('valor_total', { precision: 14, scale: 2 }).notNull(),
  valorMensal: decimal('valor_mensal', { precision: 14, scale: 2 }).notNull(),
  formaPagamento: text('forma_pagamento'),
  centroCusto: text('centro_custo'),
  contaContabil: text('conta_contabil'),
  indicadorReajuste: indiceReajuste('indicador_reajuste').notNull().default('IPCA'),
  periodicidadeReajuste: text('periodicidade_reajuste').default('anual'),
  dataAssinatura: timestamp('data_assinatura'),
  dataInicio: timestamp('data_inicio').notNull(),
  dataTermino: timestamp('data_termino').notNull(),
  diasAlertaAntecipado: integer('dias_alerta_antecipado').notNull().default(30),
  maxAditivos: integer('max_aditivos').notNull().default(4),
  renovacaoAutomatica: boolean('renovacao_automatica').notNull().default(false),
  modalidadeContratacao: text('modalidade_contratacao'),
  slaIndicador: text('sla_indicador'),
  slaMeta: decimal('sla_meta', { precision: 5, scale: 2 }),
  slaRealizado: decimal('sla_realizado', { precision: 5, scale: 2 }),
  slaStatus: statusSla('sla_status').default('conforme'),
  criadoPorId: uuid('criado_por_id').references(() => usuarios.id),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
  atualizadoEm: timestamp('atualizado_em').notNull().defaultNow(),
});

// TABELA: aditivos
export const aditivos = pgTable('aditivos', {
  id: uuid('id').defaultRandom().primaryKey(),
  numero: text('numero').notNull(),
  contratoId: uuid('contrato_id').notNull().references(() => contratos.id, { onDelete: 'cascade' }),
  tipo: tipoAditivo('tipo').notNull(),
  dataAditivo: timestamp('data_aditivo').notNull(),
  novoValorMensal: decimal('novo_valor_mensal', { precision: 14, scale: 2 }),
  novaDataTermino: timestamp('nova_data_termino'),
  motivo: text('motivo').notNull(),
  status: statusAditivo('status').notNull().default('em_analise'),
  aprovadoPorId: uuid('aprovado_por_id').references(() => usuarios.id),
  aprovadoEm: timestamp('aprovado_em'),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// TABELA: reajustes
export const reajustes = pgTable('reajustes', {
  id: uuid('id').defaultRandom().primaryKey(),
  contratoId: uuid('contrato_id').notNull().references(() => contratos.id, { onDelete: 'cascade' }),
  indice: text('indice').notNull(),
  percentual: decimal('percentual', { precision: 6, scale: 4 }).notNull(),
  valorAnterior: decimal('valor_anterior', { precision: 14, scale: 2 }).notNull(),
  novoValor: decimal('novo_valor', { precision: 14, scale: 2 }).notNull(),
  dataVigencia: timestamp('data_vigencia').notNull(),
  status: text('status').notNull().default('pendente'),
  aprovadoPorId: uuid('aprovado_por_id').references(() => usuarios.id),
  aprovadoEm: timestamp('aprovado_em'),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// TABELA: documentos
export const documentos = pgTable('documentos', {
  id: uuid('id').defaultRandom().primaryKey(),
  contratoId: uuid('contrato_id').references(() => contratos.id, { onDelete: 'cascade' }),
  nome: text('nome').notNull(),
  tipo: tipoDocumento('tipo').notNull(),
  url: text('url').notNull(),
  tamanhoBytes: integer('tamanho_bytes'),
  uploadadoPorId: uuid('uploadado_por_id').references(() => usuarios.id),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// TABELA: certidoes
export const certidoes = pgTable('certidoes', {
  id: uuid('id').defaultRandom().primaryKey(),
  fornecedorId: uuid('fornecedor_id').notNull().references(() => fornecedores.id, { onDelete: 'cascade' }),
  tipo: tipoCertidao('tipo').notNull(),
  dataValidade: timestamp('data_validade').notNull(),
  documentoUrl: text('documento_url'),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// TABELA: ocorrencias_sla
export const ocorrenciasSla = pgTable('ocorrencias_sla', {
  id: uuid('id').defaultRandom().primaryKey(),
  contratoId: uuid('contrato_id').notNull().references(() => contratos.id, { onDelete: 'cascade' }),
  descricao: text('descricao').notNull(),
  dataOcorrencia: timestamp('data_ocorrencia').notNull(),
  penalidade: decimal('penalidade', { precision: 12, scale: 2 }),
  resolvido: boolean('resolvido').notNull().default(false),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// TABELA: logs_auditoria
export const logsAuditoria = pgTable('logs_auditoria', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id),
  nomeUsuario: text('nome_usuario').notNull(),
  acao: text('acao').notNull(),
  entidade: text('entidade').notNull(),
  entidadeId: uuid('entidade_id'),
  detalhes: text('detalhes'),
  ip: text('ip'),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
});

// TABELA: configuracoes_alerta
export const configuracoesAlerta = pgTable('configuracoes_alerta', {
  id: uuid('id').defaultRandom().primaryKey(),
  alerta90dias: boolean('alerta_90dias').notNull().default(false),
  alerta60dias: boolean('alerta_60dias').notNull().default(true),
  alerta30dias: boolean('alerta_30dias').notNull().default(true),
  alertaReajuste: boolean('alerta_reajuste').notNull().default(true),
  alertaCertidao: boolean('alerta_certidao').notNull().default(true),
  alertaSla: boolean('alerta_sla').notNull().default(true),
  resumoSemanal: boolean('resumo_semanal').notNull().default(false),
  emailDestinatario: text('email_destinatario'),
  atualizadoEm: timestamp('atualizado_em').notNull().defaultNow(),
});

// RELATIONS
export const contratosRelations = relations(contratos, ({ one, many }) => ({
  fornecedor: one(fornecedores, { fields: [contratos.fornecedorId], references: [fornecedores.id] }),
  responsavelInterno: one(usuarios, { fields: [contratos.responsavelInternoId], references: [usuarios.id] }),
  criadoPor: one(usuarios, { fields: [contratos.criadoPorId], references: [usuarios.id] }),
  aditivos: many(aditivos),
  reajustes: many(reajustes),
  documentos: many(documentos),
  ocorrenciasSla: many(ocorrenciasSla),
}));

export const fornecedoresRelations = relations(fornecedores, ({ many }) => ({
  contratos: many(contratos),
  certidoes: many(certidoes),
}));

export const aditivosRelations = relations(aditivos, ({ one }) => ({
  contrato: one(contratos, { fields: [aditivos.contratoId], references: [contratos.id] }),
  aprovadoPor: one(usuarios, { fields: [aditivos.aprovadoPorId], references: [usuarios.id] }),
}));

export const reajustesRelations = relations(reajustes, ({ one }) => ({
  contrato: one(contratos, { fields: [reajustes.contratoId], references: [contratos.id] }),
  aprovadoPor: one(usuarios, { fields: [reajustes.aprovadoPorId], references: [usuarios.id] }),
}));

export const certidoesRelations = relations(certidoes, ({ one }) => ({
  fornecedor: one(fornecedores, { fields: [certidoes.fornecedorId], references: [fornecedores.id] }),
}));

export const ocorrenciasSlaRelations = relations(ocorrenciasSla, ({ one }) => ({
  contrato: one(contratos, { fields: [ocorrenciasSla.contratoId], references: [contratos.id] }),
}));
