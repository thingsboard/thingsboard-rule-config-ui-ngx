import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FetchTo, FetchToRenameTranslation } from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-transformation-node-rename-keys-config',
  templateUrl: './rename-keys-config.component.html',
  styleUrls: ['./rename-keys-config.component.scss']
})
export class RenameKeysConfigComponent extends RuleNodeConfigurationComponent {
  renameKeysConfigForm: UntypedFormGroup;
  fromMetadata = [];
  translation = FetchToRenameTranslation;

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

  protected configForm(): UntypedFormGroup {
    return this.renameKeysConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.renameKeysConfigForm = this.fb.group({
      fromMetadata: [configuration ? configuration.fromMetadata : null, [Validators.required]],
      renameKeysMapping: [configuration ? configuration.renameKeysMapping : null, [Validators.required]]
    });
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    let fromMetadata: FetchTo;
    if (isDefinedAndNotNull(configuration?.fromMetadata)) {
      if (configuration.fromMetadata) {
        fromMetadata = FetchTo.METADATA;
      } else {
        fromMetadata = FetchTo.DATA;
      }
    } else {
      if (configuration?.fromMetadata) {
        fromMetadata = configuration.fromMetadata;
      } else {
        fromMetadata = FetchTo.DATA;
      }
    }

    return {
      renameKeysMapping: isDefinedAndNotNull(configuration?.renameKeysMapping) ? configuration.renameKeysMapping : null,
      fromMetadata
    };
  }
}
