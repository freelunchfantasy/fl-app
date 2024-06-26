import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { StandingsService } from '@app/services/standings-service';
import { League, LeagueSource, Team, UserLeague } from '@app/lib/models/league';
import { IDropdownEvent, IDropdownItem } from '@app/components/dropdown/dropdown-interfaces';
import { DropdownEvent } from '@app/components/dropdown/dropdown-constants';
import { LEAGUE_SOURCE } from '@app/lib/constants/league-sources.constants';

@Component({
  selector: 'edit-user-league-modal',
  templateUrl: './edit-user-league-modal.component.html',
  styleUrls: ['./edit-user-league-modal.component.scss'],
})
export class EditUserLeagueModal implements OnInit, OnDestroy {
  @Input()
  modalTitle: string = '';

  @Input()
  modalSubtitle: string = '';

  @Input()
  showCloseIcon?: boolean = true;

  @Input()
  leagueSources: LeagueSource[] = [];

  @Input()
  userLeague: UserLeague;

  @Output()
  dismissModal: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Subscription[] = [];

  leagueId: number;
  leagueSourceDropdownItems: IDropdownItem[] = [];
  selectedLeagueSourceId: number;

  newUserLeagueData: League;
  foundLeague: boolean = false;
  couldNotFindLeagueMessage: string = 'Something went wrong loading league data.';
  foundLeagueMessage: string;
  leagueName: string = '';
  teamDropdownItems: IDropdownItem[] = [];
  userTeamId: number;

  leagueSources$(): Observable<LeagueSource[]> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueSources);
  }

  newUserLeagueData$(): Observable<League> {
    return this.leagueStore.select(fromLeagueRoot.selectNewUserLeagueData);
  }

  newUserLeagueDataIsLoading$(): Observable<boolean> {
    return this.leagueStore.select(fromLeagueRoot.selectNewUserLeagueDataIsLoading);
  }

  constructor(private leagueStore: Store<fromLeagueRoot.State>, private standingsService: StandingsService) {}

  ngOnInit(): void {
    // League data sub
    const newUserLeagueDataSubscription = combineLatest([
      this.newUserLeagueData$(),
      this.newUserLeagueDataIsLoading$(),
    ]).subscribe(([leagueData, isLoading]) => {
      if (leagueData && !isLoading) {
        if (leagueData.foundLeague) {
          this.newUserLeagueData = leagueData;
          this.foundLeagueMessage = '';
          this.foundLeague = true;
          this.teamDropdownItems = leagueData.teams.map(t => ({
            id: t.id.toString(),
            value: t.id,
            htmlMarkup: [t.teamName],
            selected: t.id == this.userTeamId,
          }));
        } else {
          this.foundLeagueMessage = this.couldNotFindLeagueMessage;
        }
      }
    });
    this.subscriptions.push(newUserLeagueDataSubscription);

    // League sources sub
    const leagueSourcesSubscription = this.leagueSources$().subscribe(leagueSources => {
      this.leagueSources = leagueSources;
      this.leagueSourceDropdownItems = this.processLeagueSources(leagueSources);
    });
    this.subscriptions.push(leagueSourcesSubscription);

    this.getUserLeagueData();
    this.leagueName = this.userLeague.leagueName;
    this.leagueId = this.userLeague.leagueId;
    this.userTeamId = this.userLeague.userTeamId;
  }

  ngOnDestroy(): void {
    this.leagueStore.dispatch(new LeagueActions.ClearNewUserLeagueData());
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  processLeagueSources(leagueSources: LeagueSource[]): IDropdownItem[] {
    if (!(leagueSources || []).length) return [];
    this.selectedLeagueSourceId = leagueSources.find(source => source.name == LEAGUE_SOURCE.ESPN).id; // Update once support for Sleeper implemented
    return leagueSources.map(source => ({
      id: source.id.toString(),
      value: source.id,
      htmlMarkup: [source.name],
      selected: source.id == this.selectedLeagueSourceId,
    }));
  }

  getSaveUserLeagueButtonClasses() {
    return !this.selectedLeagueSourceId || !this.leagueName || !this.userTeamId
      ? 'btn save-user-league-btn invalid'
      : 'btn save-user-league-btn';
  }

  getUserLeagueData() {
    if (!this.userLeague?.leagueId) return;
    this.leagueStore.dispatch(new LeagueActions.GetNewUserLeagueData(this.userLeague.leagueId));
  }

  onSelectLeagueSource(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.selectedLeagueSourceId = event.payload.dropdownItemValue;
    }
  }

  onSelectTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.userTeamId = event.payload.dropdownItemValue;
    }
  }

  handleUpdateUserLeague() {
    if (!this.selectedLeagueSourceId || !this.leagueName || !this.userTeamId) return;
    this.leagueStore.dispatch(
      new LeagueActions.UpdateUserLeague({
        userLeagueId: this.userLeague.id,
        userTeamId: this.userTeamId,
        userTeamName: this.newUserLeagueData.teams.find((t: Team) => t.id == this.userTeamId).teamName,
        userTeamRank: this.standingsService.determineTeamRank(this.newUserLeagueData.teams, this.userTeamId),
        leagueName: this.leagueName,
      })
    );
    this.handleModalClose();
  }

  handleModalClose() {
    this.dismissModal.emit();
  }
}
