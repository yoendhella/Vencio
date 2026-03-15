'use client';

// ══════════════════════════════════════════════
// VENCIO LOGO — 6 variações do brand board oficial
// ══════════════════════════════════════════════

type IconVariant =
  | 'default'      // 1. V gradiente (principal)
  | 'square-navy'  // 2. V quadrado navy (app icon)
  | 'square-green' // 3. Checkmark quadrado verde
  | 'calendar'     // 4. Calendário com check
  | 'circle'       // 5. V círculo azul
  | 'outline';     // 6. V outline verde

interface VencioIconProps {
  variant?: IconVariant;
  size?: number;
  className?: string;
}

export function VencioIcon({ variant = 'default', size = 32, className = '' }: VencioIconProps) {
  const id = `vi-${variant}-${size}`;

  // ── 1. V GRADIENTE PRINCIPAL ──
  if (variant === 'default') return (
    <svg width={size} height={size} viewBox="0 0 88 88" fill="none" className={className}>
      <defs>
        {/* Azul ciano — perna esquerda/frente */}
        <linearGradient id={`${id}-lc`} x1="8" y1="6" x2="44" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#14C8FF" />
          <stop offset="55%"  stopColor="#009ED8" />
          <stop offset="100%" stopColor="#0068B8" />
        </linearGradient>
        {/* Navy escuro — camada traseira (profundidade 3D) */}
        <linearGradient id={`${id}-ld`} x1="25" y1="6" x2="65" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#003888" />
          <stop offset="100%" stopColor="#001A50" />
        </linearGradient>
        {/* Verde-teal — perna direita */}
        <linearGradient id={`${id}-lg`} x1="44" y1="6" x2="80" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#00CC9A" />
          <stop offset="100%" stopColor="#009898" />
        </linearGradient>
      </defs>
      {/* V traseiro navy — efeito de profundidade 3D */}
      <path d="M20 8 L44 74 L68 8 L58 8 L44 56 L30 8 Z"
        fill={`url(#${id}-ld)`} transform="translate(4,4)" opacity="0.85" />
      {/* V principal — azul ciano */}
      <path d="M8 8 L44 80 L80 8 L68 8 L44 60 L20 8 Z"
        fill={`url(#${id}-lc)`} />
      {/* Perna direita — verde-teal */}
      <path d="M44 60 L68 8 L80 8 L44 80 Z"
        fill={`url(#${id}-lg)`} opacity="0.92" />
      {/* Checkmark branco espesso */}
      <path d="M22 46 L38 63 L70 28"
        fill="none" stroke="white" strokeWidth="8.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Highlight sutil */}
      <ellipse cx="22" cy="18" rx="10" ry="6"
        fill="white" opacity="0.15" transform="rotate(-20 22 18)" />
    </svg>
  );

  // ── 2. V QUADRADO NAVY (app icon) ──
  if (variant === 'square-navy') return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0D1B3E" />
          <stop offset="100%" stopColor="#132240" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#${id}-bg)`} />
      <path d="M18 22 L44 72 L50 58 L30 22 Z"  fill="white" opacity="0.9" />
      <path d="M82 22 L56 72 L50 58 L70 22 Z"  fill="white" />
      <path d="M33 53 L44 66 L67 41" stroke="#00C97A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  // ── 3. CHECKMARK QUADRADO VERDE ──
  if (variant === 'square-green') return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#00C97A" />
          <stop offset="100%" stopColor="#009E5A" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#${id}-g)`} />
      <path d="M25 50 L42 68 L75 32" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  // ── 4. CALENDÁRIO COM CHECK ──
  if (variant === 'calendar') return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <rect x="10" y="18" width="80" height="72" rx="12" fill="none" stroke="#0D1B3E" strokeWidth="6" />
      <line x1="10" y1="38" x2="90" y2="38" stroke="#0D1B3E" strokeWidth="5" />
      <line x1="32" y1="10" x2="32" y2="26" stroke="#1E5FD4" strokeWidth="6" strokeLinecap="round" />
      <line x1="68" y1="10" x2="68" y2="26" stroke="#1E5FD4" strokeWidth="6" strokeLinecap="round" />
      <path d="M30 60 L44 74 L70 48" stroke="#00C97A" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  // ── 5. V CÍRCULO AZUL ──
  if (variant === 'circle') return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <defs>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1E5FD4" />
          <stop offset="100%" stopColor="#2EB8E6" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id}-c)`} />
      <path d="M20 28 L44 72 L50 58 L32 28 Z"  fill="white" opacity="0.92" />
      <path d="M80 28 L56 72 L50 58 L68 28 Z"  fill="white" />
      <path d="M33 52 L44 64 L67 40" stroke="#00C97A" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  // ── 6. V OUTLINE VERDE ──
  if (variant === 'outline') return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
      <path d="M8 16 L40 82 L50 60 L27 16 Z"  fill="none" stroke="#00C97A" strokeWidth="4" strokeLinejoin="round" />
      <path d="M92 16 L60 82 L50 60 L73 16 Z" fill="none" stroke="#00C97A" strokeWidth="4" strokeLinejoin="round" />
      <path d="M29 52 L43 68 L71 37" stroke="#1E5FD4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  return null;
}

// ── LOGO COMPLETO (ícone + texto) ──
interface VencioLogoProps {
  variant?: 'light' | 'dark' | 'white';
  size?: number;
  className?: string;
  showTagline?: boolean;
}

export function VencioLogo({ variant = 'dark', size = 32, className = '', showTagline = false }: VencioLogoProps) {
  const textColor =
    variant === 'white' ? '#FFFFFF' :
    variant === 'light' ? '#0D1B3E' :
    'var(--text-primary)';

  const tagColor =
    variant === 'white' ? 'rgba(255,255,255,0.5)' : 'var(--text-secondary)';

  return (
    <div className={`flex flex-col ${className}`} style={{ userSelect: 'none' }}>
      <div className="flex items-center" style={{ gap: Math.round(size * 0.28) }}>
        <VencioIcon variant="default" size={size} />
        <span style={{
          fontSize: Math.round(size * 0.75),
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: textColor,
          lineHeight: 1,
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        }}>
          VENCIO
        </span>
      </div>
      {showTagline && (
        <p style={{
          fontSize: Math.round(size * 0.26),
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: tagColor,
          paddingLeft: size + Math.round(size * 0.28),
          marginTop: 4,
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        }}>
          Controle Inteligente de Contratos
        </p>
      )}
    </div>
  );
}

// ── APP ICON (sidebar colapsada) ──
export function VencioAppIcon({ size = 48 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.22),
      background: 'linear-gradient(145deg, #0D1B3E 0%, #132240 100%)',
      boxShadow: '0 4px 20px rgba(13,27,62,0.5), 0 0 0 1px rgba(30,95,212,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <VencioIcon variant="default" size={Math.round(size * 0.60)} />
    </div>
  );
}

export default VencioLogo;
