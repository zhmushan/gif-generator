import { Component, OnInit, Input } from '@angular/core';
import { Template, TemplateDetail } from '../models/template';
import { TemplateService } from '../services/template.service';
import { createCanvas, GifReader, gifParser, gifEncoder } from '../util/gif';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

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
      this.arraybuffer = null;
      this._select = name;
      if (this.prevGIF) { this.prevGIF.unsubscribe(); }
      for (const i of this._templates) {
        if (i.name === this._select) {
          this.template = i.template;
          this.getGif();
          break;
        }
        this.template = [];
      }
    }
  }

  blob = '' as SafeUrl;
  imgWidth = 0;
  imgHeight = 0;
  isComplete = false;
  canUse = false;
  arraybuffer: ArrayBuffer;
  prevGIF: Subscription;

  getGif() {
    this.prevGIF = this.templateService.fetchGif(this._select).subscribe(res => {
      this.arraybuffer = res;
      this.gifGenerator(this.arraybuffer);
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
    this.gifGenerator(this.arraybuffer);
  }

  onChange(e: Event) {
    this.canUse = true;
    const file = (e.target as HTMLInputElement).files[0];
    const fileData = new Blob([file]);
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = () => {
      this.arraybuffer = reader.result;
      this.gifGenerator(this.arraybuffer);
    };
  }
  addTemplate() {
    this.template = [...this.template, { text: '', startTime: 0, endTime: 0 }];
  }

  constructor(
    public templateService: TemplateService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

}
