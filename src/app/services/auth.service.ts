import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _loginUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  letSubmitLogin(userdata){
    return this.http.post<any>(this._loginUrl+"/admin/login", userdata)
  }
}
