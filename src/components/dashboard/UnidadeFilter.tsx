'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Building2 } from 'lucide-react';

interface UnidadeFilterProps {
  unidades: string[];
}

export function UnidadeFilter({ unidades }: UnidadeFilterProps) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get('unidade') ?? '';

  const handleChange = (value: string) => {
    const sp = new URLSearchParams(params.toString());
    if (value) sp.set('unidade', value);
    else sp.delete('unidade');
    router.push(`/?${sp.toString()}`);
  };

  if (unidades.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Building2 size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--text-primary)',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="">Todas as Unidades</option>
        {unidades.map((u) => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
    </div>
  );
}
