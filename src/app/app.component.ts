import { Component, OnInit } from '@angular/core';
import { TemplateService } from './services/template.service';
import { Template } from './models/template';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  templates: Template[] = [];
  template: Template;
  selected = '';

  onMenuClick(name: string) {
    if (this.selected !== name) {
      this.selected = name;
      this.template = this.templates.find(v => v.name === name);
    }
  }

  constructor(
    public templateService: TemplateService
  ) { }

  ngOnInit() {
    this.templateService.fetchTemplates().subscribe(res => {
      this.templates = res;
      this.template = res[0];
    });
  }
}
