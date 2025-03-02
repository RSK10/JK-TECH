import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common/common.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CardModule } from 'primeng/card'; 
import { InputTextModule } from 'primeng/inputtext'; 
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';



class AuthServiceMock {
  hasRole(role: string) {
    return true;
  }
  login(email: string, password: string) {
    return of([{ id: 1, email }]);
  }
  setLoggedInUser(user: any) {}
  Authenticated$ = { next: () => {} };
}

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

class MessageServiceMock {
  add = jasmine.createSpy('add');
}

class CommonServiceMock {
  markRequiredFieldsAsDirty = jasmine.createSpy('markRequiredFieldsAsDirty');
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: AuthServiceMock;
  let routerMock: RouterMock;
  let messageServiceMock: MessageServiceMock;
  let commonServiceMock: CommonServiceMock;

  beforeEach(() => {
    authServiceMock = new AuthServiceMock();
    routerMock = new RouterMock();
    messageServiceMock = new MessageServiceMock();
    commonServiceMock = new CommonServiceMock();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule , 
        CardModule,
        InputTextModule,
        FloatLabelModule,
        ButtonModule,
        ToastModule,
        PasswordModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: CommonService, useValue: commonServiceMock }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onLogin and navigate to dashboard on successful login', () => {
    spyOn(routerMock, 'navigate');
    spyOn(messageServiceMock, 'add');
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(messageServiceMock.add).not.toHaveBeenCalled();
  });

  it('should show warning on invalid credentials', () => {
    authServiceMock.login = jasmine.createSpy().and.returnValue(of([]));
    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });
    component.onLogin();
    spyOn(messageServiceMock, 'add');
    expect(messageServiceMock.add).toHaveBeenCalledWith({ severity: 'warn', summary: 'Warning', detail: 'Invalid credentials', key: 'lt' });
  });

  it('should show error message when login fails', () => {
    authServiceMock.login = jasmine.createSpy().and.returnValue(throwError('Error'));
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onLogin();
    expect(messageServiceMock.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Error', detail: 'Error occurred during login', key: 'lt' });
  });

  it('should mark fields as dirty when form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();
    expect(commonServiceMock.markRequiredFieldsAsDirty).toHaveBeenCalledWith(component.loginForm);
  });
});
