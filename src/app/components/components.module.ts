import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal/modal.component';
import { HeaderBarComponent } from './header-bar/header-bar.component';

const components = [ModalComponent, HeaderBarComponent];

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: components,
  exports: [components],
})
export class CommonComponentModule {}
