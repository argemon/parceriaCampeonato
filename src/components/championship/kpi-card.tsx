import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type KpiCardProps = {
  label: string;
  value: ReactNode;
  hint?: string;
};

export function KpiCard({ label, value, hint = '' }: KpiCardProps) {
  return (
    <Card className="min-h-28">
      <CardContent>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-black text-foreground">{value}</div>
        {hint ? <div className="text-sm text-muted-foreground">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}
