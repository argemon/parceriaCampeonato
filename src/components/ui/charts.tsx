type LineSeries = {
  name: string;
  values: number[];
};

export type BarItem = {
  label: string;
  value: number;
  matches?: number;
  winrate?: number;
  hint?: string;
};

export function LineChart({ series }: { series: LineSeries[] }) {
  const width = 900;
  const height = 280;
  const padding = 24;
  const values = series.flatMap(item => item.values);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const longestSeries = Math.max(...series.map(item => item.values.length), 1);
  const scaleX = (index: number) => padding + index * ((width - padding * 2) / Math.max(1, longestSeries - 1));
  const scaleY = (value: number) => height - padding - ((value - min) / (max - min || 1)) * (height - padding * 2);
  const colors = ['#f0d084', '#45d483', '#1e90ff', '#e05252', '#b76eff'];

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img">
      {series.map((item, seriesIndex) => (
        <g key={item.name}>
          <polyline
            fill="none"
            stroke={colors[seriesIndex % colors.length]}
            strokeWidth="3"
            points={item.values.map((value, index) => `${scaleX(index)},${scaleY(value)}`).join(' ')}
          />
          <text x={padding} y={18 + seriesIndex * 18} fill="currentColor">
            {item.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function BarTower({ items }: { items: BarItem[] }) {
  const width = 900;
  const height = 280;
  const padding = 24;
  const gap = 12;
  const max = Math.max(...items.map(item => item.value), 1);
  const barWidth = Math.max(1, (width - padding * 2 - gap * (items.length - 1)) / Math.max(items.length, 1));

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img">
      <defs>
        <linearGradient id="towerGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0d084" />
          <stop offset="100%" stopColor="#c89b3c" />
        </linearGradient>
      </defs>
      {items.map((item, index) => {
        const barHeight = ((item.value || 0) / max) * (height - padding * 2);
        const x = padding + index * (barWidth + gap);
        const y = height - padding - barHeight;

        return (
          <g key={item.label}>
            <title>{`${item.label}\nPartidas: ${item.matches || 0}\nWinrate: ${item.winrate != null ? item.winrate.toFixed(1) : '0.0'}%`}</title>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="8" ry="8" fill="url(#towerGradient)" />
            <text x={x + barWidth / 2} y={height - padding + 20} textAnchor="middle" fontSize="10" fill="currentColor">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Bars({ items }: { items: BarItem[] }) {
  const max = Math.max(...items.map(item => item.value), 1);

  return items.map(item => (
    <div key={item.label}>
      <p className="bar-row">
        <span>{item.label}</span>
        <b>{item.value}</b>
        {item.hint ? <span className="muted"> {item.hint}</span> : null}
      </p>
      <div className="bar">
        <span style={{ width: `${(Number(item.value) / max) * 100}%` }} />
      </div>
    </div>
  ));
}
