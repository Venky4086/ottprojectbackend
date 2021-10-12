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
export class PlanService {

  private __url = environment.apiUrl;
  public headers = environment.headers;

  constructor(private http: HttpClient) { }

  list(data): Observable < any > {
    return this.http.post < any > (this.__url + '/plan/list', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '', 
      forAdmin:1
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  statusChange(id, status): Observable <any> {
    return this.http.post < any > (this.__url+"/plan/status", {
      id,
      status,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  update(data, id): Observable <any> {
    return this.http.post < any > (this.__url+"/plan/update", {
      id : id,
      name : data.name.value,
      price : data.price.value,
      month : data.month.value,
      one_month_price : data.one_month_price.value
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  show(id): Observable <any> {
    return this.http.post < any > (this.__url+"/plan/show", {
      id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
}
