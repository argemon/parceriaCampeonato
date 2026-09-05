import { HallOfFame } from '@/components/championship/hall-of-fame';
import { getChampionship } from '@/repositories/championship-file-repository';

export default function HallOfFamePage() {
  const championship = getChampionship();

  return <HallOfFame championship={championship} />;
}
