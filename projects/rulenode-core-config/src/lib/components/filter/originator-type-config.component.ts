import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { EntityType, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-filter-node-originator-type-config',
  templateUrl: './originator-type-config.component.html',
  styleUrls: []
})
export class OriginatorTypeConfigComponent extends RuleNodeConfigurationComponent {

  originatorTypeConfigForm: UntypedFormGroup;

  allowedEntityTypes: EntityType[] = [
    EntityType.DEVICE,
    EntityType.ASSET,
    EntityType.ENTITY_VIEW,
    EntityType.TENANT,
    EntityType.CUSTOMER,
    EntityType.USER,
    EntityType.DASHBOARD,
    EntityType.RULE_CHAIN,
    EntityType.RULE_NODE
  ];

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.originatorTypeConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.originatorTypeConfigForm = this.fb.group({
      originatorTypes: [configuration ? configuration.originatorTypes : null, [Validators.required]]
    });
  }

}
