import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Template } from '../models/template';

@Injectable({
  providedIn: 'root'
})
export class GifService {

  fetch(name: string) {
    return this.http.get(`./assets/gif/${name}.gif`, {
      responseType: 'arraybuffer'
    });
  }

  constructor(
    public http: HttpClient
  ) { }
}
