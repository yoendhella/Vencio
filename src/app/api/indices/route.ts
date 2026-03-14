import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const FALLBACK = {
  IPCA: { valor: 4.83, mes: 'dez/24' },
  INPC: { valor: 4.77, mes: 'dez/24' },
  'IGP-M': { valor: 6.54, mes: 'dez/24' },
};

export const revalidate = 86400; // 24h cache

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // IBGE IPCA: Série 433
    const res = await fetch(
      'https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/202412/variaveis/2266?localidades=N1[all]',
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) throw new Error('IBGE error');
    const json = await res.json();
    const ipca = Number(json?.[0]?.resultados?.[0]?.series?.[0]?.serie?.['202412'] ?? FALLBACK.IPCA.valor);
    return NextResponse.json({
      data: {
        IPCA: { valor: ipca, mes: 'dez/24' },
        INPC: FALLBACK.INPC,
        'IGP-M': FALLBACK['IGP-M'],
      },
    });
  } catch {
    return NextResponse.json({ data: FALLBACK });
  }
}
