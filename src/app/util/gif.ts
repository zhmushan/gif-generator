import { TemplateContent } from '../models/template';
import { from } from 'rxjs';

declare var GIF: any;
export declare class GifReader {
  width: number;
  height: number;
  numFrames: (() => number);
  loopCount: (() => any);
  frameInfo: ((frame_num: any) => any);
  decodeAndBlitFrameBGRA: ((frame_num: any, pixels: any) => void);
  decodeAndBlitFrameRGBA: ((frame_num: any, pixels: any) => void);
  constructor(buf: Uint8Array)
}

const DEFAULT_FONT_SIZE = 20;
const DEFAULT_FONT_FAMILY = '"Microsoft YaHei", sans-serif';
const DEFAULT_FILL_STYLE = 'white';
const DEFAULT_STROKE_STYLE = 'black';

export const createCanvas = (width: number, height: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.font = `${DEFAULT_FONT_SIZE}px ${DEFAULT_FONT_FAMILY}`;
  context.textAlign = 'center';
  context.textBaseline = 'bottom';
  context.fillStyle = DEFAULT_FILL_STYLE;
  context.strokeStyle = DEFAULT_STROKE_STYLE;
  context.lineWidth = 3;
  context.lineJoin = 'round';

  return context;
};

export const gifParser = (file: ArrayBuffer) =>
  new GifReader(new Uint8Array(file));

export const gifEncoder = (gifReader: GifReader, context: CanvasRenderingContext2D, textInfo: TemplateContent[]) => {
  const [width, height] = [gifReader.width, gifReader.height];

  const gif = new GIF({
    width: width,
    height: height,
    workerScript: './assets/js/gif.worker.js',
  });
  const pixelBuffer = new Uint8ClampedArray(width * height * 4);

  for (let i = 0, textIndex = 0, time = 0; i < gifReader.numFrames(); i++) {
    const frameInfo = gifReader.frameInfo(i);
    gifReader.decodeAndBlitFrameRGBA(i, pixelBuffer);
    const imageData = new ImageData(pixelBuffer, width, height);
    context.putImageData(imageData, 0, 0);
    if (textIndex < textInfo.length) {
      const info = textInfo[textIndex];
      if (info.startTime <= time && time < info.endTime) {
        context.strokeText(info.text, width / 2, height - 8, width);
        context.fillText(info.text, width / 2, height - 8, width);
      }
      time += frameInfo.delay / 100;
      if (time >= info.endTime) {
        textIndex++;
      }
    }
    gif.addFrame(context, {
      copy: true,
      delay: frameInfo.delay * 10,
      dispose: frameInfo.disposal,
    });
  }

  return from(new Promise<string>(resolve => {
    gif.on('finished', (blob: Blob) => {
      resolve(window.URL.createObjectURL(blob));
    });
    gif.render();
  }));
};
