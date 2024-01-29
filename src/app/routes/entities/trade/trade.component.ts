import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { SimulationPayloadService } from '@app/services/simulation-payload-service';
import { League, Player, Team } from '@app/lib/models/league';
import { ScheduleService } from '@app/services/schedule-service';
import { LeagueDataProcessingService } from '@app/services/league-data-processing-service';
import { RosterService } from '@app/services/roster-service';
import { IDropdownEvent, IDropdownItem } from '@app/components/dropdown/dropdown-interfaces';
import { DropdownEvent } from '@app/components/dropdown/dropdown-constants';
import { TeamRosterMode } from '@app/components/team-roster/team-roster.constants';
import { TradeBlock } from './trade.constants';
import { Position } from '@app/lib/constants/position.constants';

@Component({
  selector: 'trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit, OnDestroy {
  // TODO: REPLACE WITH ACTUAL LOGIN AND USER INFO
  leagueId: number = 49454731;
  userTeamId: number = 1;

  DEFAULT_ACTIVE_ROSTER: any = {
    QB: 1,
    RB: 2,
    WR: 2,
    TE: 1,
    FLEX: 1,
    OP: 0,
    'D/ST': 1,
    K: 1,
  };
  startingPositions: string[] = [];
  teamRosterMode: TeamRosterMode = TeamRosterMode.TRADE;

  league: League;
  leagueStandings: Team[];
  leagueSchedule: number[][][];

  leftTeam: Team;
  leftStarters: Player[];
  leftBench: Player[];
  rightTeam: Team;
  rightStarters: Player[];
  rightBench: Player[];
  teamDropdownItems: IDropdownItem[];
  rightTeamDropdownTriggerMarkup: string = 'Select a team';
  tradeBlock: TradeBlock = { left: [], right: [] };

  subscriptions: Subscription[] = [];

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private leagueStore: Store<fromLeagueRoot.State>,
    private leagueDataProcessingService: LeagueDataProcessingService,
    private rosterService: RosterService,
    private simulationPayloadService: SimulationPayloadService
  ) {}

  leagueData$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueDataIsLoading);
  }

  leagueSimulationResult$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSimulationResult);
  }

  leagueSimulationIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSimulationIsLoading);
  }

  leagueStandings$(): Observable<Team[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueStandings);
  }

  leagueSchedule$(): Observable<number[][][]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSchedule);
  }

  ngOnInit(): void {
    const leagueDataSubscription = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        if (!isLoading) {
          if (leagueData) {
            this.leagueDataProcessingService.processLeagueData(leagueData);

            // League data processing specific for this component
            this.league = leagueData;
            this.leftTeam = this.league.teams.find(t => t.id == this.userTeamId);
            this.leftStarters = this.rosterService.constructStarters(this.leftTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
            this.leftBench = this.leftTeam.roster.filter(
              player => !this.leftStarters.map(p => p.id).includes(player.id)
            );
            this.startingPositions = this.rosterService.constructStartingPositions(this.DEFAULT_ACTIVE_ROSTER);
            this.teamDropdownItems = this.league.teams.map(t => ({
              id: t.id.toString(),
              value: t.id,
              htmlMarkup: [t.teamName],
              selected: t.id == this.userTeamId,
            }));
          } else {
            this.leagueStore.dispatch(new LeagueActions.GetLeagueData(this.leagueId));
          }
        }
      }
    );
    this.subscriptions.push(leagueDataSubscription);

    const leagueStandingsSubscription = this.leagueStandings$().subscribe(standings => {
      if ((standings || []).length) {
        this.leagueStandings = standings;
      }
    });
    this.subscriptions.push(leagueStandingsSubscription);

    const leagueScheduleSubscription = this.leagueSchedule$().subscribe(schedule => {
      if ((schedule || []).length) {
        this.leagueSchedule = schedule;
      }
    });
    this.subscriptions.push(leagueScheduleSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getSimSeasonButtonClasses() {
    return `btn ${
      this.tradeBlock.left.length > 0 && this.tradeBlock.right.length > 0 ? 'btn-success' : 'btn-secondary unclickable'
    }`;
  }

  getPlayerCssClasses(player: Player) {
    let classes = 'player';
    switch (player.position) {
      case Position.Quarterback:
        classes = `${classes} quarterback`;
        break;
      case Position.RunningBack:
        classes = `${classes} runningback`;
        break;
      case Position.WideReceiver:
        classes = `${classes} widereceiver`;
        break;
      case Position.TightEnd:
        classes = `${classes} tightend`;
        break;
      case Position.Defense:
        classes = `${classes} defense`;
        break;
      case Position.Kicker:
        classes = `${classes} kicker`;
        break;
      default:
        break;
    }
    return classes;
  }

  onSelectLeftTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.leftTeam = this.league.teams.find(t => t.id == event.payload.dropdownItemValue);
      this.leftStarters = this.rosterService.constructStarters(this.leftTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
      this.leftBench = this.leftTeam.roster.filter(player => !this.leftStarters.map(p => p.id).includes(player.id));
    }
  }

  onSelectRightTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.rightTeam = this.league.teams.find(t => t.id == event.payload.dropdownItemValue);
      this.rightStarters = this.rosterService.constructStarters(this.rightTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
      this.rightBench = this.rightTeam.roster.filter(player => !this.rightStarters.map(p => p.id).includes(player.id));
    }
  }

  addPlayerToTrade(player: Player) {
    const inLeftTeam = this.leftTeam.roster.find(p => p.id == player.id);
    inLeftTeam ? this.tradeBlock.left.push(player) : (this.tradeBlock.right = [player, ...this.tradeBlock.right]);
  }

  removePlayerFromTrade(player: Player) {
    const inLeftTeam = this.leftTeam.roster.find(p => p.id == player.id);
    inLeftTeam
      ? (this.tradeBlock.left = this.tradeBlock.left.filter(p => p.id != player.id))
      : (this.tradeBlock.right = this.tradeBlock.right.filter(p => p.id != player.id));
  }

  handlePlayerClick(player: Player) {
    this.removePlayerFromTrade(player);
    this.tradeBlock.left = this.tradeBlock.left.filter(p => p.id != player.id);
    this.tradeBlock.right = this.tradeBlock.right.filter(p => p.id != player.id);
  }

  simulateSeason() {
    if (this.tradeBlock.left.length > 0 && this.tradeBlock.right.length > 0) {
      const simulationPayload = this.simulationPayloadService.constructSimulationPayload(
        this.leagueId,
        this.league.teams,
        this.leagueSchedule
      );
      this.leagueStore.dispatch(new LeagueActions.SimulateLeague(simulationPayload));
    }
  }
}
