import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { League } from '@app/lib/models/league';
import { IDropdownEvent, IDropdownItem } from '@app/components/dropdown/dropdown-interfaces';
import { DropdownEvent } from '@app/components/dropdown/dropdown-constants';

@Component({
  selector: 'new-user-league-modal',
  templateUrl: './new-user-league-modal.component.html',
  styleUrls: ['./new-user-league-modal.component.scss'],
})
export class NewUserLeagueModal implements OnInit, OnDestroy {
  @Input()
  modalTitle: string = '';

  @Input()
  modalSubtitle: string = '';

  @Input()
  showCloseIcon?: boolean = true;

  @Output()
  dismissModal: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: Subscription[] = [];

  leagueId: string = '';

  newUserLeagueData: League;
  foundLeague: boolean = false;
  leagueName: string = '';
  teamDropdownItems: IDropdownItem[] = [];
  userTeamId: number;

  newUserLeagueData$(): Observable<League> {
    return this.leagueStore.select(fromLeagueRoot.selectNewUserLeagueData);
  }

  newUserLeagueDataIsLoading$(): Observable<boolean> {
    return this.leagueStore.select(fromLeagueRoot.selectNewUserLeagueDataIsLoading);
  }

  constructor(private leagueStore: Store<fromLeagueRoot.State>) {}

  ngOnInit(): void {
    const newUserLeagueDataSubscription = combineLatest([
      this.newUserLeagueData$(),
      this.newUserLeagueDataIsLoading$(),
    ]).subscribe(([leagueData, isLoading]) => {
      console.log(leagueData, isLoading);
      if (leagueData && isLoading) {
        this.newUserLeagueData = leagueData;
        this.foundLeague = true;
        this.leagueName = leagueData.settings.name;
        this.teamDropdownItems = leagueData.teams.map(t => ({
          id: t.id.toString(),
          value: t.id,
          htmlMarkup: [t.teamName],
          selected: false,
        }));
      }
    });
    this.subscriptions.push(newUserLeagueDataSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getUserLeagueData() {
    this.leagueStore.dispatch(new LeagueActions.GetNewUserLeagueData(parseInt(this.leagueId)));
  }

  onSelectTeam(event: IDropdownEvent) {
    if (event.eventType == DropdownEvent.ItemClicked) {
      this.userTeamId = event.payload.dropdownItemValue;
    }
  }

  handleSaveNewUserLeague() {
    this.leagueStore.dispatch(
      new LeagueActions.SaveNewUserLeague({
        externalLeagueId: parseInt(this.leagueId),
        leagueName: this.leagueName,
        userTeamId: this.userTeamId,
      })
    );
  }

  handleModalClose() {
    this.dismissModal.emit();
  }
}
