'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { VencioLogo } from '@/components/ui/VencioLogo';

const MSG: Record<string, string> = {
  inactive:         'Usuário desativado. Contate o administrador.',
  no_password:      'Senha não configurada. Contate o administrador.',
  wrong_password:   'Senha incorreta.',
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

  const oauthBtn = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.85)',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#060D1A' }}
    >
      {/* ── Background orbes ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute" style={{ width: 600, height: 600, top: -200, left: -150, background: 'radial-gradient(circle, rgba(30,95,212,0.18) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute" style={{ width: 500, height: 500, bottom: -150, right: -100, background: 'radial-gradient(circle, rgba(0,201,122,0.14) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute" style={{ width: 400, height: 400, top: '10%', right: '20%', background: 'radial-gradient(circle, rgba(46,184,230,0.09) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        {/* Grade sutil */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-[400px] mx-4 rounded-2xl p-8 flex flex-col gap-6 animate-fade-in"
        style={{
          background: 'rgba(13,27,62,0.70)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,95,212,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Linha gradiente no topo do card */}
        <div
          className="absolute top-0 left-8 right-8 h-[2px] rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #1E5FD4, #2EB8E6, #00C97A, transparent)' }}
        />

        {/* Logo */}
        <div className="flex flex-col items-start gap-1">
          <VencioLogo variant="white" size={36} />
          <p className="text-sm font-medium mt-1" style={{ color: 'rgba(255,255,255,0.45)', paddingLeft: 2 }}>
            Gestão de contratos
          </p>
        </div>

        {/* OAuth */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogle}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60 cursor-pointer"
            style={oauthBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            {loading === 'google' ? <Loader2 size={18} className="animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Entrar com Google
          </button>

          <button
            onClick={handleMicrosoft}
            disabled={loading !== null}
            className="flex items-center justify-center gap-3 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60 cursor-pointer"
            style={oauthBtn}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            {loading === 'microsoft' ? <Loader2 size={18} className="animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 23 23">
                <rect x="1"  y="1"  width="10" height="10" fill="#F25022" />
                <rect x="12" y="1"  width="10" height="10" fill="#7FBA00" />
                <rect x="1"  y="12" width="10" height="10" fill="#00A4EF" />
                <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
              </svg>
            )}
            Entrar com Microsoft
          </button>
        </div>

        {/* Divisor */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>ou</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Form email/senha */}
        <form onSubmit={handleCredentials} className="flex flex-col gap-4">
          {error && (
            <div
              className="text-xs py-2.5 px-3 rounded-lg flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}
            >
              <span>⚠</span> {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@empresa.com.br"
              required
              className="w-full py-2.5 px-4 rounded-xl text-sm outline-none transition-all duration-150"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8EEF8' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(30,95,212,0.6)')}
              onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Senha
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-2.5 px-4 pr-11 rounded-xl text-sm outline-none transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#E8EEF8' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(30,95,212,0.6)')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgba(255,255,255,0.3)' }}
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
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-1 cursor-pointer"
            style={{
              background: loading === 'credentials' ? 'rgba(30,95,212,0.5)' : 'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
              boxShadow: loading === 'credentials' ? 'none' : '0 4px 20px rgba(30,95,212,0.35)',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading === 'credentials' ? (
              <><Loader2 size={16} className="animate-spin" /> Entrando...</>
            ) : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
