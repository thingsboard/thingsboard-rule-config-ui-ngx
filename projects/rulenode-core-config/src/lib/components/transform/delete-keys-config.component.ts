import { Component } from '@angular/core';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { FetchTo, FetchToTranslation } from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-transformation-node-delete-keys-config',
  templateUrl: './delete-keys-config.component.html',
  styleUrls: ['../../../../style.scss']
})

export class DeleteKeysConfigComponent extends RuleNodeConfigurationComponent{
  deleteKeysConfigForm: UntypedFormGroup;
  fromMetadata = [];
  translation = FetchToTranslation;

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
    this.deleteKeysConfigForm = this.fb.group({
      dataToFetch: [configuration.fromMetadata, [Validators.required]],
      keys: [configuration ? configuration.keys : null, [Validators.required]]
    });
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    let dataToFetch: FetchTo;

    if (isDefinedAndNotNull(configuration?.fromMetadata)) {
      dataToFetch = configuration.fromMetadata ? FetchTo.METADATA : FetchTo.DATA;
    } else {
      dataToFetch = isDefinedAndNotNull(configuration?.dataToFetch) ? configuration.dataToFetch : FetchTo.DATA;
    }

    return {
      keys: isDefinedAndNotNull(configuration?.keys) ? configuration.keys : null,
      dataToFetch
    };
  }

  protected configForm(): UntypedFormGroup {
    return this.deleteKeysConfigForm;
  }
}
