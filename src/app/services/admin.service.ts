import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import {
  Observable
} from 'rxjs';
import {
  map
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private __url = environment.apiUrl;
  public headers = environment.headers;

  constructor(private http: HttpClient) { }
  
  sendNotification(data): Observable < any > {
    return this.http.post < any > (this.__url + '/admin/sendNotification', {
      text:data.text,
      image:data.image 
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  dashboard(): Observable < any > {
    return this.http.post < any > (this.__url + '/admin/dashboard', {
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  trending(): Observable < any > {
    return this.http.post < any > (this.__url + '/video/trending', {
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  mostWatching(): Observable < any > {
    return this.http.post < any > (this.__url + '/video/trending', {
      tillNow:1
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
}
