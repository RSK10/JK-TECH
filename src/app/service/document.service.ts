import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  
  private apiUrl = 'http://localhost:3000/Documents';

  constructor(
    private http: HttpClient
  ) {}

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addDocument(file: any): Observable<any> {
    return this.http.post(this.apiUrl,file);
  }

  deleteDocument(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
