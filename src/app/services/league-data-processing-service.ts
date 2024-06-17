import { League } from '@app/lib/models/league';
import { Store } from '@ngrx/store';
import * as fromLeagueRoot from '@app/routes/entities/league/state/reducer';
import * as LeagueActions from '@app/routes/entities/league/state/league-actions';
import { StandingsService } from './standings-service';
import { ScheduleService } from './schedule-service';
import { RosterService } from './roster-service';
import { Injectable } from '@angular/core';

@Injectable()
export class LeagueDataProcessingService {
  constructor(
    private leagueStore: Store<fromLeagueRoot.State>,
    private standingsService: StandingsService,
    private scheduleService: ScheduleService,
    private rosterService: RosterService
  ) {}

  processLeagueData(leagueData: League) {
    // Standings
    const leagueStandings = this.standingsService.constructStandings(leagueData.teams);
    this.leagueStore.dispatch(new LeagueActions.SetLeagueStandings(leagueStandings));

    // League schedule
    const leagueSchedule = this.scheduleService.constructLeagueSchedule(
      leagueData.teams,
      leagueData.settings.regSeasonGames
    );
    this.leagueStore.dispatch(new LeagueActions.SetLeagueSchedule(leagueSchedule));

    // Starting positions
    const startingPositions = this.rosterService.constructStartingPositions(leagueData.settings.lineup);
    this.leagueStore.dispatch(new LeagueActions.SetLeagueStartingPositions(startingPositions));
  }
}
