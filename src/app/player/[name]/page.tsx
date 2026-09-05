import { notFound } from 'next/navigation';
import { PlayerProfile } from '@/components/championship/player-profile';
import { getChampionship } from '@/repositories/championship-file-repository';

type PlayerPageProps = {
  params: Promise<{
    name: string;
  }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { name } = await params;
  const championship = getChampionship();
  const player = championship.players[decodeURIComponent(name)];

  if (!player) {
    notFound();
  }

  return <PlayerProfile player={player} />;
}
