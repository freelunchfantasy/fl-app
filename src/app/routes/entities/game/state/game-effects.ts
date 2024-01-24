import { catchError, switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';

import { BackendService } from '@app/services/backend-service';
import * as ApplicationActions from '@app/state/application/application-actions';
import * as GameActions from './game-actions';

@Injectable()
export class GameEffects {
  getTodaysTargetWordId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.GET_TODAYS_TARGET_WORD_ID),
      map((action: GameActions.GetTodaysTargetWordId) => action.payload),
      switchMap((payload) => {
        return this.backendService.getTodaysTargetWordId(payload).pipe(
          map((result) => new GameActions.GetTodaysTargetWordIdSuccess(result)),
          catchError((err) =>
            of(new ApplicationActions.HandleBackendError(err))
          )
        );
      })
    )
  );

  getUserGuesses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.GET_USER_GUESSES),
      map((action: GameActions.GetUserGuesses) => action.payload),
      switchMap((payload) => {
        return this.backendService
          .getUserGuesses(payload.userId, payload.date)
          .pipe(
            map((result) => new GameActions.GetUserGuessesSuccess(result)),
            catchError((err) =>
              of(new ApplicationActions.HandleBackendError(err))
            )
          );
      })
    )
  );

  submitGuess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.SUBMIT_GUESS),
      map((action: GameActions.SubmitGuess) => action.payload),
      switchMap((payload) => {
        return this.backendService
          .submitGuess(
            payload.word,
            payload.targetWordId,
            payload.userId,
            payload.currentGuessNumber,
            payload.prevMatchingLetters
          )
          .pipe(
            map((result) => new GameActions.SubmitGuessSuccess(result)),
            catchError((err) => of(new GameActions.SubmitGuessFailure(err)))
          );
      })
    )
  );

  getGameEndInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.GET_GAME_END_INFO),
      map((action: GameActions.GetGameEndInfo) => action.payload),
      switchMap((payload) => {
        return this.backendService
          .getGameEndInfo(payload.userId, payload.targetWordId)
          .pipe(
            map((result) => new GameActions.GetGameEndInfoSuccess(result)),
            catchError((err) =>
              of(new ApplicationActions.HandleBackendError(err))
            )
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private backendService: BackendService
  ) {}
}
