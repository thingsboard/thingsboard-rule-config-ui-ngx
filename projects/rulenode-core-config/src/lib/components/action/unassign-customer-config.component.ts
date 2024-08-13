import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { isNotEmptyStr } from '@core/utils';

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

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      customerNamePattern: isDefinedAndNotNull(configuration?.customerNamePattern) ? configuration.customerNamePattern : null,
      unassignFromCustomer: isDefinedAndNotNull(configuration?.customerNamePattern),
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.unassignCustomerConfigForm = this.fb.group({
      customerNamePattern: [configuration.customerNamePattern , []],
      unassignFromCustomer: [configuration.unassignFromCustomer, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['unassignFromCustomer'];
  }

  protected updateValidators(emitEvent: boolean) {
    const unassignFromCustomer: boolean = this.unassignCustomerConfigForm.get('unassignFromCustomer').value;
    if (unassignFromCustomer) {
      this.unassignCustomerConfigForm.get('customerNamePattern').setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      this.unassignCustomerConfigForm.get('customerNamePattern').setValidators([]);
    }
    this.unassignCustomerConfigForm.get('customerNamePattern').updateValueAndValidity({emitEvent});
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      customerNamePattern: configuration.unassignFromCustomer ? configuration.customerNamePattern.trim() : null
    };
  }
}
