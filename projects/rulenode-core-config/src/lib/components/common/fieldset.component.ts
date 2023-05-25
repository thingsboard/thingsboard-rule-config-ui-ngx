import { Component, Input, TemplateRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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

  get WidgetContentTemplate(): TemplateRef<any> {
    return this.widgetContentTemplate;
  }
}
