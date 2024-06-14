import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { SimulationPayloadService } from '@app/services/simulation-payload-service';
import { League, LeagueSimulationResult, NflTeam, Player, Team, UserLeague } from '@app/lib/models/league';
import { ScheduleService } from '@app/services/schedule-service';
import { LeagueDataProcessingService } from '@app/services/league-data-processing-service';
import { RosterService } from '@app/services/roster-service';
import { IDropdownEvent, IDropdownItem } from '@app/components/dropdown/dropdown-interfaces';
import { DropdownEvent } from '@app/components/dropdown/dropdown-constants';
import { TeamRosterMode } from '@app/components/team-roster/team-roster.constants';
import { TradeBlock } from './trade.constants';
import { Position } from '@app/lib/constants/position.constants';
import { SimulateLeaguePayload } from '@app/lib/models/league-payloads';
import { User } from '@app/lib/models/user';
import { RouterService } from '@app/services/router-service';

@Component({
  selector: 'trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit, OnDestroy {
  // TODO: REPLACE WITH ACTUAL LOGIN AND USER INFO
  leagueId: number = 49454731;
  userTeamId: number = 1;
  nflTeams: NflTeam[] = [];

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
  user: User;
  userLeague: UserLeague;

  leftTeam: Team;
  leftStarters: Player[];
  leftBench: Player[];
  rightTeam: Team;
  rightStarters: Player[];
  rightBench: Player[];
  leftTeamDropdownItems: IDropdownItem[];
  rightTeamDropdownItems: IDropdownItem[];
  rightTeamDropdownTriggerMarkup: string = 'Select a team';
  tradeBlock: TradeBlock = { left: [], right: [] };
  isSimulating: boolean = false;

  showTradeResultModal: boolean = false;
  tradeResult: LeagueSimulationResult;

  subscriptions: Subscription[] = [];

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private leagueStore: Store<fromLeagueRoot.State>,
    private leagueDataProcessingService: LeagueDataProcessingService,
    private rosterService: RosterService,
    private simulationPayloadService: SimulationPayloadService,
    private routerService: RouterService
  ) {}

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  selectedUserLeague$(): Observable<UserLeague> {
    return this.leagueStore.select(fromLeagueRoot.selectSelectedUserLeague);
  }

  leagueData$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueDataIsLoading);
  }

  nflTeams$(): Observable<NflTeam[]> {
    return this.leagueStore.select(fromLeagueRoot.selectNflTeams);
  }

  tradeSimulationResult$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectTradeSimulationResult);
  }

  tradeSimulationIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectTradeSimulationIsLoading);
  }

  leagueStandings$(): Observable<Team[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueStandings);
  }

  leagueSchedule$(): Observable<number[][][]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSchedule);
  }

  ngOnInit(): void {
    this.leagueStore.dispatch(new LeagueActions.ResetTradeResult());

    // User sub
    const userSubscription = this.user$().subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.subscriptions.push(userSubscription);

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
            this.leftTeamDropdownItems = this.league.teams.map(t => ({
              id: t.id.toString(),
              value: t.id,
              htmlMarkup: [t.teamName],
              selected: t.id == this.userTeamId,
            }));
            this.rightTeamDropdownItems = this.league.teams
              .filter(t => t.id != this.leftTeam.id)
              .map(t => ({
                id: t.id.toString(),
                value: t.id,
                htmlMarkup: [t.teamName],
                selected: t.id == this.userTeamId,
              }));
          }
        }
      }
    );
    this.subscriptions.push(leagueDataSubscription);

    // NFL teams sub
    const nflTeamsSubscription = this.nflTeams$().subscribe(nflTeams => {
      this.nflTeams = nflTeams;
    });
    this.subscriptions.push(nflTeamsSubscription);

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

    // Selected user league sub
    const selectedUserLeagueSubscription = this.selectedUserLeague$().subscribe(userLeague => {
      this.userLeague = userLeague;
    });
    this.subscriptions.push(selectedUserLeagueSubscription);

    const tradeSimulationSubscription = combineLatest([
      this.tradeSimulationResult$(),
      this.tradeSimulationIsLoading$(),
    ]).subscribe(([result, isSimulating]) => {
      this.isSimulating = isSimulating;
      if (!isSimulating && result) {
        this.tradeResult = result;
        this.showTradeResultModal = true;
      }
    });
    this.subscriptions.push(tradeSimulationSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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

  getPlayerPicture(player: Player) {
    return `../../../../assets/players/${player.id}.png`;
  }

  onSelectLeftTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.leftTeam = this.league.teams.find(t => t.id == event.payload.dropdownItemValue);
      this.leftStarters = this.rosterService.constructStarters(this.leftTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
      this.leftBench = this.leftTeam.roster.filter(player => !this.leftStarters.map(p => p.id).includes(player.id));
      this.rightTeamDropdownItems = this.league.teams
        .filter(t => t.id != this.leftTeam.id)
        .map(t => ({
          id: t.id.toString(),
          value: t.id,
          htmlMarkup: [t.teamName],
          selected: t.id == this.userTeamId,
        }));
      this.tradeBlock = { left: [], right: [] }; // Empty trade block when selected teams changed
    }
  }

  onSelectRightTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.rightTeam = this.league.teams.find(t => t.id == event.payload.dropdownItemValue);
      this.rightStarters = this.rosterService.constructStarters(this.rightTeam.roster, this.DEFAULT_ACTIVE_ROSTER);
      this.rightBench = this.rightTeam.roster.filter(player => !this.rightStarters.map(p => p.id).includes(player.id));
      this.leftTeamDropdownItems = this.league.teams
        .filter(t => t.id != this.rightTeam.id)
        .map(t => ({
          id: t.id.toString(),
          value: t.id,
          htmlMarkup: [t.teamName],
          selected: t.id == this.userTeamId,
        }));
      this.tradeBlock = { left: [], right: [] }; // Empty trade block when selected teams changed
    }
  }

  addPlayerToTrade(player: Player) {
    if (this.isSimulating) return;
    const inLeftTeam = this.leftTeam.roster.find(p => p.id == player.id);
    inLeftTeam ? this.tradeBlock.left.push(player) : (this.tradeBlock.right = [player, ...this.tradeBlock.right]);
  }

  removePlayerFromTrade(player: Player) {
    const inLeftTeam = this.leftTeam.roster.find(p => p.id == player.id);
    inLeftTeam
      ? (this.tradeBlock = { left: this.tradeBlock.left.filter(p => p.id != player.id), right: this.tradeBlock.right })
      : (this.tradeBlock = { left: this.tradeBlock.left, right: this.tradeBlock.right.filter(p => p.id != player.id) });
  }

  handlePlayerClick(player: Player) {
    if (this.isSimulating) return;
    this.removePlayerFromTrade(player);
    this.tradeBlock.left = this.tradeBlock.left.filter(p => p.id != player.id);
    this.tradeBlock.right = this.tradeBlock.right.filter(p => p.id != player.id);
  }

  simulateTrade() {
    if (this.tradeBlock.left.length > 0 && this.tradeBlock.right.length > 0 && !this.isSimulating) {
      const simulationPayload: SimulateLeaguePayload[] = [
        {
          ...this.simulationPayloadService.constructSimulationPayload(
            this.leagueId,
            this.league.teams,
            this.leagueSchedule,
            this.nflTeams,
            this.DEFAULT_ACTIVE_ROSTER
          ),
          userId: this.user.id,
          userLeagueId: this.userLeague.id,
        },
        {
          ...this.simulationPayloadService.constructSimulationPayload(
            this.leagueId,
            this.league.teams,
            this.leagueSchedule,
            this.nflTeams,
            this.DEFAULT_ACTIVE_ROSTER,
            this.tradeBlock
          ),
          userId: this.user.id,
          userLeagueId: this.userLeague.id,
        },
      ];
      this.leagueStore.dispatch(new LeagueActions.SimulateTrade(simulationPayload));
    }
  }

  backToSelectLeague() {
    this.leagueStore.dispatch(new LeagueActions.ClearSelectedUserLeague());
    this.leagueStore.dispatch(new LeagueActions.ClearLeagueData());
    this.routerService.redirectTo('/league');
  }

  get canSimTrade() {
    return this.tradeBlock.left.length && this.tradeBlock.right.length;
  }

  closeTradeResultModal() {
    this.showTradeResultModal = false;
  }
}
