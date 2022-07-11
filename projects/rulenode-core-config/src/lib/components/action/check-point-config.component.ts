import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent, ServiceType } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-check-point-config',
  templateUrl: './check-point-config.component.html',
  styleUrls: []
})
export class CheckPointConfigComponent extends RuleNodeConfigurationComponent {

  checkPointConfigForm: FormGroup;

  serviceType = ServiceType.TB_RULE_ENGINE;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.checkPointConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.checkPointConfigForm = this.fb.group({
      queueName: [configuration ? configuration.queueName : null, [Validators.required]]
    });
  }

}
