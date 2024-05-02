import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-un-assign-to-customer-config',
  templateUrl: './unassign-customer-config.component.html',
  styleUrls: []
})
export class UnassignCustomerConfigComponent extends RuleNodeConfigurationComponent {

  unassignCustomerConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.unassignCustomerConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.unassignCustomerConfigForm = this.fb.group({
      customerNamePattern: [configuration ? configuration.customerNamePattern : null, []],
      createCustomerIfNotExists: [configuration ? configuration?.createCustomerIfNotExists : false, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['createCustomerIfNotExists'];
  }

  protected updateValidators(emitEvent: boolean) {
    const createCustomerIfNotExists: boolean = this.unassignCustomerConfigForm.get('createCustomerIfNotExists').value;
    if (createCustomerIfNotExists) {
      this.unassignCustomerConfigForm.get('customerNamePattern').setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      this.unassignCustomerConfigForm.get('customerNamePattern').setValidators([]);
    }
    this.unassignCustomerConfigForm.get('customerNamePattern').updateValueAndValidity({emitEvent});
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.customerNamePattern = configuration.customerNamePattern.trim();
    return configuration;
  }
}
