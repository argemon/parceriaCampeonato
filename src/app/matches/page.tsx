import { MatchesTable } from '@/components/championship/matches-table';
import { getChampionship } from '@/repositories/championship-file-repository';

export default function MatchesPage() {
  const championship = getChampionship();

  return <MatchesTable matches={championship.matches} />;
}
