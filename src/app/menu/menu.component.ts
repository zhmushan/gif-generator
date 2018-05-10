import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Template } from '../models/template';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  _menu: string[] = [];
  @Input()
  set menu(templates: Template[]) {
    this._menu = templates.map(v => v.name);
  }

  @Output()
  menuClick = new EventEmitter<string>();

  onMenuClick(name: string) {
    this.menuClick.emit(name);
  }

  constructor(
  ) { }

  ngOnInit() {
  }

}
