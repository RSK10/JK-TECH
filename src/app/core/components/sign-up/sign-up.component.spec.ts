import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AddUserComponent } from 'src/app/shared';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    userServiceMock = jasmine.createSpyObj('UserService', ['getUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports:[],
      declarations: [ SignUpComponent,AddUserComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have modalTitle set to "Sign Up"', () => {
    expect(component.modalTitle).toBe('Sign Up');
  });

  it('should call onSave and log the correct message', () => {
    spyOn(console, 'log');
    const message = 'User saved successfully';
    component.onSave(message);
    expect(console.log).toHaveBeenCalledWith('Received from child: ' + message);
  });

});
