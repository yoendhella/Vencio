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
        html, body {
          margin: 0; padding: 0;
          background: #0D1B3E !important;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        #vc-page {
          min-height: 100vh;
          width: 100%;
          background-image: url('/vencio_logo_pack/background.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          box-sizing: border-box;
        }
        .vc-card-wrap {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
        }
        .vc-gradient-bar {
          height: 3px;
          background: linear-gradient(90deg, transparent, #1E5FD4, #2EB8E6, #00C97A, transparent);
          border-radius: 3px 3px 0 0;
        }
        .vc-card {
          background: white;
          border: 1px solid rgba(209,220,240,0.60);
          border-top: none;
          border-radius: 0 0 24px 24px;
          box-shadow: 0 32px 80px rgba(13,27,62,0.28);
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .vc-logo-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: 1.75rem;
        }
        .vc-logo-img {
          width: 220px;
          height: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .vc-label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.10em;
          color: #5A6B7D;
          margin-bottom: 7px;
        }
        .vc-input {
          width: 100%;
          padding: 12px 15px;
          background: rgba(240,244,248,0.70);
          border: 1.5px solid rgba(209,220,240,0.80);
          border-radius: 12px;
          color: #0D1B3E;
          font-size: 14px;
          font-weight: 500;
          outline: none;
          transition: all 0.15s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .vc-input:focus {
          border-color: #1E5FD4;
          box-shadow: 0 0 0 3px rgba(30,95,212,0.12);
          background: #fff;
        }
        .vc-btn {
          width: 100%;
          padding: 13px 20px;
          margin-top: 4px;
          background: linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%);
          border: none;
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(30,95,212,0.38);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
        }
        .vc-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(30,95,212,0.50);
        }
        .vc-btn:disabled {
          background: rgba(30,95,212,0.5);
          box-shadow: none;
          cursor: not-allowed;
        }
        .vc-badges {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .vc-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(30,95,212,0.07);
          color: #1E5FD4;
          border: 1px solid rgba(30,95,212,0.15);
          letter-spacing: 0.02em;
        }
        .vc-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(209,220,240,0.50);
        }
        .vc-footer img {
          width: 320px;
          height: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .vc-copyright {
          font-size: 11px;
          color: #8FA3BE;
          font-weight: 500;
          letter-spacing: 0.03em;
        }
      `}</style>

      <div id="vc-page">
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,27,62,0.12)', pointerEvents: 'none' }} />

        <div className="vc-card-wrap">
          <div className="vc-gradient-bar" />

          <div className="vc-card">

            {/* LOGO */}
            <div className="vc-logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vencio_logo_pack/Logo.menu1.png"
                alt="Vencio"
                className="vc-logo-img"
              />
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: '12px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1.5px solid rgba(239,68,68,0.25)',
                  color: '#B91C1C', fontSize: '13px', fontWeight: 500,
                }}>
                  ⚠ {error}
                </div>
              )}

              <div>
                <label className="vc-label">Email</label>
                <input
                  className="vc-input"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  required
                  autoComplete="email"
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="vc-label">Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="vc-input"
                    type={showPassword ? 'text' : 'password'}
                    id="senha"
                    name="senha"
                    value={senha}
                    required
                    autoComplete="current-password"
                    onChange={e => setSenha(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingRight: '46px' }}
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

              <button type="submit" className="vc-btn" disabled={loading}>
                {loading
                  ? <><Loader2 size={17} className="animate-spin" /> Entrando...</>
                  : <>Entrar <ArrowRight size={17} /></>
                }
              </button>

            </form>

            {/* BADGES */}
            <div className="vc-badges">
              <span className="vc-badge">🏢 Organização</span>
              <span className="vc-badge">🔒 Confiança</span>
              <span className="vc-badge">📋 Controle</span>
            </div>

            {/* RODAPÉ */}
            <div className="vc-footer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/vencio_logo_pack/Logo.menu2.png" alt="Vencio" />
              <p className="vc-copyright">
                © {new Date().getFullYear()} Vencio — Todos os direitos reservados
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
