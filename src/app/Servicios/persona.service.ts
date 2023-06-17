import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

 private MyAppUrl = 'https://localhost:7218/'
 private MyApiUrl = 'api/persona/'
  constructor(private http: HttpClient) { }

  getListPersonas(): Observable<any>
  {
    return this.http.get(this.MyAppUrl + this.MyApiUrl);
  }

  deletePersonas(id: number): Observable<any>
  {
    return this.http.delete(this.MyAppUrl + this.MyApiUrl + id);
  }

  savePersona(persona: any) : Observable <any>
  {
    return this.http.post(this.MyAppUrl + this.MyApiUrl , persona);
  }
  UpdatePersona(id: number ,persona: any) : Observable <any>
  {
    return this.http.put(this.MyAppUrl + this.MyApiUrl + id , persona);
  }
}
