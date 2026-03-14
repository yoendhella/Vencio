'use client';

import Image from 'next/image';
import { useState } from 'react';

type LogoVariant = 'full' | 'icon' | 'white' | 'dark';

interface VencioLogoProps {
  variant?: LogoVariant;
  size?: number;
  className?: string;
  showTagline?: boolean;
}

const LOGO_FILES: Record<LogoVariant, string> = {
  full:  '/brand/vencio_logo_transparent.png',
  white: '/brand/vencio_logo_white.png',
  dark:  '/brand/vencio_logo_transparent.png',
  icon:  '/brand/vencio_icon_128.png',
};

// Fallback SVG puro (sem dependência de arquivo externo)
function VencioSvgFallback({ variant, size }: { variant: LogoVariant; size: number }) {
  const uid = `vg-fb-${variant}-${size}`;
  const isWhite = variant === 'white';

  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={isWhite ? '#ffffff' : '#1E5FD4'} />
            <stop offset="55%"  stopColor={isWhite ? '#ffffff' : '#2EB8E6'} />
            <stop offset="100%" stopColor={isWhite ? '#ffffff' : '#00C97A'} />
          </linearGradient>
        </defs>
        <path d="M8 16 L40 80 L50 60 L28 16 Z" fill={`url(#${uid}-a)`} opacity="0.92" />
        <path d="M92 16 L60 80 L50 60 L72 16 Z" fill={`url(#${uid}-a)`} />
        <path d="M31 52 L44 66 L69 38"
          stroke="white" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        />
      </svg>
      {variant !== 'icon' && (
        <span
          className="font-extrabold tracking-tight leading-none"
          style={{
            fontSize: Math.round(size * 0.78),
            color: isWhite ? '#ffffff' : '#0D1B3E',
          }}
        >
          VENCIO
        </span>
      )}
    </div>
  );
}

export function VencioLogo({
  variant = 'full',
  size = 32,
  className = '',
  showTagline = false,
}: VencioLogoProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className={`flex flex-col ${className}`}>
        <VencioSvgFallback variant={variant} size={size} />
        {showTagline && (
          <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mt-1"
            style={{ paddingLeft: size + 10, color: variant === 'white' ? 'rgba(255,255,255,0.6)' : '#5A6B7D' }}>
            Controle Inteligente de Contratos
          </p>
        )}
      </div>
    );
  }

  const src = LOGO_FILES[variant];
  const isIcon = variant === 'icon';

  return (
    <div className={`flex flex-col ${className}`}>
      <Image
        src={src}
        alt="Vencio"
        width={isIcon ? size : Math.round(size * 4.2)}
        height={size}
        className="object-contain"
        onError={() => setImgError(true)}
        priority
        unoptimized
      />
      {showTagline && (
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mt-1"
          style={{ paddingLeft: size + 10, color: variant === 'white' ? 'rgba(255,255,255,0.6)' : '#5A6B7D' }}>
          Controle Inteligente de Contratos
        </p>
      )}
    </div>
  );
}

export function VencioAppIcon({ size = 56 }: { size?: number }) {
  const [imgError, setImgError] = useState(false);
  const iconSize = Math.round(size * 0.62);

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
      {imgError ? (
        <VencioSvgFallback variant="white" size={iconSize} />
      ) : (
        <Image
          src="/brand/vencio_icon_128.png"
          alt="Vencio"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          onError={() => setImgError(true)}
          priority
          unoptimized
        />
      )}
    </div>
  );
}

export default VencioLogo;
