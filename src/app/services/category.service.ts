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
export class CategoryService {

  private __url = environment.apiUrl;
  public headers = environment.headers;

  constructor(private http: HttpClient) { }

  mainCategorylist(data): Observable < any > {
    return this.http.post < any > (this.__url + '/category/listMainCategory', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '', 
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  subCategorylist(data): Observable < any > {
    return this.http.post < any > (this.__url + '/category/listSubCategory', {
      pageNumber: data.page_no ? data.page_no : 0, 
      search: data.search ? data.search : '',
      category_id: data.category_ids ? data.category_ids : []
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  createSubCategory(categoryData, category): Observable <any> {
    return this.http.post < any > (this.__url+"/category/createSubCategory", {
      name : categoryData.name.value,
      category
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  createMainCategory(categoryData): Observable <any> {
    return this.http.post < any > (this.__url+"/category/createMainCategory", {
      name : categoryData.name.value,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
 
  updateSubCategory(id, categoryData, category): Observable <any> {
    return this.http.post < any > (this.__url+"/category/updateSubCategory", {
      id,
      name : categoryData.name.value,
      category
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  updateMainCategory(id, categoryData): Observable <any> {
    return this.http.post < any > (this.__url+"/category/updateMainCategory", {
      id,
      name : categoryData.name.value
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  mainDelete(id): Observable <any> {
    return this.http.post < any > (this.__url+"/category/deleteMainCategory", {
      id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  mainShow(id): Observable <any> {
    return this.http.post < any > (this.__url+"/category/getMainCategory", {
      id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
  
  subShow(id): Observable <any> {
    return this.http.post < any > (this.__url+"/category/getSubCategory", {
      id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }

  subDelete(id): Observable <any> {
    return this.http.post < any > (this.__url+"/category/deleteSubCategory", {
      id,
    }, {
      headers: this.headers
    }).pipe(map(result => {
      return result;
    }))
  }
}
