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
  selected = '';

  onMenuClick(name: string) {
    this.selected = name;
  }

  constructor(
    public templateService: TemplateService
  ) { }

  ngOnInit() {
    this.templateService.fetchTemplates().subscribe(res => {
      this.templates = res;
      this.selected = res[0].name;
    });
  }
}
