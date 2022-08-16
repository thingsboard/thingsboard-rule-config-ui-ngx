import { Component } from '@angular/core';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';

@Component({
  selector: 'tb-transformation-node-copy-keys-config',
  templateUrl: './copy-keys-config.component.html',
  styleUrls: []
})

export class CopyKeysConfigComponent extends RuleNodeConfigurationComponent{
  copyKeysConfigForm: FormGroup;
  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.copyKeysConfigForm = this.fb.group({
      fromMetadata: [configuration ? configuration.fromMetadata : null, [Validators.required]],
      keys: [configuration ? configuration.keys : null, [Validators.required]]
    });
  }

  protected configForm(): FormGroup {
    return this.copyKeysConfigForm;
  }

  removeKey(key: string): void {
    const keys: string[] = this.copyKeysConfigForm.get('keys').value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.copyKeysConfigForm.get('keys').patchValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.copyKeysConfigForm.get('keys').value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.copyKeysConfigForm.get('keys').patchValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
