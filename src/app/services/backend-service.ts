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
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  private authenticatedHttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.sessionToken()}`,
    }),
    withCredentials: true,
  };

  token: string;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(payload: LoginPayload): Observable<UserResult> {
    return this.http.post<UserResult>(`${this.getApiUrl()}/auth/login`, payload, this.httpOptions);
  }

  register(payload: RegisterPayload): Observable<UserResult> {
    return this.http.post<UserResult>(`${this.getApiUrl()}/auth/register`, payload, this.httpOptions);
  }

  sendContactEmail(payload: ContactPayload): Observable<any> {
    return this.http.post<any>(`${this.getApiUrl()}/auth/send-contact-email`, payload, this.httpOptions);
  }

  getUserLeagues(): Observable<UserLeague[]> {
    return this.http.get<UserLeague[]>(`${this.getApiUrl()}/api/league/user-leagues`, this.authenticatedHttpOptions);
  }

  saveNewUserLeague(payload: NewUserLeaguePayload): Observable<number> {
    return this.http.post<number>(
      `${this.getApiUrl()}/api/league/save-user-league`,
      payload,
      this.authenticatedHttpOptions
    );
  }

  deleteUserLeague(payload: UserLeague): Observable<any> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/delete-user-league`,
      { userLeagueId: payload.id },
      this.authenticatedHttpOptions
    );
  }

  updateUserLeague(payload: UpdateUserLeaguePayload): Observable<number> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/update-user-league`,
      payload,
      this.authenticatedHttpOptions
    );
  }

  getNflTeams(): Observable<NflTeam[]> {
    return this.http.get<NflTeam[]>(`${this.getApiUrl()}/api/league/nfl-teams`, this.authenticatedHttpOptions);
  }

  getLeagueSources(): Observable<LeagueSource[]> {
    return this.http.get<LeagueSource[]>(
      `${this.getApiUrl()}/api/league/league-sources`,
      this.authenticatedHttpOptions
    );
  }

  getLeagueData(leagueId: number, userTeamId?: number): Observable<League> {
    return this.http.post<League>(
      `${this.getApiUrl()}/api/league/get-league`,
      { leagueId, userTeamId },
      this.authenticatedHttpOptions
    );
  }

  checkUserLeague(payload: CheckUserLeaguePayload): Observable<any> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/check-user-league`,
      payload,
      this.authenticatedHttpOptions
    );
  }

  simulateLeague(leaguePayload: SimulateLeaguePayload): Observable<LeagueSimulationResult> {
    return this.http.post<LeagueSimulationResult>(
      `${this.getApiUrl()}/api/league/simulate`,
      leaguePayload,
      this.authenticatedHttpOptions
    );
  }

  simulateTrade(tradePayload: SimulateLeaguePayload[]): Observable<TradeSimulationResult> {
    return this.http.post<TradeSimulationResult>(
      `${this.getApiUrl()}/api/league/simulate-trade`,
      tradePayload,
      this.authenticatedHttpOptions
    );
  }

  shareTradeSimulationResult(payload: ShareTradeSimulationResultPayload): Observable<any> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/share-trade-simulation`,
      payload,
      this.authenticatedHttpOptions
    );
  }

  getApiUrl() {
    return 'https://freelunch-api.azurewebsites.net';
  }

  sessionToken() {
    return localStorage.getItem('session');
  }
}
