import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Paleta oficial Vencio ──
        primary: {
          DEFAULT: '#1E5FD4',
          hover:   '#1750B8',
          dark:    '#0D1B3E',
          navy:    '#0A1628',
          light:   '#2EB8E6',
          50:      '#EFF6FF',
          100:     '#DBEAFE',
        },
        accent: {
          DEFAULT: '#00C97A',
          hover:   '#009E5A',
          dark:    '#007A46',
          50:      '#E6FFF5',
          100:     '#CCFFE9',
        },
        brand: {
          navy:  '#0D1B3E',
          blue:  '#1E5FD4',
          cyan:  '#2EB8E6',
          green: '#00C97A',
          gray:  '#5A6B7D',
        },
        // ── Semânticas ──
        success: { DEFAULT: '#00C97A', light: '#E6FFF5', dark: '#007A46' },
        error:   { DEFAULT: '#EF4444', light: '#FEF2F2', dark: '#B91C1C' },
        warning: { DEFAULT: '#F59E0B', light: '#FFFBEB', dark: '#92400E' },
        info:    { DEFAULT: '#2EB8E6', light: '#EFF9FF', dark: '#1750B8' },
        // ── Legacy (compatibilidade) ──
        pri:  { DEFAULT: '#1C3FAA', hover: '#162E80', s: '#EEF2FF', t: '#C7D2FE' },
        ok:   { DEFAULT: '#16A34A', s: '#F0FDF4', t: '#BBF7D0' },
        err:  { DEFAULT: '#DC2626', s: '#FEF2F2', t: '#FECACA' },
        warn: { DEFAULT: '#D97706', s: '#FFFBEB', t: '#FDE68A' },
        pur:  { DEFAULT: '#7C3AED', s: '#F5F3FF', t: '#DDD6FE' },
      },

      backgroundImage: {
        'vencio':         'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 50%, #00C97A 100%)',
        'vencio-btn':     'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
        'vencio-green':   'linear-gradient(135deg, #00C97A 0%, #009E5A 100%)',
        'vencio-sidebar': 'linear-gradient(180deg, #0D1B3E 0%, #0A1E3D 50%, #132240 100%)',
        'vencio-dark':    'linear-gradient(145deg, #060D1A 0%, #0D1B3E 100%)',
        // Aliases existentes
        'gradient-vencio':   'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 50%, #00C97A 100%)',
        'gradient-btn':      'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
        'gradient-accent':   'linear-gradient(135deg, #00C97A 0%, #009E5A 100%)',
        'gradient-sidebar':  'linear-gradient(180deg, #0D1B3E 0%, #132240 100%)',
      },

      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },

      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
      },

      borderRadius: {
        DEFAULT: '8px',
        sm:    '6px',
        md:    '8px',
        lg:    '10px',
        xl:    '14px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },

      boxShadow: {
        'card':       '0 1px 3px rgba(13,27,62,0.08), 0 4px 16px rgba(13,27,62,0.06)',
        'card-hover': '0 4px 24px rgba(13,27,62,0.14)',
        'primary':    '0 4px 20px rgba(30,95,212,0.30)',
        'accent':     '0 4px 20px rgba(0,201,122,0.30)',
        'sidebar':    '4px 0 32px rgba(6,13,26,0.40)',
        'glow-blue':  '0 0 40px rgba(30,95,212,0.20)',
        'glow-green': '0 0 40px rgba(0,201,122,0.20)',
      },

      animation: {
        'fade-in':     'fadeIn 0.25s ease-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'pulse-brand': 'pulseBrand 2.5s ease-in-out infinite',
        'loading-bar': 'loadingBar 1.6s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
      },

      keyframes: {
        fadeIn:     { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:    { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseBrand: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.7', transform: 'scale(0.97)' } },
        loadingBar: { '0%': { width: '0%', marginLeft: '0%' }, '50%': { width: '65%', marginLeft: '17%' }, '100%': { width: '0%', marginLeft: '100%' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}

export default config
