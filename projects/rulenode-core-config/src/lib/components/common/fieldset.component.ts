import { Component, Input } from '@angular/core';
import { coerceBoolean } from '@shared/public-api';

@Component({
  selector: 'tb-fieldset-component',
  templateUrl: './fieldset.component.html',
  styleUrls: ['./fieldset.component.scss']
})
export class FieldsetComponent {
  @Input() label;

  @Input()
  @coerceBoolean()
  required = false;

  @Input() errorText: string;

  @Input()
  @coerceBoolean()
  errorEnable = false;

  @Input()
  @coerceBoolean()
  defaultBottomPadding = true;
}
