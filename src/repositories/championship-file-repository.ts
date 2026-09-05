import matches from '../../data/matches.json';
import rankingPayload from '../../data/ranking.json';
import { buildChampionship } from '@/domain/championship/championship-engine';
import { extractRanking } from '@/domain/championship/normalizers';
import type { Championship, RankingPayload, RawMatch } from '@/domain/championship/types';

export function getChampionship(): Championship {
  const ranking = extractRanking(rankingPayload as RankingPayload);

  return buildChampionship(ranking, matches as RawMatch[]);
}
