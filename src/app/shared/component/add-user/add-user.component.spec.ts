import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUserComponent } from './add-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService, UserService } from 'src/app/service';
import { MessageService } from 'primeng/api';
import { CommonService } from 'src/app/common/common.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let commonService: jasmine.SpyObj<CommonService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['addUser']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    const commonServiceSpy = jasmine.createSpyObj('CommonService', ['markRequiredFieldsAsDirty']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AddUserComponent],
      imports: [ReactiveFormsModule, 
        FormsModule ,
        CardModule,
        InputTextModule,
        FloatLabelModule,
        ButtonModule,
        ToastModule,
        PasswordModule,
        DropdownModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: CommonService, useValue: commonServiceSpy },
        { provide: Router, useValue: routerSpy },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    commonService = TestBed.inject(CommonService) as jasmine.SpyObj<CommonService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    authService.hasRole.and.returnValue(true); // Simulate that the user is an admin.
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.signUpForm).toBeDefined();
    expect(component.signUpForm.get('email')).toBeTruthy();
    expect(component.signUpForm.get('username')).toBeTruthy();
    expect(component.signUpForm.get('password')).toBeTruthy();
    expect(component.signUpForm.get('role')).toBeTruthy();
    expect(component.signUpForm.get('createdDate')).toBeTruthy();
    expect(component.signUpForm.get('modifieddDate')).toBeTruthy();
  });

  it('should disable role field for non-admin users', () => {
    authService.hasRole.and.returnValue(true); // Simulate a non-admin user
    fixture.detectChanges();
    expect(component.signUpForm.get('role')?.disabled).toBeTrue();
  });

  it('should call addUser when form is valid and user clicks sign up', () => {
    const mockUser = { 
      email: 'test@example.com', 
      username: 'testUser', 
      password: 'password123', 
      role: 'user',
      createdDate: '03-02-2025 05:00:00 AM',
      modifieddDate: '03-02-2025 05:00:00 AM',
      description: ''
    };

    component.signUpForm.setValue(mockUser);
    userService.addUser.and.returnValue(of({}));
    
    component.onSignUp();
    
    expect(userService.addUser).toHaveBeenCalledWith(mockUser);
  });

  it('should show error message when addUser API fails', () => {
    const mockUser = { 
      email: 'test@example.com', 
      username: 'testUser', 
      password: 'password123', 
      role: 'user',
      createdDate: '03-02-2025 05:00:00 AM',
      modifieddDate: '03-02-2025 05:00:00 AM',
      description: ''
    };

    component.signUpForm.setValue(mockUser);
    userService.addUser.and.returnValue(throwError(() => new Error('User could not be added')));
    
    component.onSignUp();
    
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'User Could not be added Please try later',
      key: 'lt'
    });
  });

  it('should call closeDialog event emitter when title is "Add User"', () => {
    component.title = 'Add User';
    const closeDialogSpy = spyOn(component.closeDialog, 'emit');
    
    component.onSignUp();
    
    expect(closeDialogSpy).toHaveBeenCalledWith(true);
  });

  it('should navigate to login page when title is "Sign Up"', () => {
    component.title = 'Sign Up';
    const navigateSpy = spyOn(router, 'navigate');
    
    component.onSignUp();
    
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should mark required fields as dirty if form is invalid', () => {
    component.signUpForm.get('email')?.setValue('');
    component.onSignUp();
    
    expect(commonService.markRequiredFieldsAsDirty).toHaveBeenCalledWith(component.signUpForm);
  });
});
