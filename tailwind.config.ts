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
        // Cores base da logo Vencio
        primary: {
          DEFAULT: '#1E5FD4',
          hover:   '#1750B8',
          dark:    '#0D1B3E',
          light:   '#2EB8E6',
          50:      '#EFF6FF',
          100:     '#DBEAFE',
          900:     '#0D1B3E',
        },
        accent: {
          DEFAULT: '#00C97A',
          hover:   '#009E5A',
          dark:    '#007A46',
          50:      '#E6FFF5',
        },
        // Semânticas
        success: { DEFAULT: '#00C97A', bg: '#E6FFF5', text: '#007A46' },
        error:   { DEFAULT: '#EF4444', bg: '#FEF2F2', text: '#B91C1C' },
        warning: { DEFAULT: '#F59E0B', bg: '#FFFBEB', text: '#92400E' },
        info:    { DEFAULT: '#2EB8E6', bg: '#EFF9FF', text: '#1750B8' },
        // Legacy aliases mantidos para compatibilidade
        pri:  { DEFAULT: '#1C3FAA', hover: '#162E80', s: '#EEF2FF', t: '#C7D2FE' },
        ok:   { DEFAULT: '#16A34A', s: '#F0FDF4',  t: '#BBF7D0' },
        err:  { DEFAULT: '#DC2626', s: '#FEF2F2',  t: '#FECACA' },
        warn: { DEFAULT: '#D97706', s: '#FFFBEB',  t: '#FDE68A' },
        pur:  { DEFAULT: '#7C3AED', s: '#F5F3FF',  t: '#DDD6FE' },
      },
      backgroundImage: {
        'gradient-vencio':    'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 50%, #00C97A 100%)',
        'gradient-btn':       'linear-gradient(135deg, #1E5FD4 0%, #2EB8E6 100%)',
        'gradient-accent':    'linear-gradient(135deg, #00C97A 0%, #009E5A 100%)',
        'gradient-sidebar':   'linear-gradient(180deg, #0D1B3E 0%, #132240 100%)',
        'gradient-login-bg':  'radial-gradient(ellipse at 20% 50%, rgba(30,95,212,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,201,122,0.10) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}

export default config
