import { Player } from '@app/lib/models/league';
import { Position } from '@app/lib/constants/position.constants';

export class RosterService {
  constructStarters(roster: Player[], rosterSettings: any): Player[] {
    let activePlayerIds: number[] = [];

    // QBs
    let activeQBs = [];
    let rosteredQBs: Player[] = [...roster.filter(player => player.position == 'QB')];
    while (activeQBs.length < rosterSettings.QB) {
      const bestQB = this.getBestPlayerAtPosition(rosteredQBs);
      rosteredQBs = rosteredQBs.filter(player => player.id != bestQB.id);
      activeQBs.push(bestQB);
      activePlayerIds.push(bestQB.id);
    }

    // RBs
    let activeRBs = [];
    let rosteredRBs: Player[] = [...roster.filter(player => player.position == 'RB')];
    while (activeRBs.length < rosterSettings.RB) {
      const bestRB = this.getBestPlayerAtPosition(rosteredRBs);
      rosteredRBs = rosteredRBs.filter(player => player.id != bestRB.id);
      activeRBs.push(bestRB);
      activePlayerIds.push(bestRB.id);
    }

    // WRs
    let activeWRs = [];
    let rosteredWRs: Player[] = [...roster.filter(player => player.position == 'WR')];
    while (activeWRs.length < rosterSettings.WR) {
      const bestWR = this.getBestPlayerAtPosition(rosteredWRs);
      rosteredWRs = rosteredWRs.filter(player => player.id != bestWR.id);
      activeWRs.push(bestWR);
      activePlayerIds.push(bestWR.id);
    }

    // TEs
    let activeTEs = [];
    let rosteredTEs: Player[] = [...roster.filter(player => player.position == 'TE')];
    while (activeTEs.length < rosterSettings.TE) {
      const bestTE = this.getBestPlayerAtPosition(rosteredTEs);
      rosteredTEs = rosteredTEs.filter(player => player.id != bestTE.id);
      activeTEs.push(bestTE);
      activePlayerIds.push(bestTE.id);
    }

    // FLEX
    let activeFlexes = [];
    let rosteredFlex: Player[] = [...roster.filter(player => ['RB', 'WR', 'TE'].includes(player.position))].filter(
      player => !activePlayerIds.includes(player.id)
    );
    while (activeFlexes.length < rosterSettings.FLEX) {
      const bestFlex = this.getBestPlayerAtPosition(rosteredFlex);
      rosteredFlex = rosteredFlex.filter(player => player.id != bestFlex.id);
      activeFlexes.push(bestFlex);
    }

    // OP
    let activeOPs: Player[] = [];

    // D/ST
    let activeDSTs = [];
    let rosteredDSTs: Player[] = [...roster.filter(player => player.position == 'D/ST')];
    while (activeDSTs.length < rosterSettings['D/ST']) {
      const bestDST = this.getBestPlayerAtPosition(rosteredDSTs);
      rosteredDSTs = rosteredDSTs.filter(player => player.id != bestDST.id);
      activeDSTs.push(bestDST);
    }

    // K
    let activeKs = [];
    let rosteredKs: Player[] = [...roster.filter(player => player.position == 'K')];
    while (activeKs.length < rosterSettings.K) {
      const bestK = this.getBestPlayerAtPosition(rosteredKs);
      rosteredKs = rosteredKs.filter(player => player.id != bestK.id);
      activeKs.push(bestK);
    }

    return [...activeQBs, ...activeRBs, ...activeWRs, ...activeTEs, ...activeFlexes, ...activeDSTs, ...activeKs];
  }

  getBestPlayerAtPosition(players: Player[]) {
    return players.reduce((max, player) => (max.percentStarted > player.percentStarted ? max : player));
  }

  constructStartingPositions(rosterSettings: any): string[] {
    let startingPositions: string[] = [];

    // QB
    let numQBs = 0;
    while (numQBs < rosterSettings.QB) {
      startingPositions.push(Position.Quarterback);
      numQBs++;
    }

    // RB
    let numRBs = 0;
    while (numRBs < rosterSettings.RB) {
      startingPositions.push(Position.RunningBack);
      numRBs++;
    }

    // WR
    let numWRs = 0;
    while (numWRs < rosterSettings.WR) {
      startingPositions.push(Position.WideReceiver);
      numWRs++;
    }

    // TE
    let numTEs = 0;
    while (numTEs < rosterSettings.TE) {
      startingPositions.push(Position.TightEnd);
      numTEs++;
    }

    // Flex
    let numFlexes = 0;
    while (numFlexes < rosterSettings.FLEX) {
      startingPositions.push(Position.Flex);
      numFlexes++;
    }

    // Superflex
    let numSuperflexes = 0;
    while (numSuperflexes < rosterSettings.OP) {
      startingPositions.push(Position.Superflex);
      numSuperflexes++;
    }

    // D/ST
    let numDSTs = 0;
    while (numDSTs < rosterSettings['D/ST']) {
      startingPositions.push(Position.Defense);
      numDSTs++;
    }

    // K
    let numKs = 0;
    while (numKs < rosterSettings.K) {
      startingPositions.push(Position.Kicker);
      numKs++;
    }

    return startingPositions;
  }

  findEligibleBenchPlayers(bench: Player[], starterSlot: string): Player[] {
    if (starterSlot == Position.Flex) {
      return bench.filter(p => [Position.RunningBack, Position.WideReceiver, Position.TightEnd].includes(p.position));
    } else if (starterSlot == Position.Superflex) {
      return bench.filter(p =>
        [Position.Quarterback, Position.RunningBack, Position.WideReceiver, Position.TightEnd].includes(p.position)
      );
    }
    return bench.filter(p => p.position == starterSlot);
  }

  findEligibleSlots(player: Player, startingSlots: string[]): boolean[] {
    let eligibleSlots: boolean[] = [];
    let eligiblePositions = [player.position];
    eligiblePositions.push(
      [Position.RunningBack, Position.WideReceiver, Position.TightEnd].includes(player.position) && Position.Flex
    );
    eligiblePositions.push(
      [Position.Quarterback, Position.RunningBack, Position.WideReceiver, Position.TightEnd].includes(
        player.position
      ) && Position.Superflex
    );
    startingSlots.forEach(slot => {
      eligibleSlots.push(eligiblePositions.includes(slot));
    });
    return eligibleSlots;
  }
}
