'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { formatNumber, formatPercent } from '@/domain/championship/formatters';
import type { Player } from '@/domain/championship/types';

export function RankingTable({ players }: { players: Player[] }) {
  const [search, setSearch] = useState('');
  const filteredPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return players;

    return players.filter(player => player.name.toLowerCase().includes(normalizedSearch));
  }, [players, search]);

  return (
    <>
      <div className="page-head">
        <h1>Ranking</h1>
        <Input
          className="max-w-xs"
          onChange={event => setSearch(event.target.value)}
          placeholder="Buscar jogador"
          type="search"
          value={search}
        />
      </div>
      <DataTable
        columns={[
          { key: 'rank', label: '#', render: player => player.rank },
          {
            key: 'name',
            label: 'Jogador',
            render: player => (
              <Link className="gold" href={`/player/${encodeURIComponent(player.name)}`}>
                {player.name}
              </Link>
            ),
          },
          { key: 'finalMMR', label: 'MMR', render: player => formatNumber(player.finalMMR) },
          { key: 'wins', label: 'Vitórias', render: player => player.wins },
          { key: 'losses', label: 'Derrotas', render: player => player.losses },
          { key: 'winrate', label: 'Winrate', render: player => formatPercent(player.winrate) },
        ]}
        rows={filteredPlayers}
      />
    </>
  );
}
