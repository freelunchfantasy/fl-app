import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { State } from '@app/state/reducers';
import { RouterService } from '@app/services/router-service';
import { BackendService } from '@app/services/backend-service';
import * as ApplicationActions from './application-actions';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ApplicationEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.LOGIN),
      map((action: ApplicationActions.Login) => action.payload),
      switchMap(payload => {
        return this.backendService.login(payload).pipe(
          map(result => new ApplicationActions.LoginSuccess(result)),
          catchError(err => of(new ApplicationActions.HandleBackendError(err)))
        );
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.LOG_OUT),
        map((action: ApplicationActions.LogOut) => {
          this.cookieService.delete('session');
          this.routerService.redirectTo('/');
        })
      ),
    { dispatch: false }
  );

  setSessionTokenCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.SET_SESSION_TOKEN),
        map((action: ApplicationActions.SetSessionToken) => {
          this.cookieService.set('session', action.payload);
        })
      ),
    { dispatch: false }
  );

  navigateToHome$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.NAVIGATE_TO_HOME),
        withLatestFrom(this.store$),
        map(([action, state]) => {
          const homeRoute = '/';
          this.routerService.redirectTo(homeRoute);
        })
      ),
    { dispatch: false }
  );

  navigateToLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.NAVIGATE_TO_LOGIN),
        withLatestFrom(this.store$),
        map(([action, state]) => {
          const loginRoute = '/login';
          this.routerService.redirectTo(loginRoute);
        })
      ),
    { dispatch: false }
  );

  navigateToLeague$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.NAVIGATE_TO_LEAGUE),
        withLatestFrom(this.store$),
        map(([action, state]) => {
          const leagueRoute = '/league';
          this.routerService.redirectTo(leagueRoute);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private backendService: BackendService,
    private store$: Store<State>,
    private routerService: RouterService,
    private cookieService: CookieService
  ) {}
}
