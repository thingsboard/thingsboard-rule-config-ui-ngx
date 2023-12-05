import { Component } from '@angular/core';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
<<<<<<< HEAD
import { FetchFromToTranslationMap, FetchTo } from '../../rulenode-core-config.models';
=======
import { FetchFromToTranslation, FetchTo } from '../../rulenode-core-config.models';
>>>>>>> master
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-transformation-node-copy-keys-config',
  templateUrl: './copy-keys-config.component.html',
  styleUrls: ['../../../../style.scss']
})

<<<<<<< HEAD
export class CopyKeysConfigComponent extends RuleNodeConfigurationComponent {

  copyKeysConfigForm: FormGroup;
  fromMetadata = [];
  translation = FetchFromToTranslationMap;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
=======
export class CopyKeysConfigComponent extends RuleNodeConfigurationComponent{
  copyKeysConfigForm: UntypedFormGroup;
  fromMetadata = [];
  translation = FetchFromToTranslation;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder,
>>>>>>> master
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
<<<<<<< HEAD
      fromMetadata: [configuration.fromMetadata, [Validators.required]],
=======
      fromMetadata: [configuration.fromMetadata , [Validators.required]],
>>>>>>> master
      keys: [configuration ? configuration.keys : null, [Validators.required]]
    });
  }

  protected configForm(): FormGroup {
    return this.copyKeysConfigForm;
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
}
