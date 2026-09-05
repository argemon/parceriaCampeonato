'use client';

import { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { pairKey } from '@/domain/championship/keys';
import { formatPercent } from '@/domain/championship/formatters';
import type { Championship, HeadToHeadEntry } from '@/domain/championship/types';

function ResultPanel({ entry, playerA, playerB }: { entry?: HeadToHeadEntry; playerA: string; playerB: string }) {
  if (!entry) {
    return (
      <div className="muted">
        Nenhum confronto direto registrado entre <strong>{playerA}</strong> e <strong>{playerB}</strong>.
      </div>
    );
  }

  return (
    <div className="h2h-result">
      <div>
        <strong>
          Confronto direto: {playerA} vs {playerB}
        </strong>
      </div>
      <div className="h2h-stat-grid">
        <div className="h2h-stat">
          <div className="muted">Mesmo time</div>
          <div className="h2h-stat-value">
            {entry.same.wins}/{entry.same.losses}
          </div>
          <div className="muted">Vitórias / Derrotas</div>
          <div className="gold">{formatPercent(entry.same.winrate)}</div>
        </div>
        <div className="h2h-stat">
          <div className="muted">Adversários</div>
          <div className="h2h-stat-value">
            {entry.opposite.wins}/{entry.opposite.losses}
          </div>
          <div className="muted">Vitórias / Derrotas</div>
          <div className="gold">{formatPercent(entry.opposite.winrate)}</div>
          <div className="muted">% de vitórias para {entry.players[0]} quando jogaram em times opostos</div>
        </div>
      </div>
    </div>
  );
}

export function HeadToHeadPanel({ championship }: { championship: Championship }) {
  const players = useMemo(() => Object.keys(championship.players).sort((a, b) => a.localeCompare(b, 'pt-BR')), [championship.players]);
  const [playerA, setPlayerA] = useState(players[0] || '');
  const [playerB, setPlayerB] = useState(players[1] || players[0] || '');
  const entry = playerA && playerB && playerA !== playerB ? championship.headToHead[pairKey(playerA, playerB)] : undefined;
  const rows = Object.values(championship.headToHead).map(headToHead => ({
    players: headToHead.players.join(' vs '),
    same: `${headToHead.same.wins}/${headToHead.same.losses} (${formatPercent(headToHead.same.winrate)})`,
    opposite: `${headToHead.opposite.wins}/${headToHead.opposite.losses} (${formatPercent(headToHead.opposite.winrate)})`,
  }));

  function changePlayerA(nextPlayer: string) {
    setPlayerA(nextPlayer);
    if (nextPlayer === playerB) {
      setPlayerB(players.find(player => player !== nextPlayer) || playerB);
    }
  }

  function changePlayerB(nextPlayer: string) {
    setPlayerB(nextPlayer);
    if (nextPlayer === playerA) {
      setPlayerA(players.find(player => player !== nextPlayer) || playerA);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Confrontos</h1>
      </div>
      <section className="rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10">
        <div className="h2h-controls">
          <label>
            Jogador A
            <Select onValueChange={value => value && changePlayerA(value)} value={playerA}>
              <SelectTrigger className="min-w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
              {players.map(player => (
                <SelectItem key={player} value={player}>
                  {player}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </label>
          <strong>vs</strong>
          <label>
            Jogador B
            <Select onValueChange={value => value && changePlayerB(value)} value={playerB}>
              <SelectTrigger className="min-w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
              {players.map(player => (
                <SelectItem key={player} value={player}>
                  {player}
                </SelectItem>
              ))}
              </SelectContent>
            </Select>
          </label>
        </div>
        {playerA === playerB ? <div className="muted">Escolha dois jogadores diferentes para ver o confronto direto.</div> : <ResultPanel entry={entry} playerA={playerA} playerB={playerB} />}
      </section>
      <div style={{ marginTop: '1rem' }}>
        <DataTable
          columns={[
            { key: 'players', label: 'Jogadores', render: row => row.players },
            { key: 'same', label: 'Mesmo time V/D', render: row => row.same },
            { key: 'opposite', label: 'Adversários V/D', render: row => row.opposite },
          ]}
          rows={rows}
        />
      </div>
    </>
  );
}
