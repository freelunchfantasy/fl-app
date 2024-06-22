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
import { DEFAULT_STARTING_POSITIONS, Position } from '@app/lib/constants/position.constants';
import { SimulateLeaguePayload } from '@app/lib/models/league-payloads';
import { User } from '@app/lib/models/user';
import { RouterService } from '@app/services/router-service';
import { StandingsService } from '@app/services/standings-service';

@Component({
  selector: 'trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
})
export class TradeComponent implements OnInit, OnDestroy {
  leagueId: number;
  userTeamId: number;
  nflTeams: NflTeam[] = [];

  startingPositions: string[] = [];
  teamRosterMode: TeamRosterMode = TeamRosterMode.TRADE;

  league: League;
  leagueStandings: Team[];
  leagueSchedule: number[][][];
  user: User;
  userLeague: UserLeague;
  userLeagues: UserLeague[];

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
    private standingsService: StandingsService,
    private routerService: RouterService
  ) {}

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  userLeagues$(): Observable<UserLeague[]> {
    return this.leagueStore.select(fromLeagueRoot.selectUserLeagues);
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

  leagueStartingPositions$(): Observable<string[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueStartingPositions);
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
            this.league = leagueData;
            if (this.userTeamId) {
              this.processLeagueDataForTrade(leagueData, this.userTeamId);
              this.syncUserLeague(
                this.league,
                this.league.teams.find((t: Team) => t.id == this.userTeamId)
              );
            }
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

    const userLeagusSubscription = this.userLeagues$().subscribe(userLeagues => {
      this.userLeagues = userLeagues;
    });
    this.subscriptions.push(userLeagusSubscription);

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

    const leagueStartingPositionsSubscription = this.leagueStartingPositions$().subscribe(startingPositions => {
      if ((startingPositions || []).length) {
        this.startingPositions = startingPositions;
        this.constructStartersAndBench(true);
      }
    });
    this.subscriptions.push(leagueStartingPositionsSubscription);

    // Selected user league sub
    const selectedUserLeagueSubscription = this.selectedUserLeague$().subscribe(userLeague => {
      this.userLeague = userLeague;
      this.userTeamId = userLeague?.userTeamId;
      this.leagueId = userLeague?.leagueId;
      if (this.userTeamId && this.league) {
        this.processLeagueDataForTrade(this.league, this.userTeamId);
        this.syncUserLeague(
          this.league,
          this.league.teams.find((t: Team) => t.id == this.userTeamId)
        );
      }
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

  processLeagueDataForTrade(league: League, userTeamId: number) {
    this.leftTeam = league.teams.find(t => t.id == userTeamId);
    this.constructStartersAndBench(true);
    let sortedTeams = [...league.teams].sort(this.compareTwoTeams);
    this.leftTeamDropdownItems = sortedTeams.map(t => ({
      id: t.id.toString(),
      value: t.id,
      htmlMarkup: [t.teamName],
      selected: t.id == userTeamId,
    }));
    this.rightTeamDropdownItems = sortedTeams
      .filter(t => t.id != this.leftTeam.id)
      .map(t => ({
        id: t.id.toString(),
        value: t.id,
        htmlMarkup: [t.teamName],
        selected: t.id == userTeamId,
      }));
  }

  constructStartersAndBench(isLeftTeam: boolean) {
    if ((this.startingPositions || []).length && this.league) {
      if (isLeftTeam && this.leftTeam) {
        this.leftStarters = this.rosterService.constructStarters(
          this.leftTeam.roster,
          (this.rosterService.constructStartingPositions(this.league.settings.lineup) || []).length
            ? this.startingPositions
            : DEFAULT_STARTING_POSITIONS
        );
        this.leftBench = this.leftTeam.roster.filter(player => !this.leftStarters.map(p => p.id).includes(player.id));
      }
    }
  }

  getPlayerPicture(player: Player) {
    return `../../../../assets/players/${player.id}.png`;
  }

  getPlayerProfilePicClasses(player: Player) {
    return player.position == Position.Defense.display ? 'player__profile-pic dst' : 'player__profile-pic';
  }

  onSelectLeftTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.leftTeam = this.league.teams.find(t => t.id == event.payload.dropdownItemValue);
      this.leftStarters = this.rosterService.constructStarters(
        this.leftTeam.roster,
        (this.startingPositions || []).length ? this.startingPositions : DEFAULT_STARTING_POSITIONS
      );
      this.leftBench = this.leftTeam.roster.filter(player => !this.leftStarters.map(p => p.id).includes(player.id));
      let sortedTeams = [...this.league.teams].sort(this.compareTwoTeams);
      this.rightTeamDropdownItems = sortedTeams
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
      this.rightStarters = this.rosterService.constructStarters(
        this.rightTeam.roster,
        (this.startingPositions || []).length ? this.startingPositions : DEFAULT_STARTING_POSITIONS
      );
      this.rightBench = this.rightTeam.roster.filter(player => !this.rightStarters.map(p => p.id).includes(player.id));
      let sortedTeams = [...this.league.teams].sort(this.compareTwoTeams);
      this.leftTeamDropdownItems = sortedTeams
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
    inLeftTeam ? this.tradeBlock.left.push(player) : this.tradeBlock.right.push(player);
  }

  removePlayerFromTrade(player: Player) {
    const inLeftTeam = this.leftTeam.roster.find(p => p.id == player.id);
    inLeftTeam
      ? (this.tradeBlock = { left: this.tradeBlock.left.filter(p => p.id != player.id), right: this.tradeBlock.right })
      : (this.tradeBlock = { left: this.tradeBlock.left, right: this.tradeBlock.right.filter(p => p.id != player.id) });
  }

  clearTradeBlock(isLeftSide: boolean) {
    this.tradeBlock = isLeftSide
      ? { left: [], right: this.tradeBlock.right }
      : { left: this.tradeBlock.left, right: [] };
  }

  handlePlayerClick(player: Player) {
    if (this.isSimulating) return;
    this.removePlayerFromTrade(player);
    this.tradeBlock.left = this.tradeBlock.left.filter(p => p.id != player.id);
    this.tradeBlock.right = this.tradeBlock.right.filter(p => p.id != player.id);
  }

  syncUserLeague(league: League, userTeam: Team) {
    let thisUserLeague = { ...this.userLeagues.find(ul => ul.leagueId == league.leagueId) };
    thisUserLeague.userTeamName = userTeam.teamName;
    thisUserLeague.userTeamRank = this.standingsService.determineTeamRank(league.teams, userTeam.id);
    const thisUserLeagueIndex = this.userLeagues.findIndex(ul => ul.id == thisUserLeague.id);
    const syncedUserLeagues = [
      ...this.userLeagues.slice(0, thisUserLeagueIndex),
      thisUserLeague,
      ...this.userLeagues.slice(thisUserLeagueIndex + 1),
    ];
    this.leagueStore.dispatch(new LeagueActions.SetUserLeagues(syncedUserLeagues));
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
            (this.startingPositions || []).length ? this.startingPositions : DEFAULT_STARTING_POSITIONS
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
            (this.startingPositions || []).length ? this.startingPositions : DEFAULT_STARTING_POSITIONS,
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

  compareTwoTeams(a: Team, b: Team): number {
    if (a.wins > b.wins) return -1;
    else if (a.wins < b.wins) return 1;
    else {
      return a.pointsFor > b.pointsFor ? -1 : 1;
    }
  }

  get canSimTrade() {
    return this.tradeBlock.left.length && this.tradeBlock.right.length;
  }

  closeTradeResultModal() {
    this.showTradeResultModal = false;
  }
}
