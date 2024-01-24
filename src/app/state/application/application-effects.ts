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
  setSessionCookie$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ApplicationActions.SET_SESSION_COOKIE),
        map((action: ApplicationActions.SetSessionCookie) => {
          this.cookieService.set('session', action.payload);
        })
      ),
    { dispatch: false }
  );

  getAuthUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.GET_AUTH_USER_DATA),
      switchMap((action: ApplicationActions.GetAuthUserData) => {
        return this.backendService.getAuthUserData().pipe(
          switchMap((result) => [
            new ApplicationActions.GetAuthUserDataSuccess(result),
          ]),
          catchError((err) =>
            of(
              new ApplicationActions.GetAuthUserDataFailure({
                ...err,
              })
            )
          )
        );
      })
    )
  );

  getUser$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationActions.GET_GAME_USER_DATA),
      map((action: ApplicationActions.GetGameUserData) => action.payload),
      switchMap((payload) => {
        return this.backendService
          .getGameUserData(payload.authUserId, payload.email)
          .pipe(
            switchMap((result) => [
              new ApplicationActions.GetGameUserDataSuccess(result),
            ]),
            catchError((err) =>
              of(
                new ApplicationActions.HandleBackendError({
                  ...err,
                })
              )
            )
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
          this.routerService.redirectTo('/login');
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
          const homeRoute = '/game';
          this.routerService.redirectTo(homeRoute);
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
