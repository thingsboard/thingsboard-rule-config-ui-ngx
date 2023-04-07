import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { WidgetContentTemplateDirective } from './widget-content-tempate.directive';
import { coerceBooleanProperty } from "@angular/cdk/coercion";

@Component({
  selector: 'tb-fieldset-component',
  templateUrl: './fieldset.component.html',
  styleUrls: [ './fieldset.component.scss' ]
})
export class FieldsetComponent {
  private widgetContentTemplate: TemplateRef<any>;
  private requiredValue: boolean;

  @Input() label;

  @Input()
  set required(value: boolean | string) {
    this.requiredValue = coerceBooleanProperty(value);
  };

  get required() {
    return this.requiredValue;
  }


  @ContentChild(WidgetContentTemplateDirective, { read: TemplateRef })
  set WidgetContentTemplate(value: TemplateRef<any>) {
    this.widgetContentTemplate = value;
  }

  get WidgetContentTemplate(): TemplateRef<any> {
    return this.widgetContentTemplate;
  }

  protected readonly requestAnimationFrame = requestAnimationFrame;
}
