import { Component } from '@angular/core';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { FetchTo, FetchToTranslation } from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-transformation-node-delete-keys-config',
  templateUrl: './delete-keys-config.component.html',
  styleUrls: ['../../../../style.scss']
})

export class DeleteKeysConfigComponent extends RuleNodeConfigurationComponent {

  deleteKeysConfigForm: FormGroup;
  deleteFrom = [];
  translation = FetchToTranslation;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private translate: TranslateService) {
    super(store);
    for (const key of this.translation.keys()) {
      this.deleteFrom.push({
        value: key,
        name: this.translate.instant(this.translation.get(key))
      });
    }
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deleteKeysConfigForm = this.fb.group({
      deleteFrom: [configuration.deleteFrom, [Validators.required]],
      keys: [configuration ? configuration.keys : null, [Validators.required]]
    });
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    let deleteFrom: FetchTo;

    if (isDefinedAndNotNull(configuration?.fromMetadata)) {
      deleteFrom = configuration.fromMetadata ? FetchTo.METADATA : FetchTo.DATA;
    } else if (isDefinedAndNotNull(configuration?.deleteFrom)) {
      deleteFrom = configuration?.deleteFrom;
    } else {
      deleteFrom = FetchTo.DATA;
    }

    return {
      keys: isDefinedAndNotNull(configuration?.keys) ? configuration.keys : null,
      deleteFrom
    };
  }

  protected configForm(): FormGroup {
    return this.deleteKeysConfigForm;
  }
}
