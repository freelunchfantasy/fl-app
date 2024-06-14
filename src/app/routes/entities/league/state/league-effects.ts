import { catchError, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { BackendService } from '@app/services/backend-service';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as LeagueActions from './league-actions';

@Injectable()
export class LeagueEffects {
  getUserLeagues$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.GET_USER_LEAGUES),
      map((action: LeagueActions.GetUserLeagues) => action),
      switchMap(() => {
        return this.backendService.getUserLeagues().pipe(
          map(result => new LeagueActions.GetUserLeaguesSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  getNflTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.GET_NFL_TEAMS),
      map((action: LeagueActions.GetNflTeams) => action),
      switchMap(() => {
        return this.backendService.getNflTeams().pipe(
          map(result => new LeagueActions.GetNflTeamsSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  getNewUserLeagueData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.GET_NEW_USER_LEAGUE_DATA),
      map((action: LeagueActions.GetNewUserLeagueData) => action.payload),
      switchMap(payload => {
        return this.backendService.getLeagueData(payload).pipe(
          map(result => new LeagueActions.GetNewUserLeagueDataSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  saveNewUserLeague$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.SAVE_NEW_USER_LEAGUE),
      map((action: LeagueActions.SaveNewUserLeague) => action.payload),
      switchMap(payload => {
        return this.backendService.saveNewUserLeague(payload).pipe(
          map(result => new LeagueActions.SaveNewUserLeagueSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

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

  simulateTrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.SIMULATE_TRADE),
      map((action: LeagueActions.SimulateTrade) => action.payload),
      switchMap(payload => {
        return this.backendService.simulateTrade(payload).pipe(
          map(result => new LeagueActions.SimulateTradeSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  shareTradeSimulationResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeagueActions.SHARE_TRADE_SIMULATION_RESULT),
      map((action: LeagueActions.ShareTradeSimulationResult) => action.payload),
      switchMap(payload => {
        return this.backendService.shareTradeSimulationResult(payload).pipe(
          map(result => new LeagueActions.ShareTradeSimulationResultSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  constructor(private actions$: Actions, private backendService: BackendService) {}
}
