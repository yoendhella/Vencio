'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const MSG: Record<string, string> = {
  inactive:          'Usuário desativado. Contate o administrador.',
  no_password:       'Senha não configurada. Contate o administrador.',
  wrong_password:    'Senha incorreta.',
  CredentialsSignin: 'Email não cadastrado ou senha incorreta.',
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  background: 'rgba(240,244,248,0.80)',
  border: '1.5px solid rgba(209,220,240,0.80)',
  borderRadius: 12,
  color: '#0D1B3E',
  fontSize: 14,
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
} as const;

export default function LoginPage() {
  const [email,        setEmail]        = useState('');
  const [senha,        setSenha]        = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', { email, senha, redirect: false });
    if (result?.error) {
      setError(MSG[result.error] ?? MSG['CredentialsSignin']);
      setLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  const onFocus  = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = '#1E5FD4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,95,212,0.12)'; e.currentTarget.style.background = '#fff'; };
  const onBlur   = (e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'rgba(209,220,240,0.80)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(240,244,248,0.80)'; };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    }}>

      {/* ── Background: imagem de ondas ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/background.jpg"
          alt=""
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
          quality={90}
          unoptimized
        />
        {/* Overlay sutil para contraste */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,62,0.12)' }} />
      </div>

      {/* ── Card ── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, margin: '0 16px' }}>

        {/* Linha gradiente no topo */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, transparent 0%, #1E5FD4 20%, #2EB8E6 50%, #00C97A 80%, transparent 100%)',
          borderRadius: '3px 3px 0 0',
        }} />

        {/* Card branco glassmorphism */}
        <div style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.95)',
          borderTop: 'none',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 24px 80px rgba(13,27,62,0.22), 0 4px 24px rgba(13,27,62,0.10)',
          padding: '2.25rem 2rem 2rem',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Logo topo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
            <Image
              src="/brand/vencio_logo_white.png"
              alt="Vencio"
              width={160}
              height={48}
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>

          {/* Título */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0D1B3E', letterSpacing: '-0.03em', marginBottom: 6, fontFamily: 'inherit' }}>
              Bem-vindo de volta
            </h1>
            <p style={{ fontSize: 14, color: '#5A6B7D', fontWeight: 500, fontFamily: 'inherit' }}>
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {error && (
              <div style={{ padding: '11px 14px', background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.30)', borderRadius: 12, color: '#B91C1C', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
                ⚠ {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#5A6B7D', marginBottom: 7, fontFamily: 'inherit' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#5A6B7D', marginBottom: 7, fontFamily: 'inherit' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 46 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8FA3BE', display: 'flex', alignItems: 'center', padding: 2, transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#1E5FD4')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8FA3BE')}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 20px', marginTop: 4,
                background: loading ? 'rgba(30,95,212,0.5)' : 'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
                border: 'none', borderRadius: 14, color: '#fff',
                fontSize: 15, fontWeight: 700, letterSpacing: '0.01em',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 24px rgba(30,95,212,0.38)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(30,95,212,0.50)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; if (!loading) e.currentTarget.style.boxShadow = '0 6px 24px rgba(30,95,212,0.38)'; }}
            >
              {loading ? <><Loader2 size={17} className="animate-spin" /> Entrando...</> : <>Entrar <ArrowRight size={17} /></>}
            </button>
          </form>

          {/* Logo rodapé */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(209,220,240,0.60)' }}>
            <Image
              src="/brand/vencio_logo_white.png"
              alt="Vencio"
              width={90}
              height={28}
              style={{ objectFit: 'contain', opacity: 0.4 }}
              unoptimized
            />
            <p style={{ fontSize: 11, color: '#8FA3BE', fontWeight: 500, letterSpacing: '0.03em', fontFamily: 'inherit' }}>
              © {new Date().getFullYear()} Vencio — Todos os direitos reservados
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
