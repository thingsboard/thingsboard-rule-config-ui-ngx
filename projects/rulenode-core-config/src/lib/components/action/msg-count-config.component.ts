import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-msg-count-config',
  templateUrl: './msg-count-config.component.html',
  styleUrls: []
})
export class MsgCountConfigComponent extends RuleNodeConfigurationComponent {

  msgCountConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.msgCountConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.msgCountConfigForm = this.fb.group({
      interval: [configuration ? configuration.interval : null, [Validators.required, Validators.min(1)]],
      telemetryPrefix: [configuration ? configuration.telemetryPrefix : null, [Validators.required]]
    });
  }

}
