import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { GameUser, AuthUser } from '../lib/models/user';
import { UserGuess, GameEndInfo } from '@app/lib/models/user-guess';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class BackendService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAuthUserData(): Observable<AuthUser> {
    return this.http.get<AuthUser>(
      `${this.getAuthUrl()}?id_token=${this.getSessionCookie()}`
    );
  }

  getGameUserData(authUserId: string, email: string): Observable<GameUser> {
    return this.http.post<GameUser>(`${this.getApiUrl()}/auth/game-user`, {
      authUserId,
      email,
    });
  }

  getTodaysTargetWordId(today: string): Observable<number> {
    return this.http.post<number>(
      `${this.getApiUrl()}/game/todays-target-word`,
      { today }
    );
  }

  getUserGuesses(userId: number, date: string): Observable<UserGuess[]> {
    return this.http.post<UserGuess[]>(
      `${this.getApiUrl()}/game/user-guesses`,
      { userId, date }
    );
  }

  submitGuess(
    word: string,
    targetWordId: number,
    userId: number,
    currentGuessNumber: number,
    prevMatchingLetters: string
  ): Observable<any> {
    return this.http.post<any>(`${this.getApiUrl()}/game/guess-word`, {
      word,
      targetWordId,
      userId,
      currentGuessNumber,
      prevMatchingLetters,
    });
  }

  getGameEndInfo(
    userId: number,
    targetWordId: number
  ): Observable<GameEndInfo> {
    return this.http.post<GameEndInfo>(
      `${this.getApiUrl()}/game/game-end-info`,
      { userId, targetWordId }
    );
  }

  getApiUrl() {
    return 'http://localhost:1234';
  }

  getAuthUrl() {
    return 'https://www.googleapis.com/oauth2/v1/tokeninfo';
  }

  getSessionCookie() {
    return this.cookieService.get('session');
  }
}
