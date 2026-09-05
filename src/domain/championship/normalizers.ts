import type { MatchSide, RankingPayload, RawMatch, RawPlayerEntry, RawRankingEntry, Role } from './types';

export function extractRanking(data: RankingPayload): RawRankingEntry[] {
  if (Array.isArray(data)) return data;
  if (data.championship?.players) return data.championship.players;
  if (data.players) return data.players;

  return [];
}

export function normalizeRole(role: string | undefined): Role {
  const normalized = String(role || 'UNK')
    .toUpperCase()
    .replace('JUNGLE', 'JNG')
    .replace('BOTTOM', 'ADC')
    .replace('UTILITY', 'SUP');

  if (['TOP', 'JNG', 'MID', 'ADC', 'SUP'].includes(normalized)) {
    return normalized as Role;
  }

  return 'UNK';
}

export function normalizePlayerEntry(row: RawPlayerEntry) {
  return {
    name: row.name || row.player || row.jogador || row.nome || 'Sem nome',
    role: normalizeRole(row.role || row.funcao || row.cargo),
    lp: Number(row.lp ?? row.mmr ?? row.delta ?? 0),
  };
}

export function getSide(match: RawMatch, side: MatchSide): RawPlayerEntry[] {
  return match[side] || match[`${side}Team`] || match.teams?.[side] || [];
}

export function winnerSide(match: RawMatch): MatchSide | string {
  const winner = String(match.winner || match.vencedor || '').toLowerCase();

  if (['blue', 'azul'].includes(winner)) return 'blue';
  if (['red', 'vermelho'].includes(winner)) return 'red';

  return winner;
}
