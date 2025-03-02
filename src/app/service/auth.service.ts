import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/users';
  private loggedInUser: any;

  public Authenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient, 
    private router: Router
  ) 
  { 
    this.setUserIfAuthenticated()
  }
  
  private setUserIfAuthenticated() {
    const user = localStorage.getItem('user');
    if (user) {
      this.loggedInUser = JSON.parse(user)
      this.Authenticated$.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?email=${email}&password=${password}`);
  }

  setLoggedInUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    const loggedInUser = localStorage.getItem('user')
    if(loggedInUser) {
      this.loggedInUser = JSON.parse(loggedInUser);
    }
    this.Authenticated$.next(true);
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }
  

  logout() {
    this.loggedInUser = null;
    this.Authenticated$.next(false);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    return this.getLoggedInUser()?.role === role;
  }
  
}
