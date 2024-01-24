// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// third party
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// ngrx
import { EffectsModule } from '@ngrx/effects';
import { GameEffects } from './state/game-effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from '@app/routes/entities/game/state/reducer';
import * as fromGame from './state/reducer';

// custom
import { GameComponent } from './game.component';
import { GameSkeletonComponent } from './game-skeleton/game-skeleton.component';
import { CommonComponentModule } from '@app/components/components.module';
import { GameEndModal } from './game-end-modal/game-end-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonComponentModule,
    NgxDatatableModule,
    NgxSkeletonLoaderModule,
    StoreModule.forFeature('game', reducers),
    EffectsModule.forFeature([GameEffects]),
  ],
  declarations: [GameComponent, GameSkeletonComponent, GameEndModal],
  exports: [GameComponent, GameSkeletonComponent],
})
export class GameModule {}
