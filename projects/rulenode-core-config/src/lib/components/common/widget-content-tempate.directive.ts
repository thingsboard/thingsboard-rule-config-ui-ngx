import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[tbAppWidgetContentTemplate]'
})
export class WidgetContentTemplateDirective {
  get Template(): TemplateRef<any> {
    return this.template;
  }

  constructor(private readonly template: TemplateRef<any>) {}
}
