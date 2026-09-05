export type Role = 'TOP' | 'JNG' | 'MID' | 'ADC' | 'SUP' | 'UNK';

export type MatchSide = 'blue' | 'red';

export type RawRankingEntry = {
  name?: string;
  player?: string;
  jogador?: string;
  nome?: string;
  rank?: number | string;
  position?: number | string;
  posicao?: number | string;
  finalMMR?: number | string;
  mmrFinal?: number | string;
  mmr?: number | string;
  currentMMR?: number | string;
  wins?: number | string;
  vitorias?: number | string;
  losses?: number | string;
  derrotas?: number | string;
  winrate?: number | string;
};

export type RankingPayload =
  | RawRankingEntry[]
  | {
      championship?: {
        players?: RawRankingEntry[];
      };
      players?: RawRankingEntry[];
    };

export type RawPlayerEntry = {
  name?: string;
  player?: string;
  jogador?: string;
  nome?: string;
  role?: string;
  funcao?: string;
  cargo?: string;
  lp?: number | string;
  mmr?: number | string;
  delta?: number | string;
};

export type RawMatch = {
  winner?: string;
  vencedor?: string;
  blue?: RawPlayerEntry[];
  red?: RawPlayerEntry[];
  blueTeam?: RawPlayerEntry[];
  redTeam?: RawPlayerEntry[];
  teams?: {
    blue?: RawPlayerEntry[];
    red?: RawPlayerEntry[];
  };
};

export type PlayerMatchEntry = {
  name: string;
  role: Role;
  lp: number;
};

export type StatRecord = {
  matches: number;
  wins: number;
  losses: number;
  winrate: number;
};

export type PlayerHistoryEntry = {
  match: number;
  result: 'W' | 'L';
  role: Role;
  delta: number;
  mmr: number;
  side: MatchSide;
};

export type PlayerRecords = {
  bestGain: number;
  worstLoss: number;
  reportedWins?: number;
  reportedLosses?: number;
  reportedWinrate?: number;
};

export type Player = {
  name: string;
  rank: number;
  initialMMR: number;
  currentMMR: number;
  finalMMR: number;
  wins: number;
  losses: number;
  winrate: number;
  matches: number[];
  roles: Record<string, StatRecord>;
  teammates: Record<string, StatRecord>;
  opponents: Record<string, StatRecord>;
  history: PlayerHistoryEntry[];
  mmrHistory: number[];
  streaks: {
    currentWin: number;
    currentLoss: number;
    bestWin: number;
    bestLoss: number;
  };
  records: PlayerRecords;
};

export type ProcessedMatch = {
  id: number;
  raw: RawMatch;
  blue: PlayerMatchEntry[];
  red: PlayerMatchEntry[];
  winner: MatchSide;
};

export type HeadToHeadEntry = {
  players: string[];
  same: StatRecord;
  opposite: StatRecord;
};

export type GroupStat = StatRecord & {
  players: string[];
};

export type TimelineEntry = {
  match: number;
  ranking: Array<{
    name: string;
    mmr: number;
    wins: number;
    losses: number;
  }>;
};

export type ChampionshipStatistics = {
  totalMatches: number;
  totalPlayers: number;
  initialMMR: number;
  maxMMR: number;
  minMMR: number;
  bestGain: number;
  worstLoss: number;
  roles: Array<{
    role: string;
    matches: number;
  }>;
};

export type Championship = {
  players: Record<string, Player>;
  ranking: Player[];
  matches: ProcessedMatch[];
  headToHead: Record<string, HeadToHeadEntry>;
  duos: Record<string, GroupStat>;
  teams: Record<string, GroupStat>;
  timeline: TimelineEntry[];
  statistics: ChampionshipStatistics;
};
