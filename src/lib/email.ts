import { Resend } from 'resend';

let _resend: Resend | null = null;
const getResend = () => {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder');
  return _resend;
};
const FROM = process.env.RESEND_FROM_EMAIL ?? 'alertas@contratos-pro.com.br';
const APP = process.env.NEXT_PUBLIC_APP_NAME ?? 'ContratoPro';

export async function enviarAlertaVencimento(params: {
  email: string;
  contratoNome: string;
  contratoNumero: string;
  fornecedor: string;
  diasRestantes: number;
  dataTermino: string;
}) {
  const urgencia = params.diasRestantes <= 7 ? 'CRÍTICO' : params.diasRestantes <= 30 ? 'URGENTE' : 'ATENÇÃO';
  const cor = params.diasRestantes <= 7 ? '#DC2626' : params.diasRestantes <= 30 ? '#D97706' : '#1C3FAA';

  await getResend().emails.send({
    from: FROM,
    to: params.email,
    subject: `[${APP}] ${urgencia}: Contrato ${params.contratoNumero} vence em ${params.diasRestantes} dias`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:${cor};padding:20px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${APP} — Alerta de Vencimento</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <p style="margin:0 0 16px">O contrato abaixo está próximo do vencimento:</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Contrato</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb">${params.contratoNome}</td></tr>
            <tr><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold">Número</td><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb">${params.contratoNumero}</td></tr>
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Fornecedor</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb">${params.fornecedor}</td></tr>
            <tr><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold">Vencimento</td><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb">${params.dataTermino}</td></tr>
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Dias restantes</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;color:${cor};font-weight:bold">${params.diasRestantes} dias</td></tr>
          </table>
          <p style="margin:16px 0 0;color:#6b7280;font-size:12px">Acesse o sistema para tomar as providências necessárias.</p>
        </div>
      </div>
    `,
  });
}

export async function enviarAlertaReajuste(params: {
  email: string;
  contratoNome: string;
  contratoNumero: string;
  indice: string;
  percentual: number;
  valorAnterior: number;
  novoValor: number;
  dataVigencia: string;
}) {
  const impactoAnual = (params.novoValor - params.valorAnterior) * 12;

  await getResend().emails.send({
    from: FROM,
    to: params.email,
    subject: `[${APP}] Reajuste pendente: ${params.contratoNumero} — ${params.indice} ${params.percentual}%`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#D97706;padding:20px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${APP} — Reajuste Pendente</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Contrato</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb">${params.contratoNome} (${params.contratoNumero})</td></tr>
            <tr><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold">Índice</td><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb">${params.indice} (${params.percentual}%)</td></tr>
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Valor anterior</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb">R$ ${params.valorAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</td></tr>
            <tr><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold">Novo valor</td><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb">R$ ${params.novoValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</td></tr>
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Impacto anual</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;color:#D97706;font-weight:bold">+R$ ${impactoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td></tr>
            <tr><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold">Vigência</td><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb">${params.dataVigencia}</td></tr>
          </table>
        </div>
      </div>
    `,
  });
}

export async function enviarAlertaCertidao(params: {
  email: string;
  fornecedor: string;
  tipoCertidao: string;
  status: 'vencida' | 'atencao';
  dataValidade: string;
}) {
  const cor = params.status === 'vencida' ? '#DC2626' : '#D97706';
  const label = params.status === 'vencida' ? 'VENCIDA' : 'VENCENDO EM BREVE';

  await getResend().emails.send({
    from: FROM,
    to: params.email,
    subject: `[${APP}] Certidão ${label}: ${params.tipoCertidao} — ${params.fornecedor}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:${cor};padding:20px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${APP} — Certidão ${label}</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Fornecedor</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb">${params.fornecedor}</td></tr>
            <tr><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb;font-weight:bold">Certidão</td><td style="padding:8px;background:#f9fafb;border:1px solid #e5e7eb">${params.tipoCertidao}</td></tr>
            <tr><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;font-weight:bold">Validade</td><td style="padding:8px;background:#fff;border:1px solid #e5e7eb;color:${cor};font-weight:bold">${params.dataValidade}</td></tr>
          </table>
          <p style="margin:16px 0 0;color:#6b7280;font-size:12px">Solicite a atualização da certidão ao fornecedor.</p>
        </div>
      </div>
    `,
  });
}

export async function enviarResumoSemanal(params: {
  email: string;
  ativos: number;
  criticos: number;
  reajustesPendentes: number;
  certidoesVencidas: number;
}) {
  await getResend().emails.send({
    from: FROM,
    to: params.email,
    subject: `[${APP}] Resumo semanal de contratos`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1C3FAA;padding:20px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">${APP} — Resumo Semanal</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div style="background:#EEF2FF;padding:16px;border-radius:8px;text-align:center">
              <div style="font-size:32px;font-weight:bold;color:#1C3FAA">${params.ativos}</div>
              <div style="color:#6b7280;font-size:14px">Contratos ativos</div>
            </div>
            <div style="background:#FEF2F2;padding:16px;border-radius:8px;text-align:center">
              <div style="font-size:32px;font-weight:bold;color:#DC2626">${params.criticos}</div>
              <div style="color:#6b7280;font-size:14px">Críticos (≤30 dias)</div>
            </div>
            <div style="background:#FFFBEB;padding:16px;border-radius:8px;text-align:center">
              <div style="font-size:32px;font-weight:bold;color:#D97706">${params.reajustesPendentes}</div>
              <div style="color:#6b7280;font-size:14px">Reajustes pendentes</div>
            </div>
            <div style="background:#FEF2F2;padding:16px;border-radius:8px;text-align:center">
              <div style="font-size:32px;font-weight:bold;color:#DC2626">${params.certidoesVencidas}</div>
              <div style="color:#6b7280;font-size:14px">Certidões vencidas</div>
            </div>
          </div>
        </div>
      </div>
    `,
  });
}
