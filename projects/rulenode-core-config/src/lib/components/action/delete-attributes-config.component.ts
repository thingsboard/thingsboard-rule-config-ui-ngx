import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  AttributeScope,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  telemetryTypeTranslations,
  toTelemetryType
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';

@Component({
  selector: 'tb-action-node-delete-attributes-config',
  templateUrl: './delete-attributes-config.component.html',
  styleUrls: []
})
export class DeleteAttributesConfigComponent extends RuleNodeConfigurationComponent {
  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;

  deleteAttributesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.deleteAttributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deleteAttributesConfigForm = this.fb.group({
      scopePattern: [configuration ? configuration.scopePattern: null, Validators.required],
      keysPatterns: [configuration ? configuration.keysPatterns: null, Validators.required]
    });
  }

  removeKey(key: string, keysField: string): void {
    const keys: string[] = this.deleteAttributesConfigForm.get(keysField).value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.deleteAttributesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent, keysField: string): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.deleteAttributesConfigForm.get(keysField).value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.deleteAttributesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
