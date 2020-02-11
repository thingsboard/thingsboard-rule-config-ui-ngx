import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'tb-enrichment-node-originator-attributes-config',
  templateUrl: './originator-attributes-config.component.html',
  styleUrls: ['./originator-attributes-config.component.scss']
})
export class OriginatorAttributesConfigComponent extends RuleNodeConfigurationComponent {

  originatorAttributesConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.originatorAttributesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.originatorAttributesConfigForm = this.fb.group({
      tellFailureIfAbsent: [configuration ? configuration.tellFailureIfAbsent : false, []],
      clientAttributeNames: [configuration ? configuration.clientAttributeNames : null, []],
      sharedAttributeNames: [configuration ? configuration.sharedAttributeNames : null, []],
      serverAttributeNames: [configuration ? configuration.serverAttributeNames : null, []],
      latestTsKeyNames: [configuration ? configuration.latestTsKeyNames : null, []],
      getLatestValueWithTs: [configuration ? configuration.getLatestValueWithTs : false, []]
    });
  }

  removeKey(key: string, keysField: string): void {
    const keys: string[] = this.originatorAttributesConfigForm.get(keysField).value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.originatorAttributesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent, keysField: string): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.originatorAttributesConfigForm.get(keysField).value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.originatorAttributesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
