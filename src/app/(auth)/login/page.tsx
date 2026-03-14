'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { VencioLogo, VencioIcon } from '@/components/ui/VencioLogo';

const MSG: Record<string, string> = {
  inactive:          'Usuário desativado. Contate o administrador.',
  no_password:       'Senha não configurada. Contate o administrador.',
  wrong_password:    'Senha incorreta.',
  CredentialsSignin: 'Email não cadastrado ou senha incorreta.',
};

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [senha,    setSenha]    = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState<'credentials' | 'google' | 'microsoft' | null>(null);
  const [error,    setError]    = useState('');

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('credentials');
    setError('');
    const result = await signIn('credentials', { email, senha, redirect: false });
    if (result?.error) {
      setError(MSG[result.error] ?? MSG['CredentialsSignin']);
      setLoading(null);
    } else {
      window.location.href = '/';
    }
  };

  const handleGoogle = () => {
    setLoading('google');
    signIn('google', { callbackUrl: '/' });
  };

  const handleMicrosoft = () => {
    setLoading('microsoft');
    signIn('microsoft-entra-id', { callbackUrl: '/' });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#060D1A' }}
    >
      {/* ── Background: orbes luminosos nas cores da marca ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{ width: 700, height: 700, top: -250, left: -200, background: 'radial-gradient(circle, rgba(30,95,212,0.20) 0%, transparent 65%)', filter: 'blur(50px)' }} />
        <div className="absolute" style={{ width: 550, height: 550, bottom: -180, right: -120, background: 'radial-gradient(circle, rgba(0,201,122,0.16) 0%, transparent 65%)', filter: 'blur(50px)' }} />
        <div className="absolute" style={{ width: 400, height: 400, top: '15%', right: '15%', background: 'radial-gradient(circle, rgba(46,184,230,0.10) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* ── Card principal ── */}
      <div className="relative w-full mx-4 animate-fade-in" style={{ maxWidth: 420 }}>

        {/* Linha decorativa gradiente no topo */}
        <div style={{
          height: 2, marginBottom: -1,
          background: 'linear-gradient(90deg, transparent 0%, #1E5FD4 25%, #2EB8E6 50%, #00C97A 75%, transparent 100%)',
          borderRadius: '2px 2px 0 0',
        }} />

        <div style={{
          background: 'rgba(13,27,62,0.75)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: 'none',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
          padding: '2rem',
        }}>

          {/* Logo + tagline */}
          <div style={{ marginBottom: '1.75rem' }}>
            <VencioLogo variant="white" size={34} />
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, fontWeight: 500, marginTop: 6, paddingLeft: 2 }}>
              Gestão de contratos
            </p>
          </div>

          {/* OAuth */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading !== null}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '11px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 12, cursor: 'pointer',
                color: 'rgba(255,255,255,0.80)', fontSize: 14, fontWeight: 600,
                transition: 'all 0.15s', fontFamily: '"Plus Jakarta Sans", sans-serif',
                opacity: loading !== null ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
            >
              {loading === 'google' ? <Loader2 size={18} className="animate-spin" /> : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Entrar com Google
            </button>

            {/* Microsoft */}
            <button
              type="button"
              onClick={handleMicrosoft}
              disabled={loading !== null}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '11px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 12, cursor: 'pointer',
                color: 'rgba(255,255,255,0.80)', fontSize: 14, fontWeight: 600,
                transition: 'all 0.15s', fontFamily: '"Plus Jakarta Sans", sans-serif',
                opacity: loading !== null ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
            >
              {loading === 'microsoft' ? <Loader2 size={18} className="animate-spin" /> : (
                <svg width="18" height="18" viewBox="0 0 23 23">
                  <rect x="1"  y="1"  width="10" height="10" fill="#F25022"/>
                  <rect x="12" y="1"  width="10" height="10" fill="#7FBA00"/>
                  <rect x="1"  y="12" width="10" height="10" fill="#00A4EF"/>
                  <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
                </svg>
              )}
              Entrar com Microsoft
            </button>
          </div>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 600 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Form email/senha */}
          <form onSubmit={handleCredentials} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{ fontSize: 12, padding: '10px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, color: '#FCA5A5', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⚠</span> {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@empresa.com.br"
                required
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#E8EEF8', fontSize: 14, outline: 'none', transition: 'border-color 0.15s', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(30,95,212,0.7)')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '10px 44px 10px 14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#E8EEF8', fontSize: 14, outline: 'none', transition: 'border-color 0.15s', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(30,95,212,0.7)')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s', display: 'flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading !== null}
              style={{
                width: '100%', padding: '12px 16px',
                background: loading === 'credentials' ? 'rgba(30,95,212,0.5)' : 'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
                border: 'none', borderRadius: 12, cursor: 'pointer',
                color: '#fff', fontSize: 14, fontWeight: 700,
                boxShadow: loading === 'credentials' ? 'none' : '0 4px 24px rgba(30,95,212,0.40)',
                transition: 'all 0.2s', marginTop: 4,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading !== null && loading !== 'credentials' ? 0.6 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(30,95,212,0.55)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(30,95,212,0.40)'; }}
            >
              {loading === 'credentials' ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : 'Entrar'}
            </button>
          </form>

          {/* Rodapé com valores da marca */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'center', gap: 20 }}>
            {(['calendar', 'square-green', 'circle'] as const).map((icon, i) => (
              <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <VencioIcon variant={icon} size={14} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)' }}>
                  {['ORGANIZAÇÃO', 'CONFIANÇA', 'CONTROLE'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
