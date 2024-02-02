import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { LeagueComponent } from './routes/entities/league/league.component';
import { LoginComponent } from './routes/entities/login/login.component';
import { AuthGuardService } from './services/auth-guard-service';
import { TradeComponent } from './routes/entities/trade/trade.component';
import { HomeComponent } from './routes/entities/home/home.component';
import { ContactUsComponent } from './routes/entities/contact-us/contact-us.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'league',
        component: LeagueComponent,
      },
      {
        path: 'trade',
        component: TradeComponent,
      },
      {
        path: 'contact',
        component: ContactUsComponent,
      },
      { path: 'unavailable', component: PageNotFoundComponent },
    ],
  },
  { path: '**', redirectTo: 'unavailable' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  declarations: [],
  providers: [AuthGuardService],
  exports: [RouterModule],
})
export class AppRoutingModule {}
