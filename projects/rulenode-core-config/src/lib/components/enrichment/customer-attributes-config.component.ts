import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataToFetch, FetchTo } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-customer-attributes-config',
  templateUrl: './customer-attributes-config.component.html',
  styleUrls: []
})
export class CustomerAttributesConfigComponent extends RuleNodeConfigurationComponent {

  customerAttributesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.customerAttributesConfigForm;
  }
  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    const filteAttrMapping = {};
    for (const key of Object.keys(configuration.attrMapping)) {
      filteAttrMapping[key.trim()] = configuration.attrMapping[key].trim();
    }
    configuration.attrMapping = filteAttrMapping;
    return configuration;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      dataToFetch: isDefinedAndNotNull(configuration?.dataToFetch) ? configuration.dataToFetch : DataToFetch.ATTRIBUTES,
      attrMapping: isDefinedAndNotNull(configuration?.attrMapping) ? configuration.attrMapping : null,
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.customerAttributesConfigForm = this.fb.group({
      dataToFetch: [configuration.dataToFetch, []],
      attrMapping: [configuration.attrMapping, [Validators.required]],
      fetchTo: [configuration.fetchTo]
    });
  }

  protected readonly DataToFetch = DataToFetch;
}
