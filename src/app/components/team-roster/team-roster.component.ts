import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { Position } from '@app/lib/constants/position.constants';
import { Player } from '@app/lib/models/league';
import { RosterService } from '@app/services/roster-service';
import { TeamRosterMode } from './team-roster.constants';

@Component({
  selector: 'team-roster',
  templateUrl: './team-roster.component.html',
  styleUrls: ['./team-roster.component.scss'],
})
export class TeamRosterComponent implements OnInit {
  @Input()
  starters: Player[] = [];

  @Input()
  bench: Player[] = [];

  @Input()
  startingPositions: string[] = [];

  @Input()
  mode: TeamRosterMode = TeamRosterMode.SWAP;

  @Input()
  playersBeingTraded: Player[] = [];

  @Output()
  onPlayerTradeAdd: EventEmitter<Player> = new EventEmitter<Player>();

  @Output()
  onPlayerTradeRemove: EventEmitter<Player> = new EventEmitter<Player>();

  // SWAP values
  swappingStarter: boolean = false;
  swappingBench: boolean = false;
  currSwappingStarterIndex: number;
  currSwappingStarter: Player;
  currSwappingBenchPlayer: Player;
  eligibleSlotsForSelectedBenchPlayer: boolean[] = [];
  eligibleBenchReplacementsForSelectedStarter: Player[] = [];

  @HostListener('document:click', ['$event.target'])
  onClick(element: HTMLElement) {
    this.clickHandler(element);
  }

  constructor(private rosterService: RosterService) {}

  ngOnInit() {}

  handlePlayerClick(player: Player, i: number) {
    switch (this.mode) {
      case TeamRosterMode.SWAP:
        this.handlePlayerClickInSwapMode(player, i);
        break;
      case TeamRosterMode.TRADE:
        this.handlePlayerClickInTradeMode(player);
        break;
      default:
        break;
    }
  }

  handlePlayerClickInSwapMode(player: Player, i: number) {
    const shouldExecuteSwapToBench = (player: Player) =>
      this.swappingStarter && this.eligibleBenchReplacementsForSelectedStarter.find(p => p.id == player.id);
    const shouldExecuteSwapToStarter = (i: number) => this.swappingBench && this.eligibleSlotsForSelectedBenchPlayer[i];
    if (shouldExecuteSwapToBench(player)) {
      return this.executeSwapToBench(player);
    }
    if (shouldExecuteSwapToStarter(i)) {
      return this.executeSwapToStarter(player, i);
    }
    // If we're in swapping mode but a valid player wasn't clicked, exit swapping mode and leave method
    if (this.swappingBench || this.swappingStarter) {
      // Remove placeholder 'Move to bench' object
      this.bench = this.bench.filter((player: Player) => player.id);
      return this.swappingBench ? (this.swappingBench = false) : (this.swappingStarter = false);
    }

    const isStarter = this.starters.find(p => p.id == player.id);
    isStarter ? this.showBenchReplacements(player, i) : this.getEligibleSlots(player);
    if (isStarter) {
      this.currSwappingStarter = player;
      this.currSwappingStarterIndex = i;
    } else {
      this.currSwappingBenchPlayer = player;
    }
  }

  handlePlayerClickInTradeMode(player: Player) {
    const playerAlreadyInTrade = this.playersBeingTraded.find(p => p.id == player.id);
    playerAlreadyInTrade ? this.onPlayerTradeRemove.emit(player) : this.onPlayerTradeAdd.emit(player);
  }

  showBenchReplacements(player: Player, i: number) {
    const moveToBenchPlaceholder: Player = {
      id: 0,
      name: 'Move to bench',
      position: '',
      rank: 0,
      proTeam: '',
      projectedAveragePoints: 0,
      projectedTotalPoints: 0,
      percentStarted: 0,
      stats: {},
    };

    this.eligibleBenchReplacementsForSelectedStarter = this.rosterService.findEligibleBenchPlayers(
      this.bench,
      this.startingPositions[i]
    );
    if (player.id) {
      this.bench.push(moveToBenchPlaceholder);
      this.eligibleBenchReplacementsForSelectedStarter.push(moveToBenchPlaceholder);
    }
    this.swappingStarter = true;
    this.swappingBench = false;
  }

  getEligibleSlots(player: Player) {
    this.eligibleSlotsForSelectedBenchPlayer = this.rosterService.findEligibleSlots(player, this.startingPositions);
    this.swappingBench = true;
    this.swappingStarter = false;
  }

  executeSwapToBench(benchPlayer: Player) {
    const benchId = this.bench.findIndex(p => p.id == benchPlayer.id);
    this.starters[this.currSwappingStarterIndex].id
      ? (this.bench[benchId] = this.currSwappingStarter)
      : this.bench.splice(benchId, 1);
    this.starters[this.currSwappingStarterIndex] = benchPlayer.id ? benchPlayer : { ...benchPlayer, name: 'Empty' };
    this.swappingStarter = false;
    // Remove placeholder 'Move to bench' object
    this.bench = this.bench.filter((player: Player) => player.id);
  }

  executeSwapToStarter(starter: Player, i: number) {
    const benchId = this.bench.findIndex(p => p.id == this.currSwappingBenchPlayer.id);
    this.starters[i] = this.currSwappingBenchPlayer;
    starter.id ? (this.bench[benchId] = starter) : this.bench.splice(benchId, 1);
    this.swappingBench = false;
  }

  getPlayerRowCssClasses(i: number) {
    return `player-row ${i % 2 ? 'even' : 'odd'}`;
  }

  getPlayerCssClasses(player: Player, i: number, isStarter: boolean) {
    let addInvalid = false;
    if (this.mode == TeamRosterMode.SWAP) {
      const addInvalidToStarter = (i: number) =>
        (this.swappingBench && !this.eligibleSlotsForSelectedBenchPlayer[i]) ||
        (this.swappingStarter && this.currSwappingStarterIndex != i);
      const addInvalidToBenchPlayer = (player: Player) =>
        (this.swappingStarter && !this.eligibleBenchReplacementsForSelectedStarter.find(p => p.id == player.id)) ||
        (this.swappingBench && player.id != this.currSwappingBenchPlayer.id);
      addInvalid = (isStarter && addInvalidToStarter(i)) || (!isStarter && addInvalidToBenchPlayer(player));
    } else if (this.mode == TeamRosterMode.TRADE) {
      addInvalid = this.playersBeingTraded.filter(p => p.id == player.id).length > 0;
    }
    return `player ${addInvalid ? 'invalid' : ''}`;
  }

  getPlayerPicture(player: Player) {
    return `../../../../assets/players/${player.id}.png`;
  }

  getPlayerProfilePicClasses(player: Player) {
    return player.position == Position.Defense ? 'player__profile-pic dst' : 'player__profile-pic';
  }

  clickHandler(target: HTMLElement) {
    if (!target.classList.value.includes('player')) {
      this.swappingBench = false;
      this.swappingStarter = false;
      // Remove placeholder 'Move to bench' object
      this.bench = this.bench.filter((player: Player) => player.id);
    }
  }
}
