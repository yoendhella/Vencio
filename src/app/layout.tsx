import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ContratoPro',
  description: 'Gestão de contratos de prestadores e fornecedores',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
