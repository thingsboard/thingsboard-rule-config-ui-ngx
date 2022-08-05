import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  AttributeScope,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent, telemetryTypeTranslations
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
  deleteAttributesConfigForm: FormGroup;
  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;
  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.deleteAttributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deleteAttributesConfigForm = this.fb.group({
      useScopeAsPattern: [configuration ? configuration.key : null, []],
      scope: [configuration ? configuration.scope : null, [Validators.required]],
      keys: [configuration ? configuration.key : null, []]
    });
    this.deleteAttributesConfigForm.get('useScopeAsPattern').valueChanges.subscribe((value) => {
      this.deleteAttributesConfigForm.get('scope').patchValue(value ? null : AttributeScope.SERVER_SCOPE, {emitEvent:false});
      this.deleteAttributesConfigForm.get('scope').markAsUntouched();
    })
  }

  removeKey(key: string): void {
    const keys: string[] = this.deleteAttributesConfigForm.get('keys').value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.deleteAttributesConfigForm.get('keys').patchValue(keys, {emitEvent: false});
    }
  }

  addKey(event: MatChipInputEvent): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.deleteAttributesConfigForm.get('keys').value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.deleteAttributesConfigForm.get('keys').setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
