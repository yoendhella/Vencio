'use client';

import React from 'react';

type LogoVariant = 'full' | 'icon' | 'white' | 'dark';

interface VencioLogoProps {
  variant?: LogoVariant;
  size?: number;
  className?: string;
  showTagline?: boolean;
}

export function VencioLogo({
  variant = 'full',
  size = 32,
  className = '',
  showTagline = false,
}: VencioLogoProps) {
  const uid = `vg-${variant}-${size}`;

  const LogoIcon = () => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1E5FD4" />
          <stop offset="55%"  stopColor="#2EB8E6" />
          <stop offset="100%" stopColor="#00C97A" />
        </linearGradient>
        <linearGradient id={`${uid}-b`} x1="30" y1="45" x2="70" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#2EB8E6" />
          <stop offset="100%" stopColor="#00C97A" />
        </linearGradient>
      </defs>
      <path d="M8 16 L40 80 L50 60 L28 16 Z" fill={`url(#${uid}-a)`} opacity="0.92" />
      <path d="M92 16 L60 80 L50 60 L72 16 Z" fill={`url(#${uid}-a)`} />
      <path d="M31 52 L44 66 L69 38"
        stroke={variant === 'white' ? 'white' : `url(#${uid}-b)`}
        strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );

  if (variant === 'icon') return <LogoIcon />;

  const isWhite = variant === 'white';
  const nameColor = isWhite ? 'text-white' : 'text-[#0D1B3E] dark:text-white';
  const tagColor  = isWhite ? 'text-white/60' : 'text-[#5A6B7D] dark:text-[#8FA3BE]';

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2.5">
        <LogoIcon />
        <span
          className={`font-extrabold tracking-tight leading-none ${nameColor}`}
          style={{ fontSize: Math.round(size * 0.78) }}
        >
          VENCIO
        </span>
      </div>
      {showTagline && (
        <p
          className={`text-[10px] font-semibold tracking-[0.18em] uppercase mt-1 ${tagColor}`}
          style={{ paddingLeft: size + 10 }}
        >
          Controle Inteligente de Contratos
        </p>
      )}
    </div>
  );
}

export function VencioAppIcon({ size = 56 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        background: 'linear-gradient(145deg, #0D1B3E 0%, #132240 100%)',
        boxShadow: '0 4px 16px rgba(13,27,62,0.45)',
      }}
    >
      <VencioLogo variant="white" size={Math.round(size * 0.58)} />
    </div>
  );
}

export default VencioLogo;
