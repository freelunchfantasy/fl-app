// angular
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// 3rd party
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// custom components
import { ModalComponent } from './modal/modal.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NavOptionComponent } from './nav-option/nav-option.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LeagueStandingsComponent } from './league-standings/league-standings.component';
import { TeamRosterComponent } from './team-roster/team-roster.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

const components = [
  ModalComponent,
  HeaderBarComponent,
  NavOptionComponent,
  RegisterFormComponent,
  LoginFormComponent,
  ContactFormComponent,
  LeagueStandingsComponent,
  TeamRosterComponent,
  DropdownComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  declarations: components,
  exports: [components],
})
export class CommonComponentModule {}
