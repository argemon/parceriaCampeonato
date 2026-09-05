import { DashboardHome } from '@/components/championship/dashboard-home';
import { getChampionship } from '@/repositories/championship-file-repository';

export default function HomePage() {
  const championship = getChampionship();

  return <DashboardHome championship={championship} />;
}
