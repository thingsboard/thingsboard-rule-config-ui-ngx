import { Component, ViewChild } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  AttributeScope,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent, telemetryTypeTranslations
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';

@Component({
  selector: 'tb-action-node-delete-attributes-config',
  templateUrl: './delete-attributes-config.component.html',
  styleUrls: []
})
export class DeleteAttributesConfigComponent extends RuleNodeConfigurationComponent {
  @ViewChild('attributeChipList') attributeChipList: MatChipList;

  deleteAttributesConfigForm: FormGroup;
  attributeScopeMap = AttributeScope;
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
      scope: [configuration ? configuration.scope : null, [Validators.required]],
      keys: [configuration ? configuration.keys : null, [Validators.required]],
      sendAttributesDeletedNotification: [configuration ? configuration.sendAttributesDeletedNotification : false, []],
      notifyDevice: [configuration ? configuration.notifyDevice : false, []]
    });

    this.deleteAttributesConfigForm.get('scope').valueChanges.subscribe((value) => {
      if (value !== AttributeScope.SHARED_SCOPE) {
        this.deleteAttributesConfigForm.get('notifyDevice').patchValue(false, {emitEvent: false});
      }
    });
  }

  removeKey(key: string): void {
    const keys: string[] = this.deleteAttributesConfigForm.get('keys').value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.deleteAttributesConfigForm.get('keys').patchValue(keys, {emitEvent: true});
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
        this.deleteAttributesConfigForm.get('keys').patchValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
