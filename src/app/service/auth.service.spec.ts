import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login the user and set the authenticated state', () => {
    const mockUser = { email: 'test@example.com', password: 'password', role: 'admin' };
    
    service.login(mockUser.email, mockUser.password).subscribe((response) => {
      expect(response).toBeTruthy();
    });
    
    const req = httpMock.expectOne(`http://localhost:3000/users?email=${mockUser.email}&password=${mockUser.password}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
    expect(service.Authenticated$.value).toBe(true);
  });

  it('should set the logged-in user and store it in localStorage', () => {
    const mockUser = { email: 'test@example.com', password: 'password', role: 'admin' };
    service.setLoggedInUser(mockUser);
    expect(localStorage.getItem('user')).toBeTruthy();
    expect(service.Authenticated$.value).toBe(true);
  });

  it('should log out the user, clear user data, and navigate to login', () => {
  
    const mockUser = { email: 'test@example.com', password: 'password', role: 'admin' };
    service.setLoggedInUser(mockUser);

    service.logout();

    expect(service.getLoggedInUser()).toBeNull();
    expect(service.Authenticated$.value).toBe(false);
    expect(localStorage.getItem('user')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });


});
