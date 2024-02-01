import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { LoginModule } from './routes/entities/login/login.module';
import { LeagueModule } from './routes/entities/league/league.module';
import { TradeModule } from './routes/entities/trade/trade.module';

import { CommonComponentModule } from './components/components.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { BackendService } from './services/backend-service';
import { RouterService } from './services/router-service';
import { LeagueDataProcessingService } from './services/league-data-processing-service';
import { StandingsService } from './services/standings-service';
import { RosterService } from './services/roster-service';
import { ScheduleService } from './services/schedule-service';
import { SimulationPayloadService } from './services/simulation-payload-service';
import { InputValidationService } from './services/input-validation-service';
import { ApplicationEffects } from './state/application/application-effects';
import { reducers } from './state/reducers';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HomeModule } from './routes/entities/home/home.module';

export function getBaseHref(platformLocation: PlatformLocation): string {
  return platformLocation.getBaseHrefFromDOM();
}

const baseHrefProvider = {
  provide: APP_BASE_HREF,
  useFactory: getBaseHref,
  deps: [PlatformLocation],
};

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    FormsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([ApplicationEffects]),
    CommonComponentModule,
    HomeModule,
    LoginModule,
    LeagueModule,
    TradeModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [
    BackendService,
    RouterService,
    LeagueDataProcessingService,
    StandingsService,
    RosterService,
    ScheduleService,
    SimulationPayloadService,
    InputValidationService,
    baseHrefProvider,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
