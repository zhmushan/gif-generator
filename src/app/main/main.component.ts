import { Component, OnInit, Input } from '@angular/core';
import { Template, TemplateDetail } from '../models/template';
import { TemplateService } from '../services/template.service';
import { createCanvas, GifReader, gifParser, gifEncoder } from '../util/gif';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  _templates: Template[] = [];
  @Input()
  set templates(templates: Template[]) {
    this._templates = templates || [];
  }
  template: TemplateDetail[] = [];

  _select = '';
  @Input()
  set select(name: string) {
    if (this._select !== name) {
      this._select = name;
      for (const i of this._templates) {
        if (i.name === this._select) {
          this.template = i.template;
        }
      }
      this.getGif();
    }
  }

  blob = '' as SafeUrl;
  imgWidth = 0;
  imgHeight = 0;
  isComplete = false;

  getGif() {
    this.templateService.fetchGif(this._select).subscribe(res => {
      console.log(res);
      this.gifGenerator(res);
    });
  }

  gifGenerator(file: ArrayBuffer) {
    this.isComplete = false;
    const gifReader: GifReader = gifParser(file);
    const ctx = createCanvas(gifReader.width, gifReader.height);
    this.imgWidth = gifReader.width;
    this.imgHeight = gifReader.height;
    gifEncoder(gifReader, ctx, this.template).then(blob => {
      this.blob = this.sanitizer.bypassSecurityTrustUrl(blob);
      this.isComplete = true;
    }).catch(() => {
      this.isComplete = true;
    });
  }

  build() {
    this.getGif();
  }

  constructor(
    public templateService: TemplateService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

}
