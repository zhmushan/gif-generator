import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Template } from '../models/template';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  _menu: string[] = [];
  @Input()
  set menu(menu) { this._menu = menu; }

  init() {

  }

  constructor(
    route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

}
