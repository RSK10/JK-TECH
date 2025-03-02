import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment.prod';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import * as shared from '../shared';

@NgModule({
  declarations: [],
  imports: [
    SignUpComponent,
    LoginComponent,
    shared.AddUserComponent,
    shared.AngularMaterialModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ]
})
export class CoreModule { }
