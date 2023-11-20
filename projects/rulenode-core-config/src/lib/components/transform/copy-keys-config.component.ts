import { Component } from '@angular/core';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { MatChipInputEvent } from '@angular/material/chips';
import { FetchTo, FetchFromToTranslation } from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-transformation-node-copy-keys-config',
  templateUrl: './copy-keys-config.component.html',
  styleUrls: ['../../../../style.scss']
})

export class CopyKeysConfigComponent extends RuleNodeConfigurationComponent{
  copyKeysConfigForm: UntypedFormGroup;
  fromMetadata = [];
  translation = FetchFromToTranslation;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder,
              private translate: TranslateService) {
    super(store);
    for (const key of this.translation.keys()) {
      this.fromMetadata.push({
        value: key,
        name: this.translate.instant(this.translation.get(key))
      });
    }
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.copyKeysConfigForm = this.fb.group({
      fromMetadata: [configuration.fromMetadata , [Validators.required]],
      keys: [configuration ? configuration.keys : null, [Validators.required]]
    });
  }

  protected configForm(): UntypedFormGroup {
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

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    let fromMetadata: FetchTo;

    if (isDefinedAndNotNull(configuration?.fromMetadata)) {
      fromMetadata = configuration.fromMetadata ? FetchTo.METADATA : FetchTo.DATA;
    } else {
      fromMetadata = isDefinedAndNotNull(configuration?.fromMetadata) ? configuration.fromMetadata : FetchTo.DATA;
    }

    return {
      keys: isDefinedAndNotNull(configuration?.keys) ? configuration.keys : null,
      fromMetadata
    };
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
