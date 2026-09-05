'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Bars, LineChart } from '@/components/ui/charts';
import { KpiCard } from '@/components/championship/kpi-card';
import { PanelCard } from '@/components/ui/panel-card';
import { DataTable } from '@/components/ui/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatNumber, formatPercent } from '@/domain/championship/formatters';
import type { Player, StatRecord } from '@/domain/championship/types';

type SortMode = 'matches-desc' | 'matches-asc' | 'winrate-desc' | 'winrate-asc';

function buildRelationshipRows(records: Record<string, StatRecord>, labelPrefix: string) {
  return Object.entries(records).map(([label, value]) => ({
    label,
    matches: value.matches,
    winrate: value.winrate,
    hint: `${formatPercent(value.winrate)} de winrate ${labelPrefix} ${label}`,
  }));
}

function sortRelationships<T extends { matches: number; winrate: number }>(items: T[], sortMode: SortMode): T[] {
  return [...items].sort((itemA, itemB) => {
    if (sortMode === 'matches-asc') return itemA.matches - itemB.matches;
    if (sortMode === 'winrate-desc') return itemB.winrate - itemA.winrate;
    if (sortMode === 'winrate-asc') return itemA.winrate - itemB.winrate;

    return itemB.matches - itemA.matches;
  });
}

function RelationshipPanel({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: Array<{ label: string; matches: number; winrate: number; hint: string }>;
}) {
  const [sortMode, setSortMode] = useState<SortMode>('matches-desc');
  const sortedRows = useMemo(() => sortRelationships(rows, sortMode).slice(0, 10), [rows, sortMode]);

  return (
    <PanelCard title={title}>
      <div className="split-toolbar">
        <p className="muted">{description}</p>
        <Select onValueChange={value => setSortMode(value as SortMode)} value={sortMode}>
          <SelectTrigger className="min-w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="matches-desc">Partidas (maior para menor)</SelectItem>
            <SelectItem value="matches-asc">Partidas (menor para maior)</SelectItem>
            <SelectItem value="winrate-desc">Winrate (maior para menor)</SelectItem>
            <SelectItem value="winrate-asc">Winrate (menor para maior)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Bars items={sortedRows.map(row => ({ ...row, value: row.matches }))} />
    </PanelCard>
  );
}

export function PlayerProfile({ player }: { player: Player }) {
  const historyRows = player.history.slice().reverse();
  const roleBars = Object.entries(player.roles).map(([label, value]) => ({ label, value: value.matches }));
  const teammates = buildRelationshipRows(player.teammates, 'jogando com');
  const opponents = buildRelationshipRows(player.opponents, 'jogando contra');

  return (
    <>
      <div className="page-head">
        <h1>{player.name}</h1>
        <Badge variant="outline">Rank #{player.rank}</Badge>
      </div>
      <div className="grid cards">
        <KpiCard label="MMR" value={formatNumber(player.finalMMR)} />
        <KpiCard label="Vitórias" value={player.wins} />
        <KpiCard label="Derrotas" value={player.losses} />
        <KpiCard label="Winrate" value={formatPercent(player.winrate)} hint="Percentual de vitórias" />
      </div>
      <div className="grid two" style={{ marginTop: '1rem' }}>
        <PanelCard title="MMR">
          <LineChart series={[{ name: player.name, values: player.mmrHistory }]} />
        </PanelCard>
        <PanelCard title="Funções">
          <Bars items={roleBars} />
        </PanelCard>
        <RelationshipPanel description="Número de partidas com cada parceiro" rows={teammates} title="Parceiros" />
        <RelationshipPanel description="Número de partidas contra cada rival" rows={opponents} title="Rivais" />
      </div>
      <h2>Histórico</h2>
      <DataTable
        columns={[
          { key: 'match', label: 'Partida', render: row => row.match },
          { key: 'result', label: 'Resultado', render: row => <span className={row.result === 'W' ? 'win' : 'loss'}>{row.result}</span> },
          { key: 'role', label: 'Função', render: row => row.role },
          { key: 'delta', label: 'MMR', render: row => formatNumber(row.delta) },
          { key: 'mmr', label: 'MMR após', render: row => formatNumber(row.mmr) },
        ]}
        rows={historyRows}
      />
    </>
  );
}
