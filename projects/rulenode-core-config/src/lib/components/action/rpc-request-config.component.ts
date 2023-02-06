import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-rpc-request-config',
  templateUrl: './rpc-request-config.component.html',
  styleUrls: []
})
export class RpcRequestConfigComponent extends RuleNodeConfigurationComponent {

  rpcRequestConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.rpcRequestConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.rpcRequestConfigForm = this.fb.group({
      timeoutInSeconds: [configuration ? configuration.timeoutInSeconds : null, [Validators.required, Validators.min(0)]]
    });
  }
}
