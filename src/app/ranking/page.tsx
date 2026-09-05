import { RankingTable } from '@/components/championship/ranking-table';
import { getChampionship } from '@/repositories/championship-file-repository';

export default function RankingPage() {
  const championship = getChampionship();

  return <RankingTable players={championship.ranking} />;
}
