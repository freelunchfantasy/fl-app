import { Player } from '@app/lib/models/league';

const DEFAULT_ACTIVE_ROSTER: any = {
  QB: 1,
  RB: 2,
  WR: 2,
  TE: 1,
  FLEX: 1,
  OP: 0,
  'D/ST': 1,
  K: 1,
};

export function constructActiveRoster(roster: Player[]) {
  let activePlayerIds: number[] = [];

  // QBs
  let activeQBs = [];
  let rosteredQBs: Player[] = [...roster.filter(player => player.position == 'QB')];
  console.log(rosteredQBs[0].stats);
  while (activeQBs.length < DEFAULT_ACTIVE_ROSTER.QB) {
    const bestQB = getBestPlayerAtPosition(rosteredQBs);
    rosteredQBs = rosteredQBs.filter(player => player.id != bestQB.id);
    activeQBs.push(bestQB);
    activePlayerIds.push(bestQB.id);
  }

  // RBs
  let activeRBs = [];
  let rosteredRBs: Player[] = [...roster.filter(player => player.position == 'RB')];
  while (activeRBs.length < DEFAULT_ACTIVE_ROSTER.RB) {
    const bestRB = getBestPlayerAtPosition(rosteredRBs);
    rosteredRBs = rosteredRBs.filter(player => player.id != bestRB.id);
    activeRBs.push(bestRB);
    activePlayerIds.push(bestRB.id);
  }

  // WRs
  let activeWRs = [];
  let rosteredWRs: Player[] = [...roster.filter(player => player.position == 'WR')];
  while (activeWRs.length < DEFAULT_ACTIVE_ROSTER.WR) {
    const bestWR = getBestPlayerAtPosition(rosteredWRs);
    rosteredWRs = rosteredWRs.filter(player => player.id != bestWR.id);
    activeWRs.push(bestWR);
    activePlayerIds.push(bestWR.id);
  }

  // TEs
  let activeTEs = [];
  let rosteredTEs: Player[] = [...roster.filter(player => player.position == 'TE')];
  while (activeTEs.length < DEFAULT_ACTIVE_ROSTER.TE) {
    const bestTE = getBestPlayerAtPosition(rosteredTEs);
    rosteredTEs = rosteredTEs.filter(player => player.id != bestTE.id);
    activeTEs.push(bestTE);
    activePlayerIds.push(bestTE.id);
  }

  // FLEX
  let activeFlexes = [];
  let rosteredFlex: Player[] = [...roster.filter(player => ['RB', 'WR', 'TE'].includes(player.position))].filter(
    player => !activePlayerIds.includes(player.id)
  );
  while (activeFlexes.length < DEFAULT_ACTIVE_ROSTER.FLEX) {
    const bestFlex = getBestPlayerAtPosition(rosteredFlex);
    rosteredFlex = rosteredFlex.filter(player => player.id != bestFlex.id);
    activeFlexes.push(bestFlex);
  }

  // OP
  let activeOPs: Player[] = [];

  // D/ST
  let activeDSTs = [];
  let rosteredDSTs: Player[] = [...roster.filter(player => player.position == 'D/ST')];
  while (activeDSTs.length < DEFAULT_ACTIVE_ROSTER['D/ST']) {
    console.log(rosteredDSTs);
    const bestDST = getBestPlayerAtPosition(rosteredDSTs);
    rosteredDSTs = rosteredDSTs.filter(player => player.id != bestDST.id);
    activeDSTs.push(bestDST);
  }

  // K
  let activeKs = [];
  let rosteredKs: Player[] = [...roster.filter(player => player.position == 'K')];
  while (activeKs.length < DEFAULT_ACTIVE_ROSTER.K) {
    const bestK = getBestPlayerAtPosition(rosteredKs);
    rosteredKs = rosteredKs.filter(player => player.id != bestK.id);
    activeKs.push(bestK);
  }

  return [...activeQBs, ...activeRBs, ...activeWRs, ...activeTEs, ...activeFlexes, ...activeDSTs, ...activeKs];
}

function getBestPlayerAtPosition(players: Player[]) {
  return players.reduce((max, player) => (max.percentStarted > player.percentStarted ? max : player));
}
