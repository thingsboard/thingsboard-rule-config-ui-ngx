import { Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-rpc-request-config',
  templateUrl: './rpc-request-config.component.html',
  styleUrls: []
})
export class RpcRequestConfigComponent extends RuleNodeConfigurationComponent implements OnInit {

  rpcRequestConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.rpcRequestConfigForm = this.fb.group({
      timeoutInSeconds: [configuration ? configuration.timeoutInSeconds : null, [Validators.required, Validators.min(0)]]
    });
    this.rpcRequestConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.rpcRequestConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }
}
