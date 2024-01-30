import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { CookieService } from 'ngx-cookie-service';
import { League, LeagueSimulationResult } from '@app/lib/models/league';
import { SimulateLeaguePayload } from '@app/lib/models/league-payloads';
import { LoginPayload, RegisterPayload } from '@app/lib/models/auth-payloads';
import { User } from '@app/lib/models/user';

@Injectable()
export class BackendService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(payload: LoginPayload): Observable<User> {
    return this.http.post<User>(`${this.getApiUrl()}/auth/login`, payload);
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.getApiUrl()}/auth/register`, payload);
  }

  getLeagueData(leagueId: number): Observable<League> {
    return this.http.post<League>(`${this.getApiUrl()}/league/get-league`, { id: leagueId });
  }

  simulateLeague(leaguePayload: SimulateLeaguePayload): Observable<LeagueSimulationResult> {
    return this.http.post<LeagueSimulationResult>(`${this.getApiUrl()}/league/simulate`, leaguePayload);
  }

  getApiUrl() {
    return 'http://localhost:1234';
  }

  sessionToken() {
    return this.cookieService.get('session');
  }
}
