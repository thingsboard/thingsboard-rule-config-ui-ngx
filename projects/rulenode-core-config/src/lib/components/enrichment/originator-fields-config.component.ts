import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { OriginatorFields, originatorFieldsTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-originator-fields-config',
  templateUrl: './originator-fields-config.component.html',
  styleUrls: ['./originatot-fields-config.component.scss']
})
export class OriginatorFieldsConfigComponent extends RuleNodeConfigurationComponent {

  originatorFieldsConfigForm: FormGroup;
  public originatorFields: OriginatorFields[] = [];
  public originatorFieldsTranslations = originatorFieldsTranslations;
  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
    for (const field of Object.keys(OriginatorFields)) {
      this.originatorFields.push(OriginatorFields[field]);
    }
  }

  protected configForm(): FormGroup {
    return this.originatorFieldsConfigForm;
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    for (const key of Object.keys(configuration.fieldsMapping)) {
      configuration.fieldsMapping[key] = configuration.fieldsMapping[key].trim();
    }
    return configuration;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.originatorFieldsConfigForm = this.fb.group({
      fieldsMapping: [configuration ? configuration.fieldsMapping : null, [Validators.required]],
      ignoreNullStrings: [configuration ? configuration.ignoreNullStrings : null],
      fetchTo: [configuration ? configuration.fetchTo : null]
    });
  }
}
