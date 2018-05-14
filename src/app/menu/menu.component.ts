import { Component, OnInit } from '@angular/core';
import { Template } from '../models/template';
import templates from '../../assets/templates.json';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  templateNames: string[];

  constructor() { }

  ngOnInit() {
    this.templateNames = (templates as Template[]).map(v => v.name);
  }

}
