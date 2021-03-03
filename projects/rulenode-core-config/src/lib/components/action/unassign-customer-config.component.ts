import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-un-assign-to-customer-config',
  templateUrl: './unassign-customer-config.component.html',
  styleUrls: []
})
export class UnassignCustomerConfigComponent extends RuleNodeConfigurationComponent {

  unassignCustomerConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.unassignCustomerConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.unassignCustomerConfigForm = this.fb.group({
      customerNamePattern: [configuration ? configuration.customerNamePattern : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      customerCacheExpiration: [configuration ? configuration.customerCacheExpiration : null, [Validators.required, Validators.min(0)]]
    });
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.customerNamePattern = configuration.customerNamePattern.trim();
    return configuration;
  }
}
