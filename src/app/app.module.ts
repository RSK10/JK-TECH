import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Features from './features';
import * as Shared from './shared';
import { SignUpComponent } from './core/components/sign-up/sign-up.component';
import { LoginComponent } from './core/components/login/login.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';  
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HeaderComponent } from "./shared/component/header/header.component";
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';


@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    Shared.AddUserComponent,
    Features.DashboardComponent,
    Features.ProfileComponent,
    Features.UserManagementComponent,
    Features.DocumentsComponent,
    HeaderComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    CardModule,
    MessageModule,
    MessagesModule,
    FloatLabelModule,
    PasswordModule,
    InputTextModule,
    ToastModule,
    SidebarModule,
    ChartModule,
    TableModule,
    MenuModule,
    DropdownModule,
    ConfirmDialogModule,
    DialogModule,
    FileUploadModule,
    AvatarModule,
    FieldsetModule,
    InputTextareaModule
],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
