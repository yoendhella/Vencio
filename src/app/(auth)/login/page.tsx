'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        *,*::before,*::after { box-sizing: border-box; }
        html, body, #root, #__next { margin: 0; padding: 0; height: 100%; }

        .vc-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          background-image: url('/vencio_logo_pack/background.jpg');
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
        }

        .vc-card {
          background: rgba(255, 255, 255, 0.90);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border-radius: 22px;
          padding: 44px 52px 40px;
          width: 100%;
          max-width: 460px;
          box-shadow:
            0 8px 48px rgba(15, 31, 75, 0.15),
            0 2px 8px rgba(0, 0, 0, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.8) inset;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .vc-logo-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 36px;
          padding: 0 8px;
        }

        .vc-logo-img {
          width: 100%;
          max-width: 300px;
          height: auto;
          display: block;
          object-fit: contain;
          mix-blend-mode: multiply;
          user-select: none;
          -webkit-user-drag: none;
        }

        .vc-fields {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 22px;
        }

        .vc-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .vc-field label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: #3a5a90;
          text-transform: uppercase;
        }

        .vc-field input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #cddcf5;
          border-radius: 10px;
          font-size: 14.5px;
          color: #0f1f4b;
          background: #f4f8ff;
          outline: none;
          font-family: 'Inter', sans-serif;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }

        .vc-field input::placeholder { color: #a0b4d0; }

        .vc-field input:focus {
          border-color: #1a6fd4;
          background: #fff;
          box-shadow: 0 0 0 3.5px rgba(26, 111, 212, 0.13);
        }

        .vc-inp-wrap { position: relative; width: 100%; }
        .vc-inp-wrap input { padding-right: 46px; }

        .vc-eye {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #7a96bc;
          padding: 4px;
          display: flex;
          align-items: center;
          border-radius: 6px;
          transition: color .15s;
        }
        .vc-eye:hover { color: #1a6fd4; }

        .vc-btn {
          width: 100%;
          padding: 14.5px 24px;
          background: linear-gradient(110deg, #1a4fa0 0%, #1a6fd4 45%, #0ea87a 100%);
          color: white;
          font-size: 15.5px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          letter-spacing: .4px;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 5px 18px rgba(26, 79, 160, .38);
          transition: opacity .18s, transform .14s, box-shadow .18s;
          margin-top: 2px;
        }
        .vc-btn:hover:not(:disabled) { opacity: .91; transform: translateY(-1.5px); box-shadow: 0 8px 24px rgba(26,79,160,.48); }
        .vc-btn:active:not(:disabled) { transform: translateY(0); opacity: 1; }
        .vc-btn:disabled { opacity: .6; cursor: not-allowed; }

        .vc-badges {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-bottom: 16px;
          width: 100%;
        }

        .vc-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 22px;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .9px;
          color: white;
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          border: none;
        }

        .vc-b1 { background: #0d1e4a; }
        .vc-b2 { background: #1a4fa0; }
        .vc-b3 { background: #0a7a5e; }

        .vc-copy { font-size: 11.5px; color: #8fa5c5; text-align: center; }

        .vc-error {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239, 68, 68, 0.08);
          border: 1.5px solid rgba(239, 68, 68, 0.25);
          color: #B91C1C;
          font-size: 13px;
          font-weight: 500;
        }

        @media (max-width: 520px) {
          .vc-card { padding: 36px 24px 30px; margin: 16px; }
          .vc-logo-img { max-width: 240px; }
          .vc-badges { flex-wrap: wrap; }
        }
      `}</style>

      <div className="vc-page">
        <div className="vc-card">

          <div className="vc-logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="vc-logo-img"
              src="/vencio_logo_pack/Logo.menu1.png"
              alt="Vencio — Controle Inteligente de Contratos"
              draggable={false}
            />
          </div>

          <form onSubmit={handleSubmit} className="vc-fields">

            {error && <div className="vc-error">⚠ {error}</div>}

            <div className="vc-field">
              <label htmlFor="vc-email">Email</label>
              <input
                id="vc-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="vc-field">
              <label htmlFor="vc-pw">Senha</label>
              <div className="vc-inp-wrap">
                <input
                  id="vc-pw"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="vc-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="vc-btn" disabled={loading}>
              {loading ? (
                <><Loader2 size={17} className="animate-spin" /> Entrando...</>
              ) : (
                <>
                  Entrar
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="vc-badges">
            <span className="vc-badge vc-b1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Organização
            </span>
            <span className="vc-badge vc-b2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Confiança
            </span>
            <span className="vc-badge vc-b3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Controle
            </span>
          </div>

          <p className="vc-copy">© {new Date().getFullYear()} Vencio — Todos os direitos reservados</p>

        </div>
      </div>
    </>
  );
}
