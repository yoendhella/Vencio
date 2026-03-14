CREATE TYPE "public"."indice_reajuste" AS ENUM('IPCA', 'INPC', 'IGP-M', 'IGP-DI', 'fixo', 'sem_reajuste');--> statement-breakpoint
CREATE TYPE "public"."perfil_usuario" AS ENUM('administrador', 'gestor', 'operacional', 'financeiro', 'visualizador');--> statement-breakpoint
CREATE TYPE "public"."situacao_contrato" AS ENUM('ativo', 'encerrado', 'suspenso', 'em_renovacao', 'rescindido');--> statement-breakpoint
CREATE TYPE "public"."status_aditivo" AS ENUM('em_analise', 'aprovado', 'rejeitado');--> statement-breakpoint
CREATE TYPE "public"."status_sla" AS ENUM('conforme', 'atencao', 'risco');--> statement-breakpoint
CREATE TYPE "public"."tipo_aditivo" AS ENUM('prazo', 'valor', 'escopo', 'valor_prazo');--> statement-breakpoint
CREATE TYPE "public"."tipo_certidao" AS ENUM('receita_federal', 'fgts', 'inss', 'trabalhista', 'estadual', 'municipal');--> statement-breakpoint
CREATE TYPE "public"."tipo_contrato" AS ENUM('prestacao_servico', 'fornecimento', 'manutencao', 'locacao', 'consultoria');--> statement-breakpoint
CREATE TYPE "public"."tipo_documento" AS ENUM('contrato', 'aditivo', 'proposta', 'nf_fiscal', 'certidao', 'sla', 'outro');--> statement-breakpoint
CREATE TABLE "aditivos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"contrato_id" uuid NOT NULL,
	"tipo" "tipo_aditivo" NOT NULL,
	"data_aditivo" timestamp NOT NULL,
	"novo_valor_mensal" numeric(14, 2),
	"nova_data_termino" timestamp,
	"motivo" text NOT NULL,
	"status" "status_aditivo" DEFAULT 'em_analise' NOT NULL,
	"aprovado_por_id" uuid,
	"aprovado_em" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certidoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fornecedor_id" uuid NOT NULL,
	"tipo" "tipo_certidao" NOT NULL,
	"data_validade" timestamp NOT NULL,
	"documento_url" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configuracoes_alerta" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alerta_90dias" boolean DEFAULT false NOT NULL,
	"alerta_60dias" boolean DEFAULT true NOT NULL,
	"alerta_30dias" boolean DEFAULT true NOT NULL,
	"alerta_reajuste" boolean DEFAULT true NOT NULL,
	"alerta_certidao" boolean DEFAULT true NOT NULL,
	"alerta_sla" boolean DEFAULT true NOT NULL,
	"resumo_semanal" boolean DEFAULT false NOT NULL,
	"email_destinatario" text,
	"atualizado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contratos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero" text NOT NULL,
	"nome" text NOT NULL,
	"objeto" text,
	"tipo" "tipo_contrato" NOT NULL,
	"categoria" text NOT NULL,
	"departamento" text NOT NULL,
	"situacao" "situacao_contrato" DEFAULT 'ativo' NOT NULL,
	"fornecedor_id" uuid NOT NULL,
	"responsavel_interno_id" uuid,
	"valor_total" numeric(14, 2) NOT NULL,
	"valor_mensal" numeric(14, 2) NOT NULL,
	"forma_pagamento" text,
	"centro_custo" text,
	"conta_contabil" text,
	"indicador_reajuste" "indice_reajuste" DEFAULT 'IPCA' NOT NULL,
	"periodicidade_reajuste" text DEFAULT 'anual',
	"data_assinatura" timestamp,
	"data_inicio" timestamp NOT NULL,
	"data_termino" timestamp NOT NULL,
	"dias_alerta_antecipado" integer DEFAULT 30 NOT NULL,
	"max_aditivos" integer DEFAULT 4 NOT NULL,
	"renovacao_automatica" boolean DEFAULT false NOT NULL,
	"modalidade_contratacao" text,
	"sla_indicador" text,
	"sla_meta" numeric(5, 2),
	"sla_realizado" numeric(5, 2),
	"sla_status" "status_sla" DEFAULT 'conforme',
	"criado_por_id" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contratos_numero_unique" UNIQUE("numero")
);
--> statement-breakpoint
CREATE TABLE "documentos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contrato_id" uuid,
	"nome" text NOT NULL,
	"tipo" "tipo_documento" NOT NULL,
	"url" text NOT NULL,
	"tamanho_bytes" integer,
	"uploadado_por_id" uuid,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fornecedores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"razao_social" text NOT NULL,
	"cnpj" text NOT NULL,
	"nome_responsavel" text,
	"telefone" text,
	"email" text,
	"categoria" text NOT NULL,
	"nota_qualidade" numeric(3, 1),
	"nota_prazo" numeric(3, 1),
	"nota_comunicacao" numeric(3, 1),
	"nota_conformidade" numeric(3, 1),
	"total_ocorrencias" integer DEFAULT 0 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"atualizado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fornecedores_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "logs_auditoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid,
	"nome_usuario" text NOT NULL,
	"acao" text NOT NULL,
	"entidade" text NOT NULL,
	"entidade_id" uuid,
	"detalhes" text,
	"ip" text,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ocorrencias_sla" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contrato_id" uuid NOT NULL,
	"descricao" text NOT NULL,
	"data_ocorrencia" timestamp NOT NULL,
	"penalidade" numeric(12, 2),
	"resolvido" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reajustes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contrato_id" uuid NOT NULL,
	"indice" text NOT NULL,
	"percentual" numeric(6, 4) NOT NULL,
	"valor_anterior" numeric(14, 2) NOT NULL,
	"novo_valor" numeric(14, 2) NOT NULL,
	"data_vigencia" timestamp NOT NULL,
	"status" text DEFAULT 'pendente' NOT NULL,
	"aprovado_por_id" uuid,
	"aprovado_em" timestamp,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"perfil" "perfil_usuario" DEFAULT 'visualizador' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "aditivos" ADD CONSTRAINT "aditivos_contrato_id_contratos_id_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aditivos" ADD CONSTRAINT "aditivos_aprovado_por_id_usuarios_id_fk" FOREIGN KEY ("aprovado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certidoes" ADD CONSTRAINT "certidoes_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_fornecedor_id_fornecedores_id_fk" FOREIGN KEY ("fornecedor_id") REFERENCES "public"."fornecedores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_responsavel_interno_id_usuarios_id_fk" FOREIGN KEY ("responsavel_interno_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_criado_por_id_usuarios_id_fk" FOREIGN KEY ("criado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_contrato_id_contratos_id_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_uploadado_por_id_usuarios_id_fk" FOREIGN KEY ("uploadado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ocorrencias_sla" ADD CONSTRAINT "ocorrencias_sla_contrato_id_contratos_id_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reajustes" ADD CONSTRAINT "reajustes_contrato_id_contratos_id_fk" FOREIGN KEY ("contrato_id") REFERENCES "public"."contratos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reajustes" ADD CONSTRAINT "reajustes_aprovado_por_id_usuarios_id_fk" FOREIGN KEY ("aprovado_por_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;