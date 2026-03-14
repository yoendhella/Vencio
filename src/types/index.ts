import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: { id: string; role: string } & DefaultSession['user'];
  }
}

export type SituacaoContrato = 'ativo' | 'encerrado' | 'suspenso' | 'em_renovacao' | 'rescindido';
export type StatusAlerta = 'critico' | 'atencao' | 'ok';
export type StatusSla = 'conforme' | 'atencao' | 'risco';
export type PerfilUsuario = 'administrador' | 'gestor' | 'operacional' | 'financeiro' | 'visualizador';
