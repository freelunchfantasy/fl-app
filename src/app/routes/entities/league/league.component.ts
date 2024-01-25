import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import * as fromApplicationRoot from '@app/state/reducers';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { League, Player, Team } from '@app/lib/models/league';
import { Position } from '@app/lib/constants/position.constants';
import { constructActiveRoster } from '@app/services/active-roster-service';

@Component({
  selector: 'league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss'],
})
export class LeagueComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  league: League;
  userTeam: Team;

  // TODO: REPLACE WITH ACTUAL LOGIN AND USER INFO
  leagueId: number = 49454731;
  userTeamId: number = 1;

  activeRoster: Player[] = [];
  bench: Player[] = [];

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
    this.leagueStore.dispatch(new LeagueActions.GetLeagueData(this.leagueId));

    const leagueDataSubscriptions = combineLatest([this.leagueData$(), this.leagueDataIsLoading$()]).subscribe(
      ([leagueData, isLoading]) => {
        if (!isLoading) {
          this.processLeagueData(leagueData);
        }
      }
    );
    this.subscriptions.push(leagueDataSubscriptions);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  processLeagueData(leagueData: League) {
    this.league = leagueData;
    this.userTeam = leagueData.teams.find(team => team.id == this.userTeamId);
    this.activeRoster = constructActiveRoster(this.userTeam.roster);
    this.bench = this.userTeam.roster.filter(player => !this.activeRoster.map(p => p.id).includes(player.id));
  }

  getPlayerCssClasses(player: Player) {
    let classes = 'roster-container__player';
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
}
