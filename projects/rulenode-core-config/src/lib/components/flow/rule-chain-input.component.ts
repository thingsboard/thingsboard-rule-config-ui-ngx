import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { EntityType, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-flow-node-rule-chain-input-config',
  templateUrl: './rule-chain-input.component.html',
  styleUrls: []
})
export class RuleChainInputComponent extends RuleNodeConfigurationComponent {

  entityType = EntityType;

  ruleChainInputConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.ruleChainInputConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.ruleChainInputConfigForm = this.fb.group({
      ruleChainId: [configuration ? configuration.ruleChainId : null, [Validators.required]]
    });
  }

}
