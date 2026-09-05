'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ProcessedMatch } from '@/domain/championship/types';

function MatchSide({ title, team }: { title: string; team: ProcessedMatch['blue'] }) {
  return (
    <div className="match-card">
      <h3>{title}</h3>
      {team.map(player => (
        <p key={`${title}-${player.name}`}>
          {player.name} <Badge variant="outline">{player.role}</Badge> <b>{player.lp}</b>
        </p>
      ))}
    </div>
  );
}

export function MatchesTable({ matches }: { matches: ProcessedMatch[] }) {
  const [selectedMatch, setSelectedMatch] = useState<ProcessedMatch | null>(null);

  return (
    <>
      <div className="page-head">
        <h1>Partidas</h1>
      </div>
      <DataTable
        columns={[
          { key: 'id', label: '#', render: match => match.id },
          { key: 'winner', label: 'Vencedor', render: match => match.winner },
          { key: 'blue', label: 'Azul', render: match => match.blue.map(player => player.name).join(', ') },
          { key: 'red', label: 'Vermelho', render: match => match.red.map(player => player.name).join(', ') },
          {
            key: 'details',
            label: 'Detalhes',
            render: match => (
              <Button onClick={() => setSelectedMatch(match)} type="button">
                Abrir
              </Button>
            ),
          },
        ]}
        rows={matches}
      />
      <Dialog onOpenChange={open => !open && setSelectedMatch(null)} open={Boolean(selectedMatch)}>
        <DialogContent className="max-w-4xl">
          {selectedMatch ? (
            <>
              <DialogHeader>
                <DialogTitle>Partida {selectedMatch.id}</DialogTitle>
                <DialogDescription>
                  Vencedor: <b>{selectedMatch.winner}</b>
                </DialogDescription>
              </DialogHeader>
              <div className="match-grid">
                <MatchSide team={selectedMatch.blue} title="Time Azul" />
                <MatchSide team={selectedMatch.red} title="Time Vermelho" />
              </div>
              <DialogFooter>
                <DialogClose render={<Button type="button" />}>
                  Fechar
                </DialogClose>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
