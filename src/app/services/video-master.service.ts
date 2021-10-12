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
export class VideoMasterService {

  private __url = environment.apiUrl;
  public headers = environment.headers;

  constructor(private http: HttpClient) { }

  listMovie(data): Observable < any > {
    return this.http.post < any > (this.__url + '/video/movie/list', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '', 
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  listSeries(data): Observable < any > {
    return this.http.post < any > (this.__url + '/video/series/list', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '', 
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  createMovie(data, extraData): Observable < any > {
    return this.http.post < any > (this.__url + '/video/movie/create', {
      name: data.name.value,
      description: data.description.value,
      director: data.director.value,
      starring: data.starring.value,
      category:extraData.category,
      sub_category:extraData.sub_category,
      video_list:extraData.videoList,
      release_date:extraData.release_date,
      release_time:extraData.release_time
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  updateMovie(data, extraData): Observable < any > {
    return this.http.post < any > (this.__url + '/video/movie/update', {
      id: extraData.id,
      name: data.name.value,
      description: data.description.value,
      director: data.director.value,
      starring: data.starring.value,
      category:extraData.category,
      sub_category:extraData.sub_category,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  movieDestroy(id): Observable <any> {
    return this.http.post < any > (this.__url+"/video/movie/destroy", {
      id
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  videoDestroy(video_id, id): Observable <any> {
    return this.http.post < any > (this.__url+"/video/destroyLanguage", {
      id,
      video_id
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  singleMovie(id): Observable <any> {
    return this.http.post < any > (this.__url+"/video/detail", {
      id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  addMovieWithNewLanguage(data): Observable <any> {
    return this.http.post < any > (this.__url+"/video/addWithNewLanguage", {
      id: data.id,
      language_id: data.language_id,
      poster: data.poster,
      thumbnail: data.thumbnail,
      trailer: data.trailer,
      video: data.video
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  editMovieWithNewLanguage(data): Observable <any> {
    return this.http.post < any > (this.__url+"/video/editWithNewLanguage", {
      id: data.id,
      video_id: data.video_id,
      language_id: data.language_id,
      poster: data.poster,
      thumbnail: data.thumbnail,
      trailer: data.trailer,
      video: data.video
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
}