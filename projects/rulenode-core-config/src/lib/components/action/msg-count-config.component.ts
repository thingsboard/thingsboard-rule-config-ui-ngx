import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-msg-count-config',
  templateUrl: './msg-count-config.component.html',
  styleUrls: []
})
export class MsgCountConfigComponent extends RuleNodeConfigurationComponent {

  msgCountConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.msgCountConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.msgCountConfigForm = this.fb.group({
      interval: [configuration ? configuration.interval : null, [Validators.required, Validators.min(1)]],
      telemetryPrefix: [configuration ? configuration.telemetryPrefix : null, [Validators.required]]
    });
  }

}
