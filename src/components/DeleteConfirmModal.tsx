'use client';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  blocked?: boolean;
  blockedMsg?: string;
  confirmLabel?: string;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  blocked,
  blockedMsg,
  confirmLabel = 'Sim, excluir',
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;
  const color = blocked ? '#ef4444' : '#f59e0b';
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onCancel}
    >
      <div
        style={{ background: 'var(--surface)', borderRadius: 16, border: `2px solid ${color}`, width: '100%', maxWidth: 460, padding: '28px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={20} color={color} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>{title}</h3>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>{message}</p>

        {blocked && blockedMsg && (
          <div style={{ background: '#ef444422', border: '1px solid #ef444444', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: '#ef4444', fontWeight: 600 }}>⚠️ {blockedMsg}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onCancel}
            style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Cancelar
          </button>
          {!blocked && (
            <button
              onClick={onConfirm}
              style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#ef4444', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { DeleteConfirmModal };
