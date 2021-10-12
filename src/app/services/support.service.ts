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
export class SupportService {

  private __url = environment.apiUrl;
  public headers = environment.headers;

  constructor(private http: HttpClient) { }
  
  list(data): Observable < any > {
    return this.http.post < any > (this.__url + '/admin/supportList', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '', 
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
}
