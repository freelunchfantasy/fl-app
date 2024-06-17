import { Player } from '@app/lib/models/league';
import { Position } from '@app/lib/constants/position.constants';

export class RosterService {
  constructStarters(roster: Player[], startingPositions: string[]): Player[] {
    let activePlayerIds: number[] = [];

    // QBs
    let activeQBs = [];
    let rosteredQBs: Player[] = [...roster.filter(player => player.position == Position.Quarterback.code)];
    const numStartingQBs = startingPositions.filter(p => p == Position.Quarterback.display).length;
    while (activeQBs.length < numStartingQBs && rosteredQBs.length) {
      const bestQB = this.getBestPlayerAtPosition(rosteredQBs);
      rosteredQBs = rosteredQBs.filter(player => player.id != bestQB.id);
      activeQBs.push(bestQB);
      activePlayerIds.push(bestQB.id);
    }

    // RBs
    let activeRBs = [];
    let rosteredRBs: Player[] = [...roster.filter(player => player.position == Position.RunningBack.code)];
    const numStartingRBs = startingPositions.filter(p => p == Position.RunningBack.display).length;
    while (activeRBs.length < numStartingRBs && rosteredRBs.length) {
      const bestRB = this.getBestPlayerAtPosition(rosteredRBs);
      rosteredRBs = rosteredRBs.filter(player => player.id != bestRB.id);
      activeRBs.push(bestRB);
      activePlayerIds.push(bestRB.id);
    }

    // WRs
    let activeWRs = [];
    let rosteredWRs: Player[] = [...roster.filter(player => player.position == Position.WideReceiver.code)];
    const numStartingWRs = startingPositions.filter(p => p == Position.WideReceiver.code).length;
    while (activeWRs.length < numStartingWRs && rosteredWRs.length) {
      const bestWR = this.getBestPlayerAtPosition(rosteredWRs);
      rosteredWRs = rosteredWRs.filter(player => player.id != bestWR.id);
      activeWRs.push(bestWR);
      activePlayerIds.push(bestWR.id);
    }

    // TEs
    let activeTEs = [];
    let rosteredTEs: Player[] = [...roster.filter(player => player.position == Position.TightEnd.code)];
    const numStartingTEs = startingPositions.filter(p => p == Position.TightEnd.display).length;
    while (activeTEs.length < numStartingTEs && rosteredTEs.length) {
      const bestTE = this.getBestPlayerAtPosition(rosteredTEs);
      rosteredTEs = rosteredTEs.filter(player => player.id != bestTE.id);
      activeTEs.push(bestTE);
      activePlayerIds.push(bestTE.id);
    }

    // RB/WRs
    let activeRBWRs = [];
    let rosteredRBWRs: Player[] = [
      ...roster.filter(player => [Position.RunningBack.code, Position.WideReceiver.code].includes(player.position)),
    ].filter(player => !activePlayerIds.includes(player.id));
    const numStartingRBWRs = startingPositions.filter(p => p == Position.RunningBackWideReceiver.display).length;
    while (activeRBWRs.length < numStartingRBWRs && rosteredRBWRs.length) {
      const bestRBWR = this.getBestPlayerAtPosition(rosteredRBWRs);
      rosteredRBs = rosteredRBWRs.filter(player => player.id != bestRBWR.id);
      activeRBWRs.push(bestRBWR);
      activePlayerIds.push(bestRBWR.id);
    }

    // WR/TEs
    let activeWRTEs = [];
    let rosteredWRTEs: Player[] = [
      ...roster.filter(player => [Position.WideReceiver.code, Position.TightEnd.code].includes(player.position)),
    ].filter(player => !activePlayerIds.includes(player.id));
    const numStartingWRTEs = startingPositions.filter(p => p == Position.WideReceiverTightEnd.code).length;
    while (activeWRTEs.length < numStartingWRTEs && rosteredWRTEs.length) {
      const bestWRTE = this.getBestPlayerAtPosition(rosteredWRTEs);
      rosteredWRTEs = rosteredWRTEs.filter(player => player.id != bestWRTE.id);
      activeWRTEs.push(bestWRTE);
      activePlayerIds.push(bestWRTE.id);
    }

    // FLEX
    let activeFlexes = [];
    let rosteredFlexes: Player[] = [
      ...roster.filter(player =>
        [Position.RunningBack.code, Position.WideReceiver.code, Position.TightEnd.code].includes(player.position)
      ),
    ].filter(player => !activePlayerIds.includes(player.id));
    const numStartingFlexes = startingPositions.filter(p => p == Position.Flex.display).length;
    while (activeFlexes.length < numStartingFlexes && rosteredFlexes.length) {
      const bestFlex = this.getBestPlayerAtPosition(rosteredFlexes);
      rosteredFlexes = rosteredFlexes.filter(player => player.id != bestFlex.id);
      activeFlexes.push(bestFlex);
      activePlayerIds.push(bestFlex.id);
    }

    // OP
    let activeOPs = [];
    let rosteredOPs: Player[] = [
      ...roster.filter(player =>
        [
          Position.Quarterback.code,
          Position.RunningBack.code,
          Position.WideReceiver.code,
          Position.TightEnd.code,
        ].includes(player.position)
      ),
    ].filter(player => !activePlayerIds.includes(player.id));
    const numStartingOPs = startingPositions.filter(p => p == Position.Superflex.display).length;
    while (activeOPs.length < numStartingOPs && rosteredOPs.length) {
      const bestSuperflex = this.getBestPlayerAtPosition(rosteredOPs);
      rosteredOPs = rosteredOPs.filter(player => player.id != bestSuperflex.id);
      activeOPs.push(bestSuperflex);
      activePlayerIds.push(bestSuperflex.id);
    }

    // D/ST
    let activeDSTs = [];
    let rosteredDSTs: Player[] = [...roster.filter(player => player.position == Position.Defense.code)];
    const numStartingDefenses = startingPositions.filter(p => p == Position.Defense.display).length;
    while (activeDSTs.length < numStartingDefenses && rosteredDSTs.length) {
      const bestDST = this.getBestPlayerAtPosition(rosteredDSTs);
      rosteredDSTs = rosteredDSTs.filter(player => player.id != bestDST.id);
      activeDSTs.push(bestDST);
      activePlayerIds.push(bestDST.id);
    }

    // K
    let activeKs = [];
    let rosteredKs: Player[] = [...roster.filter(player => player.position == Position.Kicker.code)];
    const numStartingKickers = startingPositions.filter(p => p == Position.Kicker.display).length;
    while (activeKs.length < numStartingKickers && rosteredKs.length) {
      const bestK = this.getBestPlayerAtPosition(rosteredKs);
      rosteredKs = rosteredKs.filter(player => player.id != bestK.id);
      activeKs.push(bestK);
      activePlayerIds.push(bestK.id);
    }
    return [
      ...activeQBs,
      ...activeRBs,
      ...activeWRs,
      ...activeTEs,
      ...activeRBWRs,
      ...activeWRTEs,
      ...activeFlexes,
      ...activeOPs,
      ...activeDSTs,
      ...activeKs,
    ];
  }

  getBestPlayerAtPosition(players: Player[]) {
    return (players || []).length
      ? players.reduce((max, player) => (max.projectedAveragePoints > player.projectedAveragePoints ? max : player))
      : null;
  }

  constructStartingPositions(unorderedPositions: string[]): string[] {
    let startingPositions: string[] = [];

    // QB
    unorderedPositions
      .filter(p => p == Position.Quarterback.code)
      .forEach(() => {
        startingPositions.push(Position.Quarterback.display);
      });

    // RB
    unorderedPositions
      .filter(p => p == Position.RunningBack.code)
      .forEach(() => {
        startingPositions.push(Position.RunningBack.display);
      });

    // WR
    unorderedPositions
      .filter(p => p == Position.WideReceiver.code)
      .forEach(() => {
        startingPositions.push(Position.WideReceiver.display);
      });

    // TE
    unorderedPositions
      .filter(p => p == Position.TightEnd.code)
      .forEach(() => {
        startingPositions.push(Position.TightEnd.display);
      });

    // RB/WR
    unorderedPositions
      .filter(p => p == Position.RunningBackWideReceiver.code)
      .forEach(() => {
        startingPositions.push(Position.RunningBackWideReceiver.display);
      });

    // WR/TE
    unorderedPositions
      .filter(p => p == Position.WideReceiverTightEnd.code)
      .forEach(() => {
        startingPositions.push(Position.WideReceiverTightEnd.display);
      });

    // Flex
    unorderedPositions
      .filter(p => p == Position.Flex.code)
      .forEach(() => {
        startingPositions.push(Position.Flex.display);
      });

    // Superflex
    unorderedPositions
      .filter(p => p == Position.Superflex.code)
      .forEach(() => {
        startingPositions.push(Position.Superflex.display);
      });

    // D/ST
    unorderedPositions
      .filter(p => p == Position.Defense.code)
      .forEach(() => {
        startingPositions.push(Position.Defense.display);
      });

    // K
    unorderedPositions
      .filter(p => p == Position.Kicker.code)
      .forEach(() => {
        startingPositions.push(Position.Kicker.display);
      });

    return startingPositions;
  }

  findEligibleBenchPlayers(bench: Player[], starterSlot: string): Player[] {
    if (starterSlot == Position.Flex.display) {
      return bench.filter(p =>
        [Position.RunningBack.display, Position.WideReceiver.display, Position.TightEnd.display].includes(p.position)
      );
    } else if (starterSlot == Position.Superflex.display) {
      return bench.filter(p =>
        [
          Position.Quarterback.display,
          Position.RunningBack.display,
          Position.WideReceiver.display,
          Position.TightEnd.display,
        ].includes(p.position)
      );
    }
    return bench.filter(p => p.position == starterSlot);
  }

  findEligibleSlots(player: Player, startingSlots: string[]): boolean[] {
    let eligibleSlots: boolean[] = [];
    let eligiblePositions = [player.position];
    // RB/WR
    eligiblePositions.push(
      [Position.RunningBack.display, Position.WideReceiver.display].includes(player.position) &&
        Position.RunningBackWideReceiver.display
    );
    // WR/TE
    eligiblePositions.push(
      [Position.WideReceiver.display, Position.TightEnd.display].includes(player.position) &&
        Position.WideReceiverTightEnd.display
    );
    // Flex
    eligiblePositions.push(
      [Position.RunningBack.display, Position.WideReceiver.display, Position.TightEnd.display].includes(
        player.position
      ) && Position.Flex.display
    );
    // OP
    eligiblePositions.push(
      [
        Position.Quarterback.display,
        Position.RunningBack.display,
        Position.WideReceiver.display,
        Position.TightEnd.display,
      ].includes(player.position) && Position.Superflex.display
    );
    startingSlots.forEach(slot => {
      eligibleSlots.push(eligiblePositions.includes(slot));
    });
    return eligibleSlots;
  }
}
