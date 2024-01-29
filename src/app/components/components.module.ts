import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal/modal.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NavOptionComponent } from './nav-option/nav-option.component';
import { LeagueStandingsComponent } from './league-standings/league-standings.component';
import { TeamRosterComponent } from './team-roster/team-roster.component';
import { DropdownComponent } from './dropdown/dropdown.component';

const components = [
  ModalComponent,
  HeaderBarComponent,
  NavOptionComponent,
  LeagueStandingsComponent,
  TeamRosterComponent,
  DropdownComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: components,
  exports: [components],
})
export class CommonComponentModule {}
