import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  league: any;

  constructor(
    public appStore: Store<fromApplicationRoot.State>,
    private cookieService: CookieService,
    private leagueStore: Store<fromLeagueRoot.State>
  ) {}

  leagueData$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueData);
  }

  leagueDataIsLoading$(): Observable<any> {
    return this.leagueStore.select(fromLeagueRoot.selectLeagueDataIsLoading);
  }

  ngOnInit() {
    const leagueId = 49454731;
    this.leagueStore.dispatch(new LeagueActions.GetLeagueData(leagueId));

    const leagueDataSubscriptions = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        if (!isLoading) {
          this.league = leagueData;
        }
      }
    );
    this.subscriptions.push(leagueDataSubscriptions);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
