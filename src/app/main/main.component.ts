import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
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

  _template: Template;
  isComplete = false;
  imgWidth = 0;
  imgHeight = 0;
  blob = '' as SafeUrl;
  gifArraybuffer: ArrayBuffer;
  prevOp: Subscription;

  @Input()
  set template(template: Template) {
    this._template = template;
    if (template && template.name !== 'custom') {
      if (this.prevOp) { this.prevOp.remove(this.prevOp); }
      this.prevOp = this.templateService.fetchGif(this._template.name).subscribe(res => {
        this.gifArraybuffer = res;
        console.log(res)
        this.gifGenerator();
      });
    }
  }
  get template() { return this._template; }

  gifGenerator() {
    this.isComplete = false;
    const gifReader: GifReader = gifParser(this.gifArraybuffer);
    const ctx = createCanvas(gifReader.width, gifReader.height);
    this.imgWidth = gifReader.width;
    this.imgHeight = gifReader.height;
    gifEncoder(gifReader, ctx, this.template.template).then(blob => {
      this.blob = this.sanitizer.bypassSecurityTrustUrl(blob);
      this.isComplete = true;
      this.changeDetectorRef.detectChanges();
    }).catch(() => {
      this.isComplete = true;
      this.changeDetectorRef.detectChanges();
    });
  }

  build() {
    this.gifGenerator();
  }

  constructor(
    public templateService: TemplateService,
    public sanitizer: DomSanitizer,
    public changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

}
