import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'tb-action-node-rpc-reply-config',
  templateUrl: './rpc-reply-config.component.html',
  styleUrls: []
})
export class RpcReplyConfigComponent extends RuleNodeConfigurationComponent {

  rpcReplyConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.rpcReplyConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.rpcReplyConfigForm = this.fb.group({
      requestIdMetaDataAttribute: [configuration ? configuration.requestIdMetaDataAttribute : null, []]
    });
  }
}
