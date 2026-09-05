import { INITIAL_MMR, ROLES } from './constants';
import { pairKey, teamKey } from './keys';
import { getSide, normalizePlayerEntry, winnerSide } from './normalizers';
import type {
  Championship,
  ChampionshipStatistics,
  GroupStat,
  HeadToHeadEntry,
  MatchSide,
  Player,
  PlayerMatchEntry,
  RawMatch,
  RawRankingEntry,
  StatRecord,
} from './types';

function createEmptyPlayer(name: string): Player {
  return {
    name,
    rank: 0,
    initialMMR: INITIAL_MMR,
    currentMMR: INITIAL_MMR,
    finalMMR: INITIAL_MMR,
    wins: 0,
    losses: 0,
    winrate: 0,
    matches: [],
    roles: {},
    teammates: {},
    opponents: {},
    history: [],
    mmrHistory: [INITIAL_MMR],
    streaks: {
      currentWin: 0,
      currentLoss: 0,
      bestWin: 0,
      bestLoss: 0,
    },
    records: {
      bestGain: 0,
      worstLoss: 0,
    },
  };
}

function createStatRecord(): StatRecord {
  return {
    matches: 0,
    wins: 0,
    losses: 0,
    winrate: 0,
  };
}

function incrementStat(records: Record<string, StatRecord>, key: string, win: boolean): void {
  records[key] ??= createStatRecord();
  records[key].matches += 1;
  records[key][win ? 'wins' : 'losses'] += 1;
  records[key].winrate = (records[key].wins / records[key].matches) * 100;
}

function readRankingFields(row: RawRankingEntry, index: number) {
  return {
    name: row.name || row.player || row.jogador || row.nome || `Jogador ${index + 1}`,
    rank: Number(row.rank || row.position || row.posicao || index + 1),
    finalMMR: Number(row.finalMMR || row.mmrFinal || row.mmr || row.currentMMR || INITIAL_MMR),
    wins: Number(row.wins || row.vitorias || 0),
    losses: Number(row.losses || row.derrotas || 0),
    winrate: Number(row.winrate || 0),
  };
}

export function buildChampionship(rawRanking: RawRankingEntry[] = [], rawMatches: RawMatch[] = []): Championship {
  const championship: Championship = {
    players: {},
    ranking: [],
    matches: [],
    headToHead: {},
    duos: {},
    teams: {},
    timeline: [],
    statistics: {
      totalMatches: 0,
      totalPlayers: 0,
      initialMMR: INITIAL_MMR,
      maxMMR: 0,
      minMMR: 0,
      bestGain: 0,
      worstLoss: 0,
      roles: [],
    },
  };

  rawRanking.forEach((row, index) => {
    const fields = readRankingFields(row, index);

    championship.players[fields.name] = {
      ...createEmptyPlayer(fields.name),
      rank: fields.rank,
      finalMMR: fields.finalMMR,
      records: {
        ...createEmptyPlayer(fields.name).records,
        reportedWins: fields.wins,
        reportedLosses: fields.losses,
        reportedWinrate: fields.winrate,
      },
    };
  });

  rawMatches.forEach((match, index) => processMatch(championship, match, index + 1));

  Object.values(championship.players).forEach(player => {
    player.winrate = player.matches.length ? (player.wins / player.matches.length) * 100 : player.winrate;
  });

  championship.ranking = Object.values(championship.players)
    .sort((playerA, playerB) => playerB.finalMMR - playerA.finalMMR)
    .map((player, index) => ({ ...player, rank: index + 1 }));
  championship.statistics = buildStats(championship);

  return championship;
}

function processMatch(championship: Championship, match: RawMatch, matchNumber: number): void {
  const blue = getSide(match, 'blue').map(normalizePlayerEntry);
  const red = getSide(match, 'red').map(normalizePlayerEntry);
  const winner = winnerSide(match);
  const blueWin = winner === 'blue' || blue.some(player => player.name === match.winner);
  const sides: Array<{ name: MatchSide; team: PlayerMatchEntry[]; win: boolean }> = [
    { name: 'blue', team: blue, win: blueWin },
    { name: 'red', team: red, win: !blueWin },
  ];

  championship.matches.push({
    id: matchNumber,
    raw: match,
    blue,
    red,
    winner: blueWin ? 'blue' : 'red',
  });

  sides.forEach(side => {
    const opponents = side.name === 'blue' ? red : blue;

    side.team.forEach(player => updatePlayerFromMatch(championship, player, side, opponents, matchNumber));
    addSameSidePairs(championship, side.team, side.win);
    addTeam(championship, side.team, side.win);
  });

  addOpponentPairs(championship, blue, red, blueWin);
  championship.timeline.push({
    match: matchNumber,
    ranking: Object.values(championship.players)
      .map(player => ({
        name: player.name,
        mmr: player.currentMMR,
        wins: player.wins,
        losses: player.losses,
      }))
      .sort((playerA, playerB) => playerB.mmr - playerA.mmr),
  });
}

function updatePlayerFromMatch(
  championship: Championship,
  matchPlayer: PlayerMatchEntry,
  side: { name: MatchSide; team: PlayerMatchEntry[]; win: boolean },
  opponents: PlayerMatchEntry[],
  matchNumber: number,
): void {
  const player = (championship.players[matchPlayer.name] ??= createEmptyPlayer(matchPlayer.name));

  player.currentMMR += matchPlayer.lp;
  player[side.win ? 'wins' : 'losses'] += 1;
  player.matches.push(matchNumber);
  player.history.push({
    match: matchNumber,
    result: side.win ? 'W' : 'L',
    role: matchPlayer.role,
    delta: matchPlayer.lp,
    mmr: player.currentMMR,
    side: side.name,
  });
  player.mmrHistory.push(player.currentMMR);
  player.records.bestGain = Math.max(player.records.bestGain, matchPlayer.lp);
  player.records.worstLoss = Math.min(player.records.worstLoss, matchPlayer.lp);

  if (side.win) {
    player.streaks.currentWin += 1;
    player.streaks.currentLoss = 0;
  } else {
    player.streaks.currentLoss += 1;
    player.streaks.currentWin = 0;
  }

  player.streaks.bestWin = Math.max(player.streaks.bestWin, player.streaks.currentWin);
  player.streaks.bestLoss = Math.max(player.streaks.bestLoss, player.streaks.currentLoss);

  incrementStat(player.roles, matchPlayer.role, side.win);
  side.team
    .filter(teammate => teammate.name !== matchPlayer.name)
    .forEach(teammate => incrementStat(player.teammates, teammate.name, side.win));
  opponents.forEach(opponent => incrementStat(player.opponents, opponent.name, side.win));
}

function addSameSidePairs(championship: Championship, team: PlayerMatchEntry[], win: boolean): void {
  for (let i = 0; i < team.length; i += 1) {
    for (let j = i + 1; j < team.length; j += 1) {
      addDuo(championship, team[i].name, team[j].name, win);
      addHeadToHead(championship, team[i].name, team[j].name, true, win);
    }
  }
}

function addOpponentPairs(championship: Championship, blue: PlayerMatchEntry[], red: PlayerMatchEntry[], blueWin: boolean): void {
  blue.forEach(bluePlayer => {
    red.forEach(redPlayer => {
      const [firstPlayer] = pairKey(bluePlayer.name, redPlayer.name).split('::');

      addHeadToHead(championship, bluePlayer.name, redPlayer.name, false, firstPlayer === bluePlayer.name ? blueWin : !blueWin);
    });
  });
}

function addHeadToHead(championship: Championship, playerA: string, playerB: string, sameTeam: boolean, win: boolean): void {
  const key = pairKey(playerA, playerB);
  championship.headToHead[key] ??= {
    players: key.split('::'),
    same: createStatRecord(),
    opposite: createStatRecord(),
  } satisfies HeadToHeadEntry;
  const record = sameTeam ? championship.headToHead[key].same : championship.headToHead[key].opposite;

  record.matches += 1;
  record[win ? 'wins' : 'losses'] += 1;
  record.winrate = (record.wins / record.matches) * 100;
}

function addDuo(championship: Championship, playerA: string, playerB: string, win: boolean): void {
  const key = pairKey(playerA, playerB);
  championship.duos[key] ??= {
    players: key.split('::'),
    ...createStatRecord(),
  } satisfies GroupStat;
  const duo = championship.duos[key];

  duo.matches += 1;
  duo[win ? 'wins' : 'losses'] += 1;
  duo.winrate = (duo.wins / duo.matches) * 100;
}

function addTeam(championship: Championship, team: PlayerMatchEntry[], win: boolean): void {
  const key = teamKey(team);
  championship.teams[key] ??= {
    players: key.split('::'),
    ...createStatRecord(),
  } satisfies GroupStat;
  const fullTeam = championship.teams[key];

  fullTeam.matches += 1;
  fullTeam[win ? 'wins' : 'losses'] += 1;
  fullTeam.winrate = (fullTeam.wins / fullTeam.matches) * 100;
}

function buildStats(championship: Championship): ChampionshipStatistics {
  const players = Object.values(championship.players);
  const deltas = players.flatMap(player => player.history.map(history => history.delta));

  return {
    totalMatches: championship.matches.length,
    totalPlayers: players.length,
    initialMMR: INITIAL_MMR,
    maxMMR: Math.max(...players.map(player => player.finalMMR), 0),
    minMMR: Math.min(...players.map(player => player.finalMMR), 0),
    bestGain: Math.max(...deltas, 0),
    worstLoss: Math.min(...deltas, 0),
    roles: ROLES.map(role => ({
      role,
      matches: players.reduce((sum, player) => sum + (player.roles[role]?.matches || 0), 0),
    })),
  };
}
