import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromApplicationRoot from '@app/state/reducers';
import { Store } from '@ngrx/store';
import { User } from './lib/models/user';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'freelunch-app';
  subscriptions: Subscription[] = [];
  user: User;

  user$(): Observable<User> {
    return this.appStore.select(fromApplicationRoot.selectUser);
  }

  constructor(public appStore: Store<fromApplicationRoot.State>, private router: Router) {}

  ngOnInit(): void {
    const userSubscription = this.user$().subscribe(user => {
      this.user = user;
    });
    this.subscriptions.push(userSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get isLoginPage() {
    return this.router.url.includes('/login');
  }
}
