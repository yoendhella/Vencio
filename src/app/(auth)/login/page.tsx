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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#060D1A',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    }}>

      {/* ── Background imersivo ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 800, height: 800, top: -300, left: -250, background: 'radial-gradient(circle, rgba(30,95,212,0.22) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, bottom: -200, right: -150, background: 'radial-gradient(circle, rgba(0,201,122,0.18) 0%, transparent 60%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, top: '30%', left: '55%', background: 'radial-gradient(circle, rgba(46,184,230,0.10) 0%, transparent 60%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'absolute', width: 1, height: '60%', top: '20%', left: '38%', background: 'linear-gradient(180deg, transparent, rgba(30,95,212,0.25), rgba(0,201,122,0.25), transparent)', transform: 'rotate(15deg)' }} />
      </div>

      {/* ── Card principal ── */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, margin: '0 16px' }}>

        {/* Linha gradiente no topo */}
        <div style={{
          height: 2,
          background: 'linear-gradient(90deg, transparent 0%, #1E5FD4 20%, #2EB8E6 50%, #00C97A 80%, transparent 100%)',
          borderRadius: '2px 2px 0 0',
          marginBottom: -1,
        }} />

        {/* Card glassmorphism */}
        <div style={{
          background: 'rgba(13,27,62,0.72)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: 'none',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          padding: '2.25rem 2rem 2rem',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* Logo menu1 — topo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <Image
              src="/brand/vencio_logo_white.png"
              alt="Vencio"
              width={180}
              height={52}
              style={{ objectFit: 'contain' }}
              priority
              unoptimized
            />
          </div>

          {/* Título */}
          <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#E8EEF8', letterSpacing: '-0.02em', marginBottom: 6 }}>
              Bem-vindo de volta
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.30)', borderRadius: 12, color: '#FCA5A5', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚠</span>{error}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.38)', marginBottom: 7 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
                style={{ width: '100%', padding: '11px 15px', background: 'rgba(255,255,255,0.045)', border: '1.5px solid rgba(255,255,255,0.09)', borderRadius: 12, color: '#E8EEF8', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', fontFamily: 'inherit' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(30,95,212,0.65)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,95,212,0.12)'; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Senha */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.38)', marginBottom: 7 }}>
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
                  style={{ width: '100%', padding: '11px 44px 11px 15px', background: 'rgba(255,255,255,0.045)', border: '1.5px solid rgba(255,255,255,0.09)', borderRadius: 12, color: '#E8EEF8', fontSize: 14, fontWeight: 500, outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', fontFamily: 'inherit' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(30,95,212,0.65)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,95,212,0.12)'; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2, transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 20px', marginTop: 6,
                background: loading ? 'rgba(30,95,212,0.45)' : 'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
                border: 'none', borderRadius: 14, color: '#fff',
                fontSize: 15, fontWeight: 700, letterSpacing: '0.01em',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 28px rgba(30,95,212,0.42)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(30,95,212,0.55)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; if (!loading) e.currentTarget.style.boxShadow = '0 6px 28px rgba(30,95,212,0.42)'; }}
            >
              {loading
                ? <><Loader2 size={17} className="animate-spin" /> Entrando...</>
                : <>Entrar <ArrowRight size={17} /></>
              }
            </button>
          </form>

          {/* Logo menu2 — rodapé */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Image
              src="/brand/vencio_logo_white.png"
              alt="Vencio"
              width={90}
              height={26}
              style={{ objectFit: 'contain', opacity: 0.45 }}
              unoptimized
            />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', fontWeight: 500, letterSpacing: '0.04em' }}>
              © {new Date().getFullYear()} Vencio — Todos os direitos reservados
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
