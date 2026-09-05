import Image from 'next/image';
import { BarTower, Bars } from '@/components/ui/charts';
import { KpiCard } from '@/components/championship/kpi-card';
import { PanelCard } from '@/components/ui/panel-card';
import { formatNumber, formatPercent } from '@/domain/championship/formatters';
import type { Championship } from '@/domain/championship/types';

export function DashboardHome({ championship }: { championship: Championship }) {
  const players = championship.ranking;
  const champion = players[0];
  const top10 = players.slice(0, 10).map(player => ({
    label: player.name,
    value: player.finalMMR,
    matches: player.matches.length,
    winrate: player.winrate,
  }));
  const roleVariety = players
    .map(player => ({
      label: player.name,
      value: Object.keys(player.roles || {}).length,
      winrate: player.winrate,
    }))
    .sort((playerA, playerB) => playerB.value - playerA.value)
    .slice(0, 20);
  const winrateLeader = players.slice().sort((playerA, playerB) => playerB.winrate - playerA.winrate)[0];
  const winsLeader = players.slice().sort((playerA, playerB) => playerB.wins - playerA.wins)[0];
  const lossesLeader = players.slice().sort((playerA, playerB) => playerB.losses - playerA.losses)[0];
  const streakLeader = players.slice().sort((playerA, playerB) => playerB.streaks.bestWin - playerA.streaks.bestWin)[0];

  return (
    <>
      <div className="grid cards">
        <KpiCard label="Campeão" value={champion?.name || '-'} hint={`${formatNumber(champion?.finalMMR)} MMR`} />
        <KpiCard label="Partidas" value={formatNumber(championship.statistics.totalMatches)} />
        <KpiCard label="Jogadores" value={formatNumber(championship.statistics.totalPlayers)} />
        <KpiCard label="Maior winrate" value={winrateLeader?.name || '-'} hint={formatPercent(winrateLeader?.winrate)} />
        <KpiCard label="Maior MMR" value={formatNumber(championship.statistics.maxMMR)} />
        <KpiCard label="Mais vitórias" value={winsLeader?.name || '-'} />
        <KpiCard label="Mais derrotas" value={lossesLeader?.name || '-'} />
        <KpiCard label="Maior sequência" value={streakLeader?.name || '-'} />
      </div>
      <div className="grid two" style={{ marginTop: '1rem' }}>
        <PanelCard title="MMR final Top 10">
          <BarTower items={top10} />
        </PanelCard>
        <PanelCard title="Posições diferentes jogadas">
          <Bars items={roleVariety} />
        </PanelCard>
        <PanelCard title="Partidas por jogador">
          <Bars
            items={players.slice(0, 20).map(player => ({
              label: `${player.name} (${formatPercent(player.winrate)})`,
              value: player.matches.length,
            }))}
          />
        </PanelCard>
      </div>
    </>
  );
}
