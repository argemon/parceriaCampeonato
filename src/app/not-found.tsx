import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelCard } from '@/components/ui/panel-card';

export default function NotFoundPage() {
  return (
    <PanelCard title="Página não encontrada">
      <p className="muted">Não encontramos a página ou jogador solicitado.</p>
      <Link className={cn(buttonVariants(), 'w-fit')} href="/ranking">
        Voltar ao ranking
      </Link>
    </PanelCard>
  );
}
