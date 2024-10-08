// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// third party
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// custom
import { LoginComponent } from './login.component';
import { CommonComponentModule } from '@app/components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, CommonComponentModule, MatProgressSpinnerModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
})
export class LoginModule {}
