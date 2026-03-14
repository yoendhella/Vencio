import { db } from './index';
import {
  usuarios, fornecedores, contratos, aditivos, reajustes,
  certidoes, ocorrenciasSla, logsAuditoria, configuracoesAlerta,
} from './schema';
import { eq } from 'drizzle-orm';
import { addDays, subDays, subMonths, addMonths } from 'date-fns';
import bcrypt from 'bcryptjs';

async function seed() {
  const hoje = new Date();

  // Usuários com senha
  const userEmails = [
    { email: 'admin@empresa.com.br', nome: 'Administrador', perfil: 'administrador' as const, senha: 'Admin@2026' },
    { email: 'carlos@empresa.com.br', nome: 'Carlos Souza', perfil: 'gestor' as const, senha: 'Gestor@2026' },
    { email: 'ana@empresa.com.br', nome: 'Ana Lima', perfil: 'operacional' as const, senha: 'Oper@2026' },
    { email: 'financeiro@empresa.com.br', nome: 'Financeiro', perfil: 'financeiro' as const, senha: 'Fin@2026' },
  ];

  const userIds: Record<string, string> = {};
  for (const u of userEmails) {
    const senhaHash = await bcrypt.hash(u.senha, 12);
    const existing = await db.select().from(usuarios).where(eq(usuarios.email, u.email));
    if (existing.length === 0) {
      const [created] = await db.insert(usuarios).values({ email: u.email, nome: u.nome, perfil: u.perfil, senhaHash }).returning();
      userIds[u.email] = created.id;
    } else {
      // Atualizar senha se usuário já existe
      await db.update(usuarios).set({ senhaHash }).where(eq(usuarios.email, u.email));
      userIds[u.email] = existing[0].id;
    }
  }

  // Fornecedores
  const fornecedoresData = [
    { razaoSocial: 'CleanPro LTDA', cnpj: '11.111.111/0001-11', categoria: 'Limpeza', notaQualidade: '4.5', notaPrazo: '4.2', notaComunicacao: '4.0', notaConformidade: '4.3' },
    { razaoSocial: 'TechBuild Engenharia', cnpj: '22.222.222/0001-22', categoria: 'Manutenção', notaQualidade: '4.8', notaPrazo: '4.6', notaComunicacao: '4.7', notaConformidade: '4.9' },
    { razaoSocial: 'VigiMax Segurança', cnpj: '33.333.333/0001-33', categoria: 'Segurança', notaQualidade: '3.8', notaPrazo: '3.5', notaComunicacao: '3.7', notaConformidade: '3.9' },
    { razaoSocial: 'SafeGear Brasil', cnpj: '44.444.444/0001-44', categoria: 'Segurança', notaQualidade: '4.2', notaPrazo: '4.0', notaComunicacao: '3.8', notaConformidade: '4.1' },
    { razaoSocial: 'SupportTech Brasil', cnpj: '55.555.555/0001-55', categoria: 'TI', notaQualidade: '4.9', notaPrazo: '4.8', notaComunicacao: '4.9', notaConformidade: '4.7' },
    { razaoSocial: 'PeopleFirst Gestão', cnpj: '66.666.666/0001-66', categoria: 'RH', notaQualidade: '3.5', notaPrazo: '3.2', notaComunicacao: '4.0', notaConformidade: '3.6' },
    { razaoSocial: 'EcoClean Ambiental', cnpj: '77.777.777/0001-77', categoria: 'Limpeza', notaQualidade: '4.1', notaPrazo: '3.9', notaComunicacao: '3.8', notaConformidade: '4.0' },
    { razaoSocial: 'PestControl Pro', cnpj: '88.888.888/0001-88', categoria: 'Limpeza', notaQualidade: '3.2', notaPrazo: '3.5', notaComunicacao: '3.3', notaConformidade: '3.4' },
  ];

  const fornIds: string[] = [];
  for (const f of fornecedoresData) {
    const existing = await db.select().from(fornecedores).where(eq(fornecedores.cnpj, f.cnpj));
    if (existing.length === 0) {
      const [created] = await db.insert(fornecedores).values(f).returning();
      fornIds.push(created.id);
    } else {
      fornIds.push(existing[0].id);
    }
  }

  // Contratos
  const contratosData = [
    // Críticos
    { numero: 'CTR-2024-001', nome: 'Limpeza Predial - Sede', tipo: 'prestacao_servico' as const, categoria: 'Limpeza', departamento: 'Facilities', fornecedorId: fornIds[0], valorTotal: '120000', valorMensal: '10000', dataInicio: subMonths(hoje, 11), dataTermino: addDays(hoje, 7), indicadorReajuste: 'IPCA' as const, slaIndicador: 'Satisfação', slaMeta: '90', slaRealizado: '85', slaStatus: 'atencao' as const },
    { numero: 'CTR-2024-002', nome: 'Manutenção Predial', tipo: 'manutencao' as const, categoria: 'Manutenção', departamento: 'Operações', fornecedorId: fornIds[1], valorTotal: '240000', valorMensal: '20000', dataInicio: subMonths(hoje, 11), dataTermino: addDays(hoje, 12), indicadorReajuste: 'INPC' as const },
    { numero: 'CTR-2024-003', nome: 'Segurança Patrimonial', tipo: 'prestacao_servico' as const, categoria: 'Segurança', departamento: 'Segurança', fornecedorId: fornIds[2], valorTotal: '180000', valorMensal: '15000', dataInicio: subMonths(hoje, 11), dataTermino: addDays(hoje, 14), indicadorReajuste: 'IPCA' as const, slaIndicador: 'Disponibilidade', slaMeta: '99', slaRealizado: '72', slaStatus: 'risco' as const },
    // Atenção
    { numero: 'CTR-2024-004', nome: 'Suporte TI - Help Desk', tipo: 'prestacao_servico' as const, categoria: 'TI', departamento: 'TI', fornecedorId: fornIds[4], valorTotal: '360000', valorMensal: '30000', dataInicio: subMonths(hoje, 9), dataTermino: addDays(hoje, 80), indicadorReajuste: 'IGP-M' as const, slaIndicador: 'Resolução 1° chamado', slaMeta: '95', slaRealizado: '97', slaStatus: 'conforme' as const },
    { numero: 'CTR-2024-005', nome: 'Gestão RH - Terceirizado', tipo: 'consultoria' as const, categoria: 'RH', departamento: 'RH', fornecedorId: fornIds[5], valorTotal: '144000', valorMensal: '12000', dataInicio: subMonths(hoje, 7), dataTermino: addDays(hoje, 110), indicadorReajuste: 'IPCA' as const },
    // Em dia
    { numero: 'CTR-2025-001', nome: 'EcoLimpeza Ambiental', tipo: 'prestacao_servico' as const, categoria: 'Limpeza', departamento: 'Facilities', fornecedorId: fornIds[6], valorTotal: '96000', valorMensal: '8000', dataInicio: subMonths(hoje, 4), dataTermino: addMonths(hoje, 8), indicadorReajuste: 'IPCA' as const },
    { numero: 'CTR-2025-002', nome: 'Controle de Pragas', tipo: 'prestacao_servico' as const, categoria: 'Limpeza', departamento: 'Facilities', fornecedorId: fornIds[7], valorTotal: '288000', valorMensal: '12000', dataInicio: subMonths(hoje, 2), dataTermino: addMonths(hoje, 22), indicadorReajuste: 'INPC' as const },
    { numero: 'CTR-2025-003', nome: 'Segurança Eletrônica', tipo: 'manutencao' as const, categoria: 'Segurança', departamento: 'Segurança', fornecedorId: fornIds[3], valorTotal: '192000', valorMensal: '16000', dataInicio: subMonths(hoje, 1), dataTermino: addMonths(hoje, 11), indicadorReajuste: 'IGP-M' as const },
  ];

  const contratoIds: string[] = [];
  for (const c of contratosData) {
    const existing = await db.select().from(contratos).where(eq(contratos.numero, c.numero));
    if (existing.length === 0) {
      const [created] = await db.insert(contratos).values({
        ...c,
        criadoPorId: userIds['admin@empresa.com.br'],
        responsavelInternoId: userIds['carlos@empresa.com.br'],
      }).returning();
      contratoIds.push(created.id);
    } else {
      contratoIds.push(existing[0].id);
    }
  }

  // Aditivos (4)
  const aditivosData = [
    { numero: 'ADT-001/2024', contratoId: contratoIds[0], tipo: 'valor' as const, dataAditivo: subMonths(hoje, 6), novoValorMensal: '11000', motivo: 'Reajuste contratual conforme índice IPCA acordado em cláusula 8.1', status: 'aprovado' as const, aprovadoEm: subMonths(hoje, 6) },
    { numero: 'ADT-002/2024', contratoId: contratoIds[1], tipo: 'prazo' as const, dataAditivo: subMonths(hoje, 3), novaDataTermino: addDays(hoje, 90), motivo: 'Extensão de prazo para conclusão de obras de reforma do edifício sede', status: 'aprovado' as const, aprovadoEm: subMonths(hoje, 3) },
    { numero: 'ADT-003/2024', contratoId: contratoIds[3], tipo: 'valor' as const, dataAditivo: subDays(hoje, 10), novoValorMensal: '32000', motivo: 'Ampliação do escopo com inclusão de 3 filiais no contrato de suporte', status: 'em_analise' as const },
    { numero: 'ADT-004/2024', contratoId: contratoIds[4], tipo: 'valor_prazo' as const, dataAditivo: subDays(hoje, 5), novoValorMensal: '13500', novaDataTermino: addMonths(hoje, 6), motivo: 'Revisão geral do contrato: ampliação de escopo e prorrogação de vigência', status: 'em_analise' as const },
  ];

  for (const a of aditivosData) {
    const existing = await db.select().from(aditivos).where(eq(aditivos.numero, a.numero));
    if (existing.length === 0) {
      await db.insert(aditivos).values({
        ...a,
        aprovadoPorId: a.status === 'aprovado' ? userIds['carlos@empresa.com.br'] : undefined,
        novoValorMensal: a.novoValorMensal,
        novaDataTermino: a.novaDataTermino,
      });
    }
  }

  // Reajustes (4)
  const reajustesData = [
    { contratoId: contratoIds[0], indice: 'IPCA', percentual: '4.8300', valorAnterior: '10000', novoValor: '10483', dataVigencia: addDays(hoje, 15), status: 'pendente' },
    { contratoId: contratoIds[1], indice: 'INPC', percentual: '4.7700', valorAnterior: '20000', novoValor: '20954', dataVigencia: addDays(hoje, 20), status: 'pendente' },
    { contratoId: contratoIds[3], indice: 'IGP-M', percentual: '6.5400', valorAnterior: '30000', novoValor: '31962', dataVigencia: subMonths(hoje, 3), status: 'aprovado' },
    { contratoId: contratoIds[4], indice: 'IPCA', percentual: '4.6200', valorAnterior: '12000', novoValor: '12554', dataVigencia: subMonths(hoje, 6), status: 'aprovado' },
  ];

  for (const r of reajustesData) {
    const existing = await db.select().from(reajustes).where(eq(reajustes.contratoId, r.contratoId));
    if (existing.filter((e) => e.indice === r.indice && e.status === r.status).length === 0) {
      await db.insert(reajustes).values({
        ...r,
        aprovadoPorId: r.status === 'aprovado' ? userIds['financeiro@empresa.com.br'] : undefined,
        aprovadoEm: r.status === 'aprovado' ? subMonths(hoje, 3) : undefined,
      });
    }
  }

  // Certidões (8)
  const certidoesData = [
    { fornecedorId: fornIds[0], tipo: 'receita_federal' as const, dataValidade: subDays(hoje, 15) }, // vencida
    { fornecedorId: fornIds[2], tipo: 'fgts' as const, dataValidade: subDays(hoje, 5) }, // vencida
    { fornecedorId: fornIds[1], tipo: 'trabalhista' as const, dataValidade: addDays(hoje, 15) }, // atenção
    { fornecedorId: fornIds[0], tipo: 'fgts' as const, dataValidade: addDays(hoje, 120) },
    { fornecedorId: fornIds[1], tipo: 'receita_federal' as const, dataValidade: addDays(hoje, 180) },
    { fornecedorId: fornIds[3], tipo: 'inss' as const, dataValidade: addDays(hoje, 90) },
    { fornecedorId: fornIds[4], tipo: 'estadual' as const, dataValidade: addDays(hoje, 200) },
    { fornecedorId: fornIds[5], tipo: 'municipal' as const, dataValidade: addDays(hoje, 60) },
  ];

  const existingCerts = await db.select().from(certidoes);
  if (existingCerts.length === 0) {
    await db.insert(certidoes).values(certidoesData);
  }

  // Ocorrências SLA (3)
  const ocorrencias = [
    { contratoId: contratoIds[2], descricao: 'Falha no ronda noturna — posto de segurança desguarnecido por 2 horas', dataOcorrencia: subDays(hoje, 5), penalidade: '1500', resolvido: false },
    { contratoId: contratoIds[2], descricao: 'Câmera do estacionamento sem funcionamento por 48 horas sem comunicação prévia', dataOcorrencia: subDays(hoje, 15), penalidade: '800', resolvido: false },
    { contratoId: contratoIds[0], descricao: 'Atraso na execução da limpeza das áreas comuns — 4 horas de atraso', dataOcorrencia: subDays(hoje, 20), penalidade: undefined, resolvido: true },
  ];

  const existingOcorrencias = await db.select().from(ocorrenciasSla);
  if (existingOcorrencias.length === 0) {
    await db.insert(ocorrenciasSla).values(ocorrencias);
  }

  // Logs de auditoria (9)
  const logs = [
    { usuarioId: userIds['admin@empresa.com.br'], nomeUsuario: 'Administrador', acao: 'CRIOU', entidade: 'contrato', detalhes: 'Contrato CTR-2024-001 criado', criadoEm: subDays(hoje, 30) },
    { usuarioId: userIds['carlos@empresa.com.br'], nomeUsuario: 'Carlos Souza', acao: 'CRIOU', entidade: 'contrato', detalhes: 'Contrato CTR-2024-002 criado', criadoEm: subDays(hoje, 28) },
    { usuarioId: userIds['carlos@empresa.com.br'], nomeUsuario: 'Carlos Souza', acao: 'ADITIVO_APROVADO', entidade: 'aditivo', detalhes: 'Aditivo ADT-001/2024 aprovado', criadoEm: subDays(hoje, 20) },
    { usuarioId: userIds['financeiro@empresa.com.br'], nomeUsuario: 'Financeiro', acao: 'APROVOU_REAJUSTE', entidade: 'reajuste', detalhes: 'Reajuste IGP-M 6.54% aprovado', criadoEm: subDays(hoje, 15) },
    { usuarioId: userIds['ana@empresa.com.br'], nomeUsuario: 'Ana Lima', acao: 'CRIOU', entidade: 'ocorrencia_sla', detalhes: 'Ocorrência SLA registrada', criadoEm: subDays(hoje, 5) },
    { usuarioId: userIds['admin@empresa.com.br'], nomeUsuario: 'Administrador', acao: 'EDITOU', entidade: 'contrato', detalhes: 'CTR-2024-003 atualizado', criadoEm: subDays(hoje, 4) },
    { usuarioId: userIds['carlos@empresa.com.br'], nomeUsuario: 'Carlos Souza', acao: 'CRIOU', entidade: 'aditivo', detalhes: 'Aditivo ADT-003/2024 criado', criadoEm: subDays(hoje, 10) },
    { usuarioId: userIds['financeiro@empresa.com.br'], nomeUsuario: 'Financeiro', acao: 'CRIOU', entidade: 'reajuste', detalhes: 'Reajuste IPCA solicitado', criadoEm: subDays(hoje, 3) },
    { usuarioId: userIds['ana@empresa.com.br'], nomeUsuario: 'Ana Lima', acao: 'CRIOU', entidade: 'certidao', detalhes: 'Certidão FGTS CleanPro cadastrada', criadoEm: subDays(hoje, 1) },
  ];

  const existingLogs = await db.select().from(logsAuditoria);
  if (existingLogs.length === 0) {
    await db.insert(logsAuditoria).values(logs);
  }

  // Config de alerta
  const existingConfig = await db.select().from(configuracoesAlerta);
  if (existingConfig.length === 0) {
    await db.insert(configuracoesAlerta).values({
      alerta60dias: true,
      alerta30dias: true,
      alertaReajuste: true,
      alertaCertidao: true,
      alertaSla: true,
    });
  }

  console.log('✅ Seed concluído com sucesso!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
