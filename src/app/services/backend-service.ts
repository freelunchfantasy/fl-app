import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
    return this.http.get<UserLeague[]>(`${this.getApiUrl()}/api/league/user-leagues`, this.httpOptions);
  }

  saveNewUserLeague(payload: NewUserLeaguePayload): Observable<number> {
    return this.http.post<number>(`${this.getApiUrl()}/api/league/save-user-league`, payload, this.httpOptions);
  }

  deleteUserLeague(payload: UserLeague): Observable<any> {
    return this.http.post<any>(
      `${this.getApiUrl()}/api/league/delete-user-league`,
      { userLeagueId: payload.id },
      this.httpOptions
    );
  }

  updateUserLeague(payload: UpdateUserLeaguePayload): Observable<number> {
    return this.http.post<any>(`${this.getApiUrl()}/api/league/update-user-league`, payload, this.httpOptions);
  }

  getNflTeams(): Observable<NflTeam[]> {
    return this.http.get<NflTeam[]>(`${this.getApiUrl()}/api/league/nfl-teams`, this.httpOptions);
  }

  getLeagueSources(): Observable<LeagueSource[]> {
    return this.http.get<LeagueSource[]>(`${this.getApiUrl()}/api/league/league-sources`, this.httpOptions);
  }

  getLeagueData(leagueId: number, userTeamId?: number): Observable<League> {
    return this.http.post<League>(
      `${this.getApiUrl()}/api/league/get-league`,
      { leagueId, userTeamId },
      this.httpOptions
    );
  }

  checkUserLeague(payload: CheckUserLeaguePayload): Observable<any> {
    return this.http.post<any>(`${this.getApiUrl()}/api/league/check-user-league`, payload, this.httpOptions);
  }

  simulateLeague(leaguePayload: SimulateLeaguePayload): Observable<LeagueSimulationResult> {
    return this.http.post<LeagueSimulationResult>(
      `${this.getApiUrl()}/api/league/simulate`,
      leaguePayload,
      this.httpOptions
    );
  }

  simulateTrade(tradePayload: SimulateLeaguePayload[]): Observable<TradeSimulationResult> {
    return this.http.post<TradeSimulationResult>(
      `${this.getApiUrl()}/api/league/simulate-trade`,
      tradePayload,
      this.httpOptions
    );
  }

  shareTradeSimulationResult(payload: ShareTradeSimulationResultPayload): Observable<any> {
    return this.http.post<any>(`${this.getApiUrl()}/api/league/share-trade-simulation`, payload, this.httpOptions);
  }

  getApiUrl() {
    return 'freelunch-api.azurewebsites.net';
  }

  sessionToken() {
    return this.cookieService.get('session');
  }
}
