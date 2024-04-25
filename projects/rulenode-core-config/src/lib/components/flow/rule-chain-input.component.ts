import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { EntityType, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-flow-node-rule-chain-input-config',
  templateUrl: './rule-chain-input.component.html',
  styleUrls: []
})
export class RuleChainInputComponent extends RuleNodeConfigurationComponent {

  entityType = EntityType;

  ruleChainInputConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.ruleChainInputConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.ruleChainInputConfigForm = this.fb.group({
      forwardMsgToDefaultRuleChain: [configuration ? configuration?.forwardMsgToDefaultRuleChain : false, []],
      ruleChainId: [configuration ? configuration.ruleChainId : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['forwardMsgToDefaultRuleChain'];
  }

  protected updateValidators(emitEvent: boolean) {
    const forwardMsgToDefaultRuleChain: boolean = this.ruleChainInputConfigForm.get('forwardMsgToDefaultRuleChain').value;
    if (forwardMsgToDefaultRuleChain) {
      this.ruleChainInputConfigForm.get('ruleChainId').setValidators([]);
    } else {
      this.ruleChainInputConfigForm.get('ruleChainId').setValidators([Validators.required]);
    }
    this.ruleChainInputConfigForm.get('ruleChainId').updateValueAndValidity({emitEvent});
  }

}
