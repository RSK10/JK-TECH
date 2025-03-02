import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient
  ) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUser(id:any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  editUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user)
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
