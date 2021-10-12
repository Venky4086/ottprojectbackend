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
export class BannerService {

  private __url = environment.apiUrl;
  public headers = environment.headers;

  constructor(private http: HttpClient) { }

  list(data): Observable < any > {
    return this.http.post < any > (this.__url + '/banner/list', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '', 
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  create(data): Observable <any> {
    return this.http.post < any > (this.__url+"/banner/create", {
      category_id : data.category_id,
      sub_category_id : data.sub_category_id,
      video_id : data.video_id,
      series_id : data.series_id,
      url:data.url
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  destroy(id): Observable <any> {
    return this.http.post < any > (this.__url+"/banner/destroy", {
      id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  updatebanner(data:any): Observable <any> {
    return this.http.post<any>(this.__url+"/banner/updateOrder",data, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
}
