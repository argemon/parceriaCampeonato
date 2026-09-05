import type { PlayerMatchEntry } from './types';

export function pairKey(playerA: string, playerB: string): string {
  return [playerA, playerB].sort((a, b) => a.localeCompare(b)).join('::');
}

export function teamKey(team: PlayerMatchEntry[]): string {
  return team.map(player => player.name).sort((a, b) => a.localeCompare(b)).join('::');
}
