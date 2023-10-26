import { Component } from '@angular/core';
import { AppState, deepTrim, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FetchTo, SvMapOption, allowedOriginatorFields } from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-enrichment-node-originator-fields-config',
  templateUrl: './originator-fields-config.component.html'
})
export class OriginatorFieldsConfigComponent extends RuleNodeConfigurationComponent {

  originatorFieldsConfigForm: FormGroup;
  public originatorFields: SvMapOption[] = [];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private translate: TranslateService) {
    super(store);
    for (const field of allowedOriginatorFields) {
      this.originatorFields.push({
        value: field.value,
        name: this.translate.instant(field.name)
      });
    }
  }

  protected configForm(): FormGroup {
    return this.originatorFieldsConfigForm;
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return deepTrim(configuration);
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      dataMapping: isDefinedAndNotNull(configuration?.dataMapping) ? configuration.dataMapping : null,
      ignoreNullStrings: isDefinedAndNotNull(configuration?.ignoreNullStrings) ? configuration.ignoreNullStrings : null,
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.originatorFieldsConfigForm = this.fb.group({
      dataMapping: [configuration.dataMapping, [Validators.required]],
      ignoreNullStrings: [configuration.ignoreNullStrings, []],
      fetchTo: [configuration.fetchTo, []]
    });
  }
}
