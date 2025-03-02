import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve users from the API via GET', () => {
    const mockUsers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should retrieve a user by ID from the API via GET', () => {
    const mockUser = { id: 1, name: 'John Doe' };
    const userId = 1;

    service.getUser(userId).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser); 
  });

  it('should add a user to the API via POST', () => {
    const newUser = { name: 'John Doe' };
    const mockResponse = { id: 1, ...newUser };

    service.addUser(newUser).subscribe(user => {
      expect(user).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser); 
    req.flush(mockResponse); 
  });


  it('should delete a user from the API via DELETE', () => {
    const userId = 1;

    service.deleteUser(userId).subscribe(response => {
      expect(response).toBeNull(); 
    });

    const req = httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
