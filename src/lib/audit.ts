import { db } from '@/db';
import { logsAuditoria } from '@/db/schema';

export async function log(params: {
  usuarioId: string;
  nomeUsuario: string;
  acao: string;
  entidade: string;
  entidadeId?: string;
  detalhes?: string;
}) {
  await db.insert(logsAuditoria).values(params);
}
