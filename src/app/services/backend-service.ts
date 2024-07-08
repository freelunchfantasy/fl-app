import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';

// Models
import {
  League,
  UserLeague,
  LeagueSimulationResult,
  TradeSimulationResult,
  NflTeam,
  LeagueSource,
} from '@app/lib/models/league';
import {
  CheckUserLeaguePayload,
  NewUserLeaguePayload,
  ShareTradeSimulationResultPayload,
  SimulateLeaguePayload,
  UpdateUserLeaguePayload,
} from '@app/lib/models/league-payloads';
import { ContactPayload, LoginPayload, RegisterPayload } from '@app/lib/models/auth-payloads';
import { User, UserResult } from '@app/lib/models/user';

@Injectable()
export class BackendService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(payload: LoginPayload): Observable<UserResult> {
    return this.http.post<UserResult>(`${this.getApiUrl()}/auth/login`, payload, this.getHttpOptions());
  }

  register(payload: RegisterPayload): Observable<UserResult> {
    return this.http.post<UserResult>(`${this.getApiUrl()}/auth/register`, payload, this.getHttpOptions());
  }

  sendContactEmail(payload: ContactPayload): Observable<any> {
    return this.http.post<any>(`${this.getApiUrl()}/auth/send-contact-email`, payload, this.getHttpOptions());
  }

  getUserLeagues(): Observable<UserLeague[]> {
    return this.http.get<UserLeague[]>(
      `${this.getApiUrl()}/api/league/user-leagues`,
      this.getAuthenticatedHttpOptions()
    );
  }

  saveNewUserLeague(payload: NewUserLeaguePayload): Observable<number> {
    return this.http.post<number>(
      `${this.getApiUrl()}/api/league/save-user-league`,
      payload,
      this.getAuthenticatedHttpOptions()
    );
  }

  deleteUserLeague(payload: UserLeague): Observable<any> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/delete-user-league`,
      { userLeagueId: payload.id },
      this.getAuthenticatedHttpOptions()
    );
  }

  updateUserLeague(payload: UpdateUserLeaguePayload): Observable<number> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/update-user-league`,
      payload,
      this.getAuthenticatedHttpOptions()
    );
  }

  getNflTeams(): Observable<NflTeam[]> {
    return this.http.get<NflTeam[]>(`${this.getApiUrl()}/api/league/nfl-teams`, this.getAuthenticatedHttpOptions());
  }

  getLeagueSources(): Observable<LeagueSource[]> {
    return this.http.get<LeagueSource[]>(
      `${this.getApiUrl()}/api/league/league-sources`,
      this.getAuthenticatedHttpOptions()
    );
  }

  getLeagueData(leagueId: number, userTeamId?: number): Observable<League> {
    return this.http.post<League>(
      `${this.getApiUrl()}/api/league/get-league`,
      { leagueId, userTeamId },
      this.getAuthenticatedHttpOptions()
    );
  }

  checkUserLeague(payload: CheckUserLeaguePayload): Observable<any> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/check-user-league`,
      payload,
      this.getAuthenticatedHttpOptions()
    );
  }

  simulateLeague(leaguePayload: SimulateLeaguePayload): Observable<LeagueSimulationResult> {
    return this.http.post<LeagueSimulationResult>(
      `${this.getApiUrl()}/api/league/simulate`,
      leaguePayload,
      this.getAuthenticatedHttpOptions()
    );
  }

  simulateTrade(tradePayload: SimulateLeaguePayload[]): Observable<TradeSimulationResult> {
    return this.http.post<TradeSimulationResult>(
      `${this.getApiUrl()}/api/league/simulate-trade`,
      tradePayload,
      this.getAuthenticatedHttpOptions()
    );
  }

  shareTradeSimulationResult(payload: ShareTradeSimulationResultPayload): Observable<any> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/share-trade-simulation`,
      payload,
      this.getAuthenticatedHttpOptions()
    );
  }

  getApiUrl() {
    //return 'http://localhost:1234';
    return 'https://freelunch-api.azurewebsites.net';
  }

  sessionToken() {
    return localStorage.getItem('session');
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
    };
  }

  getAuthenticatedHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.sessionToken()}`,
      }),
      withCredentials: true,
    };
  }
}
