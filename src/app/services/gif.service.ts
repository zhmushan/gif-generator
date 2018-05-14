import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
