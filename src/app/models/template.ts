export interface Template {
  name: string;
  template: TemplateDetail[];
}

export interface TemplateDetail {
  text: string;
  startTime: number;
  endTime: number;
}
