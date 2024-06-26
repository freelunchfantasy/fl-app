// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// third party
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// ngrx
import { EffectsModule } from '@ngrx/effects';
import { LeagueEffects } from './state/league-effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from '@app/routes/entities/league/state/reducer';
import * as fromLeague from './state/reducer';

// custom
import { LeagueComponent } from './league.component';
import { CommonComponentModule } from '@app/components/components.module';
import { NewUserLeagueModal } from './new-user-league-modal/new-user-league-modal.component';
import { EditUserLeagueModal } from './edit-user-league-modal/edit-user-league-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonComponentModule,
    NgxDatatableModule,
    NgxSkeletonLoaderModule,
    MatProgressSpinnerModule,
    StoreModule.forFeature('league', reducers),
    EffectsModule.forFeature([LeagueEffects]),
  ],
  declarations: [LeagueComponent, NewUserLeagueModal, EditUserLeagueModal],
  exports: [LeagueComponent],
})
export class LeagueModule {}
