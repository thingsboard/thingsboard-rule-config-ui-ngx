import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-enrichment-node-customer-attributes-config',
  templateUrl: './customer-attributes-config.component.html',
  styleUrls: []
})
export class CustomerAttributesConfigComponent extends RuleNodeConfigurationComponent {

  customerAttributesConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
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

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.customerAttributesConfigForm = this.fb.group({
      telemetry: [configuration ? configuration.telemetry : false, []],
      attrMapping: [configuration ? configuration.attrMapping : null, [Validators.required]],
      fetchTo: [configuration ? configuration.fetchTo : false]
    });
  }
}
