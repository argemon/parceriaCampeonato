import { PanelCard } from '@/components/ui/panel-card';
import { formatNumber, formatPercent } from '@/domain/championship/formatters';
import type { Championship, Player } from '@/domain/championship/types';

function FameItem({ title, value }: { title: string; value: string }) {
  return (
    <PanelCard title={title}>
      <p className="value gold">{value}</p>
    </PanelCard>
  );
}

function playerName(player?: Player): string {
  return player?.name || '-';
}

export function HallOfFame({ championship }: { championship: Championship }) {
  const players = championship.ranking;
  const winrateLeader = players.slice().sort((playerA, playerB) => playerB.winrate - playerA.winrate)[0];
  const bestDuo = Object.values(championship.duos).sort((duoA, duoB) => duoB.winrate - duoA.winrate || duoB.matches - duoA.matches)[0];
  const bestTeam = Object.values(championship.teams).sort((teamA, teamB) => teamB.winrate - teamA.winrate || teamB.matches - teamA.matches)[0];
  const firstPlayerWithMmr = (mmr: number) => playerName(players.find(player => player.mmrHistory.some(value => value >= mmr)));
  const bestGainPlayer = playerName(players.find(player => player.records.bestGain === championship.statistics.bestGain));
  const worstLossPlayer = playerName(players.find(player => player.records.worstLoss === championship.statistics.worstLoss));

  return (
    <>
      <div className="page-head">
        <h1>Hall da Fama</h1>
      </div>
      <div className="grid three">
        <FameItem title="Maior MMR" value={`${playerName(players[0])} · ${formatNumber(players[0]?.finalMMR)}`} />
        <FameItem title="Maior ganho" value={`${bestGainPlayer} · ${formatNumber(championship.statistics.bestGain)}`} />
        <FameItem title="Maior perda" value={`${worstLossPlayer} · ${formatNumber(championship.statistics.worstLoss)}`} />
        <FameItem title="Melhor winrate" value={winrateLeader ? `${winrateLeader.name} · ${formatPercent(winrateLeader.winrate)}` : '-'} />
        <FameItem title="Mais vitórias" value={playerName(players.slice().sort((playerA, playerB) => playerB.wins - playerA.wins)[0])} />
        <FameItem title="Mais derrotas" value={playerName(players.slice().sort((playerA, playerB) => playerB.losses - playerA.losses)[0])} />
        <FameItem title="Melhor dupla" value={bestDuo ? `${bestDuo.players.join(' + ')} · ${formatPercent(bestDuo.winrate)}` : '-'} />
        <FameItem title="Melhor quinteto" value={bestTeam ? `${bestTeam.players.join(', ')} · ${formatPercent(bestTeam.winrate)}` : '-'} />
        <FameItem title="Maior sequência V" value={playerName(players.slice().sort((playerA, playerB) => playerB.streaks.bestWin - playerA.streaks.bestWin)[0])} />
        <FameItem title="Maior sequência D" value={playerName(players.slice().sort((playerA, playerB) => playerB.streaks.bestLoss - playerA.streaks.bestLoss)[0])} />
        <FameItem title="Mais versátil" value={playerName(players.slice().sort((playerA, playerB) => Object.keys(playerB.roles).length - Object.keys(playerA.roles).length)[0])} />
        {[1000, 1500, 2000, 2500, 3000].map(mmr => (
          <FameItem key={mmr} title={`Primeiro ${mmr} MMR`} value={firstPlayerWithMmr(mmr)} />
        ))}
        <FameItem title="Maior evolução" value={playerName(players.slice().sort((playerA, playerB) => playerB.finalMMR - playerB.initialMMR - (playerA.finalMMR - playerA.initialMMR))[0])} />
        <FameItem title="Maior queda" value={playerName(players.slice().sort((playerA, playerB) => playerA.finalMMR - playerA.initialMMR - (playerB.finalMMR - playerB.initialMMR))[0])} />
      </div>
    </>
  );
}
