import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-flow-node-rule-chain-output-config',
  templateUrl: './rule-chain-output.component.html',
  styleUrls: []
})
export class RuleChainOutputComponent extends RuleNodeConfigurationComponent {

  ruleChainOutputConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.ruleChainOutputConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.ruleChainOutputConfigForm = this.fb.group({});
  }

}
