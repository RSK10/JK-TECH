import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService, AuthService } from 'src/app/service';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

// Mock Services
class MockAuthService {
  getLoggedInUser() {
    return { id: 1 }; 
  }

  logout() {

  }
}

class MockUserService {
  getUser(userId: number) {
   
    return of( {
      email: "example@gmail.com",
      username: "John Doe",
      password: "jon123",
      role: "admin",
      id: 1,
      createdDate: "03-02-2025 12:15:05 PM",
      modifiedDate: "03-02-2025 01:20:04 PM",
      description: ""
    });
  }
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let mockUserService: MockUserService;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[AvatarModule,
              CardModule,
              ButtonModule,],
      declarations: [ ProfileComponent ],
      providers: [
        { provide: UserService, useClass: MockUserService }, 
        { provide: AuthService, useClass: MockAuthService }, 
        MessageService, 
        Router, 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(UserService);
    mockAuthService = TestBed.inject(AuthService);

    fixture.detectChanges(); 
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUserId from AuthService', () => {
    component.ngOnInit();
    expect(component.currentUserId).toBe(1); 
  });

  it('should call getUserDetails and assign the user data', () => {
    spyOn(mockUserService, 'getUser').and.callThrough(); 

    component.ngOnInit(); 
    fixture.detectChanges(); 

    expect(mockUserService.getUser).toHaveBeenCalledWith(1);
    expect(component.user).toEqual({ id: 1, username: 'testuser', email: 'testuser@example.com' });
  });

  it('should handle error when getUser fails', () => {
    spyOn(mockUserService, 'getUser').and.returnValue(throwError(() => new Error('Failed to fetch user')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.user).toBeUndefined(); 
  });

  it('should call logOut from AuthService', () => {
    spyOn(mockAuthService, 'logout'); 

    component.logOut(); 
    expect(mockAuthService.logout).toHaveBeenCalled(); 
  });
});
