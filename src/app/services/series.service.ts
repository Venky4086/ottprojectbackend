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
export class SeriesService {

  private __url = environment.apiUrl;
  public headers = environment.headers;

  constructor(private http: HttpClient) { }

  list(data): Observable < any > {
    return this.http.post < any > (this.__url + '/series/admin/list', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '', 
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  

  listEpisode(data): Observable < any > {
    return this.http.post < any > (this.__url + '/series/admin/listEpisode', {
      pageNumber: data.page_no ? data.page_no : 0,
      series_id: data.series_id ? data.series_id : '', 
      season_id : data.season_id ? data.season_id : '', 
      search: data.search ? data.search : ''
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  createEpisode(data, extraData): Observable < any > {
    return this.http.post < any > (this.__url + '/series/addEpisode', {
      series_id:extraData.series_id,
      season_id:extraData.season_id,
      name: data.name.value,
      description: data.description.value,
      video_list:extraData.videoList
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  editEpisode(data, extraData): Observable < any > {
    return this.http.post < any > (this.__url + '/series/editEpisode', {
      id:extraData.id,
      name: data.name.value,
      description: data.description.value
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  create(data, thumbnail, trailer, cover, type): Observable < any > {
    return this.http.post < any > (this.__url + '/series/create', {
      name: data.name.value,
      description: data.description.value,
      director: data.director.value,
      starring: data.starring.value,
      release_date:data.release_date.value,
      release_time:data.release_time.value,
      thumbnail,
      cover,
      trailer,
      for_home:data.for_home.value,
      type
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  addSeason(series_id): Observable < any > {
    return this.http.post < any > (this.__url + '/series/addSeason', {
      series_id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  updateSeries(data, extraData): Observable < any > {
    return this.http.post < any > (this.__url + '/series/update', {
      id: extraData.id,
      name: data.name.value,
      description: data.description.value,
      director: data.director.value,
      for_home: data.for_home.value,
      starring: data.starring.value,
      thumbnail:extraData.thumbnail,
      cover:extraData.cover,
      trailer:extraData.trailer,
      type:extraData.type
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  destroy(id): Observable <any> {
    return this.http.post < any > (this.__url+"/series/destroy", {
      id
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  destroySeason(series_id, id): Observable <any> {
    return this.http.post < any > (this.__url+"/series/destroySeason", {
      id,
      series_id
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  destroyEpisode(series_id, season_id, id): Observable <any> {
    return this.http.post < any > (this.__url+"/series/destroyEpisode", {
      id,
      series_id,
      season_id
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  show(id): Observable <any> {
    return this.http.post < any > (this.__url+"/series/show", {
      id
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  singleEpisode(id): Observable <any> {
    return this.http.post < any > (this.__url+"/video/detail", {
      id,
      type:'E'
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  addEpisodeWithNewLanguage(data): Observable <any> {
    return this.http.post < any > (this.__url+"/series/addEpisodeWithNewLanguage", {
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
  
  editEpisodeWithNewLanguage(data): Observable <any> {
    return this.http.post < any > (this.__url+"/series/editEpisodeWithNewLanguage", {
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