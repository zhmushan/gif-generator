import { Component, OnInit } from '@angular/core';
import { Template, TemplateContent } from '../models/template';
import { createCanvas, GifReader, gifParser, gifEncoder } from '../util/gif';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ActivatedRoute  } from '@angular/router';
import { GifService } from '../services/gif.service';
import templates from '../../assets/templates.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  name: string;
  arraybuffer: ArrayBuffer;
  blob: SafeUrl;
  imgWidth: number;
  imgHeight: number;
  isComplete: boolean;
  templateContent: TemplateContent[];
  prevSubscription: Subscription;

  init(name: string) {
    this.name = name;
    this.arraybuffer = null;
    this.blob = '';
    this.imgWidth = 0;
    this.imgHeight = 0;
    this.isComplete = false;
    const template = (templates as Template[]).find(v => v.name === this.name);
    this.templateContent = template ? template.content : [];
    if (this.prevSubscription) { this.prevSubscription.unsubscribe(); }
  }

  build() {
    this.isComplete = false;
    const gifReader = gifParser(this.arraybuffer);
    const ctx = createCanvas(gifReader.width, gifReader.height);
    [this.imgWidth, this.imgHeight] = [gifReader.width, gifReader.height];
    this.prevSubscription = gifEncoder(gifReader, ctx, this.templateContent).subscribe(blob => {
      this.blob = this.sanitizer.bypassSecurityTrustUrl(blob);
      this.isComplete = true;
    });
  }

  onChange(e: Event) {
    const file = (e.target as HTMLInputElement).files[0];
    const fileData = new Blob([file]);
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = () => {
      this.arraybuffer = reader.result;
      this.build();
    };
  }

  addTemplate() {
    this.templateContent = [...this.templateContent, { text: '', startTime: 0, endTime: 0 }];
  }

  ngOnInit() {
    this.route.params.forEach(param => {
      this.init(param.name);
      if (this.templateContent.length > 0) {
        this.gifService.fetch(this.name).subscribe(arraybuffer => {
          this.arraybuffer = arraybuffer;
          this.build();
        });
      }
    });
  }

  constructor(
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    public gifService: GifService
  ) { }

}
