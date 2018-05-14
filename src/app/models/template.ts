export interface TemplateContent {
  text: string;
  startTime: number;
  endTime: number;
}

export interface Template {
  name: string;
  content: TemplateContent[];
}
