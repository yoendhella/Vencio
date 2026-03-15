'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
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
    <>
      <style>{`
        html, body { margin: 0; padding: 0; background: #0D1B3E !important; }
        #login-bg {
          min-height: 100vh;
          width: 100%;
          background-image: url('/vencio_logo_pack/background.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Plus Jakarta Sans", system-ui, sans-serif;
        }
        .login-logo { display: block; max-width: 100%; height: auto; }
      `}</style>

      <div id="login-bg">
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,62,0.15)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px', margin: '0 16px' }}>

          {/* Linha gradiente topo */}
          <div style={{
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #1E5FD4, #2EB8E6, #00C97A, transparent)',
            borderRadius: '3px 3px 0 0',
          }} />

          {/* Card */}
          <div style={{
            background: 'white',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            border: '1px solid rgba(255,255,255,0.90)',
            borderTop: 'none',
            borderRadius: '0 0 24px 24px',
            boxShadow: '0 32px 80px rgba(13,27,62,0.22)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
          }}>

            {/* LOGO TOPO */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem', background: 'transparent' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vencio_logo_pack/Logo.menu1.png"
                alt="Logo Vencio"
                style={{ width: '220px', height: 'auto', objectFit: 'contain' }}
              />
            </div>

            {/* TÍTULO */}
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <h1 style={{
                fontSize: '22px', fontWeight: 800,
                color: '#0D1B3E', letterSpacing: '-0.03em',
                marginBottom: '6px', fontFamily: 'inherit',
              }}>
                Bem-vindo de volta
              </h1>
              <p style={{ fontSize: '14px', color: '#5A6B7D', fontWeight: 500, fontFamily: 'inherit' }}>
                Acesse sua conta para continuar
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: '12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1.5px solid rgba(239,68,68,0.25)',
                  color: '#B91C1C', fontSize: '13px',
                  fontWeight: 500, fontFamily: 'inherit',
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{
                  display: 'block', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.10em',
                  color: '#5A6B7D', marginBottom: '7px', fontFamily: 'inherit',
                }}>Email</label>
                <input
                  type="email" value={email} required autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={{
                    width: '100%', padding: '12px 15px',
                    background: 'rgba(240,244,248,0.70)',
                    border: '1.5px solid rgba(209,220,240,0.80)',
                    borderRadius: '12px', color: '#0D1B3E',
                    fontSize: '14px', fontWeight: 500,
                    outline: 'none', transition: 'all 0.15s',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = '#1E5FD4';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,95,212,0.12)';
                    e.currentTarget.style.background = '#fff';
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'rgba(209,220,240,0.80)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = 'rgba(240,244,248,0.70)';
                  }}
                />
              </div>

              {/* Senha */}
              <div>
                <label style={{
                  display: 'block', fontSize: '11px', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.10em',
                  color: '#5A6B7D', marginBottom: '7px', fontFamily: 'inherit',
                }}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={senha} required autoComplete="current-password"
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', padding: '12px 46px 12px 15px',
                      background: 'rgba(240,244,248,0.70)',
                      border: '1.5px solid rgba(209,220,240,0.80)',
                      borderRadius: '12px', color: '#0D1B3E',
                      fontSize: '14px', fontWeight: 500,
                      outline: 'none', transition: 'all 0.15s',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#1E5FD4';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(30,95,212,0.12)';
                      e.currentTarget.style.background = '#fff';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209,220,240,0.80)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = 'rgba(240,244,248,0.70)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '13px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#8FA3BE',
                      display: 'flex', alignItems: 'center',
                      transition: 'color 0.15s', padding: '2px',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#1E5FD4')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#8FA3BE')}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px 20px', marginTop: '4px',
                  background: loading
                    ? 'rgba(30,95,212,0.5)'
                    : 'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
                  border: 'none', borderRadius: '14px',
                  color: '#fff', fontSize: '15px', fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 6px 24px rgba(30,95,212,0.38)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 10px 32px rgba(30,95,212,0.50)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  if (!loading) e.currentTarget.style.boxShadow = '0 6px 24px rgba(30,95,212,0.38)';
                }}
              >
                {loading
                  ? <><Loader2 size={17} className="animate-spin" /> Entrando...</>
                  : <>Entrar <ArrowRight size={17} /></>
                }
              </button>

            </form>

            {/* LOGO RODAPÉ */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(209,220,240,0.50)', background: 'transparent' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vencio_logo_pack/Logo.menu2.png"
                alt="Logo Vencio"
                style={{ width: '320px', height: 'auto', objectFit: 'contain' }}
              />
              <p style={{ fontSize: '11px', color: '#8FA3BE', fontWeight: 500, letterSpacing: '0.03em', fontFamily: 'inherit' }}>
                © {new Date().getFullYear()} Vencio — Todos os direitos reservados
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
