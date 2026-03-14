import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'Vencio — Controle Inteligente de Contratos',
    template: '%s | Vencio',
  },
  description: 'Sistema de controle inteligente de contratos — organização, confiança e controle de vencimentos.',
  keywords: ['contratos', 'gestão', 'vencimentos', 'controle', 'empresas'],
  authors: [{ name: 'Vencio' }],

  icons: {
    icon: [
      { url: '/brand/vencio_icon.svg',    type: 'image/svg+xml' },
      { url: '/brand/vencio_icon_32.png', type: 'image/png', sizes: '32x32' },
      { url: '/brand/vencio_icon_128.png', type: 'image/png', sizes: '128x128' },
      { url: '/brand/vencio_icon_512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/brand/vencio_icon_1024.png', sizes: '180x180' },
    ],
    shortcut: '/brand/vencio_icon_32.png',
  },

  openGraph: {
    title: 'Vencio — Controle Inteligente de Contratos',
    description: 'Gerencie seus contratos com inteligência.',
    url: 'https://vencio.vercel.app',
    siteName: 'Vencio',
    images: [
      {
        url: '/brand/vencio_icon_512.png',
        width: 512,
        height: 512,
        alt: 'Vencio Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
