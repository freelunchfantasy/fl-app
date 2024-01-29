import { catchError, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { BackendService } from '@app/services/backend-service';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as LeagueActions from './league-actions';

@Injectable()
export class LeagueEffects {
  getLeagueData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.GET_LEAGUE_DATA),
      map((action: LeagueActions.GetLeagueData) => action.payload),
      switchMap(payload => {
        return this.backendService.getLeagueData(payload).pipe(
          map(result => new LeagueActions.GetLeagueDataSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  simulateLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.SIMULATE_LEAGUE),
      map((action: LeagueActions.SimulateLeague) => action.payload),
      switchMap(payload => {
        return this.backendService.simulateLeague(payload).pipe(
          map(result => new LeagueActions.SimulateLeagueSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  constructor(private actions$: Actions, private backendService: BackendService) {}
}
