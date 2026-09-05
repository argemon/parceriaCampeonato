import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import { MainNavigation } from '@/components/layout/main-navigation';
import { cn } from '@/lib/utils';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Parceria Championship Dashboard',
  description: 'Dashboard de estatísticas do Campeonato Parceria Vive 2026.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={cn('font-sans select-none', geist.variable)} data-scroll-behavior="smooth" lang="pt-BR">
      <body>
        <header className="app-header">
          <Link className="brand" href="/">
            <span aria-hidden="true">⚔</span>
            <span>Parceria Championship 2</span>
          </Link>
          <MainNavigation />
        </header>
        <main className="app-main">{children}</main>
      </body>
    </html>
  );
}
