![Pódio do Campeonato](public/assets/podio-campeonato.png)

# 🏆 Campeonato Parceria Vive 2026

O **Campeonato Parceria Vive 2026** foi um campeonato de **League of Legends** organizado entre amigos e membros da comunidade com o objetivo de promover partidas equilibradas, competitividade e muita diversão ao longo de um mês inteiro.

Diferente de um torneio tradicional com eliminação, o campeonato foi disputado em formato de **fila ranqueada (In-House Queue)**. Os jogadores entravam na fila diariamente, e um sistema de matchmaking montava equipes de forma automática buscando equilibrar o MMR entre os dois times.

Cada participante acumulava ou perdia MMR de acordo com o resultado das partidas, formando um ranking dinâmico que foi atualizado durante todo o campeonato.

## 📅 Período

* **Início:** 30/05/2026
* **Encerramento:** 30/06/2026

## 🎯 Objetivo

O objetivo era simples:

* Criar partidas equilibradas entre jogadores da comunidade;
* Incentivar a participação constante;
* Premiar os jogadores mais consistentes durante todo o campeonato.

Ao final do evento, os **3 primeiros colocados** receberam troféus personalizados e premiação em dinheiro.

## ⚙️ Como funcionava

* Partidas 5x5 de League of Legends.
* Um jogador por rota (Top, Jungle, Mid, ADC e Suporte).
* Matchmaking baseado no MMR dos jogadores.
* Atualização do ranking após cada partida.
* O desempenho ao longo de todo o mês definia a classificação final.

## 📊 Estatísticas

Este projeto reúne todas as estatísticas geradas durante o campeonato em um dashboard Next.js, como:

* Ranking geral por MMR;
* Vitórias, derrotas e taxa de vitória;
* Evolução dos jogadores;
* Estatísticas individuais;
* Comparações entre participantes;
* Informações por posição (Top, Jungle, Mid, ADC e Suporte).

Neste momento, os dados exibidos na página são gerados a partir dos arquivos JSON utilizados durante o campeonato. A estrutura já está preparada para substituir essa fonte por Supabase.

## 🛠️ Tecnologias

Este projeto foi migrado para uma base full-stack com:

* Next.js
* React
* TypeScript
* shadcn/ui
* Supabase
* JSON

O processamento das estatísticas fica centralizado na camada de domínio da aplicação.

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Para configurar o Supabase, copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## ❤️ Agradecimentos

Este projeto só existiu graças à participação de toda a comunidade.

Independentemente da posição no ranking, cada jogador contribuiu para tornar o campeonato mais competitivo e divertido. Foram dezenas de partidas, muitas disputas equilibradas, viradas inesperadas e momentos marcantes que fizeram do **Parceria Vive 2026** uma experiência única.

Nos vemos na próxima edição! 🎮🏆
