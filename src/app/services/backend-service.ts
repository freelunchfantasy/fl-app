import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class BackendService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getLeagueData(leagueId: number): Observable<any> {
    return this.http.post<any>(`${this.getApiUrl()}/app/league`, { id: leagueId });
  }

  getApiUrl() {
    return 'http://localhost:1234';
  }

  getSessionCookie() {
    return this.cookieService.get('session');
  }
}
