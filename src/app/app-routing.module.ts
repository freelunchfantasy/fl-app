import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { GameComponent } from './routes/entities/game/game.component';
import { LoginComponent } from './routes/entities/login/login.component';
import { AuthGuardService } from './services/auth-guard-service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'game',
        component: GameComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
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
