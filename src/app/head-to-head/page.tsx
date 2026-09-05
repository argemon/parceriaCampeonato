import { HeadToHeadPanel } from '@/components/championship/head-to-head-panel';
import { getChampionship } from '@/repositories/championship-file-repository';

export default function HeadToHeadPage() {
  const championship = getChampionship();

  return <HeadToHeadPanel championship={championship} />;
}
