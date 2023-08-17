import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull, isObject, } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { TranslateService } from '@ngx-translate/core';
import { FetchTo } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-originator-attributes-config',
  templateUrl: './originator-attributes-config.component.html',
  styleUrls: ['../../../../style.scss']
})
export class OriginatorAttributesConfigComponent extends RuleNodeConfigurationComponent {

  originatorAttributesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.originatorAttributesConfigForm;
  }

  public touched() {
    this.originatorAttributesConfigForm.get('attributesControl').markAsTouched();
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.originatorAttributesConfigForm = this.fb.group({
      tellFailureIfAbsent: [configuration.tellFailureIfAbsent, []],
      fetchTo: [configuration.fetchTo, []],
      attributesControl: [configuration.attributesControl, []]
    });
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (isObject(configuration)) {
      configuration.attributesControl = {
        clientAttributeNames: isDefinedAndNotNull(configuration?.clientAttributeNames) ? configuration.clientAttributeNames : null,
        latestTsKeyNames: isDefinedAndNotNull(configuration?.latestTsKeyNames) ? configuration.latestTsKeyNames : null,
        serverAttributeNames: isDefinedAndNotNull(configuration?.serverAttributeNames) ? configuration.serverAttributeNames : null,
        sharedAttributeNames: isDefinedAndNotNull(configuration?.sharedAttributeNames) ? configuration.sharedAttributeNames : null,
        getLatestValueWithTs: isDefinedAndNotNull(configuration?.getLatestValueWithTs) ? configuration.getLatestValueWithTs : false
      };
    }

    return {
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA,
      tellFailureIfAbsent: isDefinedAndNotNull(configuration?.tellFailureIfAbsent) ? configuration.tellFailureIfAbsent : false,
      attributesControl: isDefinedAndNotNull(configuration?.attributesControl) ? configuration.attributesControl : null
    };
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    for (const key of Object.keys(configuration.attributesControl)) {
      configuration[key] = configuration.attributesControl[key];
    }
    delete configuration.attributesControl;
    return configuration;
  }
}
