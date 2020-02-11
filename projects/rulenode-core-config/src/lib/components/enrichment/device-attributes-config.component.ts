import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'tb-enrichment-node-device-attributes-config',
  templateUrl: './device-attributes-config.component.html',
  styleUrls: ['./device-attributes-config.component.scss']
})
export class DeviceAttributesConfigComponent extends RuleNodeConfigurationComponent {

  deviceAttributesConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.deviceAttributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deviceAttributesConfigForm = this.fb.group({
      deviceRelationsQuery: [configuration ? configuration.deviceRelationsQuery : null, [Validators.required]],
      tellFailureIfAbsent: [configuration ? configuration.tellFailureIfAbsent : false, []],
      clientAttributeNames: [configuration ? configuration.clientAttributeNames : null, []],
      sharedAttributeNames: [configuration ? configuration.sharedAttributeNames : null, []],
      serverAttributeNames: [configuration ? configuration.serverAttributeNames : null, []],
      latestTsKeyNames: [configuration ? configuration.latestTsKeyNames : null, []],
      getLatestValueWithTs: [configuration ? configuration.getLatestValueWithTs : false, []]
    });
  }

  removeKey(key: string, keysField: string): void {
    const keys: string[] = this.deviceAttributesConfigForm.get(keysField).value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.deviceAttributesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent, keysField: string): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.deviceAttributesConfigForm.get(keysField).value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.deviceAttributesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
