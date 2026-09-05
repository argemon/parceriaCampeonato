export function formatNumber(value: number | string | undefined): string {
  const number = Number(value);

  return Number.isFinite(number) ? number.toLocaleString('pt-BR') : '-';
}

export function formatPercent(value: number | string | undefined): string {
  return `${(Number(value) || 0).toFixed(1)}%`;
}
