import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { WidgetContentTemplateDirective } from './widget-content-tempate.directive';

@Component({
  selector: 'tb-fieldset-component',
  templateUrl: './fieldset.component.html',
  styleUrls: [ './fieldset.component.scss' ]
})
export class FieldsetComponent {
  private widgetContentTemplate: TemplateRef<any>;

  @Input() label;

  @ContentChild(WidgetContentTemplateDirective, { read: TemplateRef })
  set WidgetContentTemplate(value: TemplateRef<any>) {
    this.widgetContentTemplate = value;
  }

  get WidgetContentTemplate(): TemplateRef<any> {
    return this.widgetContentTemplate;
  }
}
