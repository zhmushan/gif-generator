import { Component, OnInit } from '@angular/core';
import { Template } from './models/template';
import templates from '../assets/templates.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  menu = [];

  constructor(
  ) { }

  ngOnInit() {
    this.menu = (templates as Template[]).map(v => v.name);
  }
}
