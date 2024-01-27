import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal/modal.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { NavOptionComponent } from './nav-option/nav-option.component';

const components = [ModalComponent, HeaderBarComponent, NavOptionComponent];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: components,
  exports: [components],
})
export class CommonComponentModule {}
