import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

// Models
import { League, LeagueSimulationResult } from '@app/lib/models/league';
import { SimulateLeaguePayload } from '@app/lib/models/league-payloads';
import { ContactPayload, LoginPayload, RegisterPayload } from '@app/lib/models/auth-payloads';
import { User } from '@app/lib/models/user';

@Injectable()
export class BackendService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(payload: LoginPayload): Observable<User> {
    return this.http.post<User>(`${this.getApiUrl()}/auth/login`, payload, this.httpOptions);
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.http.post<User>(`${this.getApiUrl()}/auth/register`, payload, this.httpOptions);
  }

  sendContactEmail(payload: ContactPayload): Observable<any> {
    return this.http.post<any>(`${this.getApiUrl()}/auth/send-contact-email`, payload, this.httpOptions);
  }

  getLeagueData(leagueId: number): Observable<League> {
    return this.http.post<League>(`${this.getApiUrl()}/api/league/get-league`, { id: leagueId }, this.httpOptions);
  }

  simulateLeague(leaguePayload: SimulateLeaguePayload): Observable<LeagueSimulationResult> {
    return this.http.post<LeagueSimulationResult>(
      `${this.getApiUrl()}/api/league/simulate`,
      leaguePayload,
      this.httpOptions
    );
  }

  getApiUrl() {
    return 'http://localhost:1234';
  }

  sessionToken() {
    return this.cookieService.get('session');
  }
}
