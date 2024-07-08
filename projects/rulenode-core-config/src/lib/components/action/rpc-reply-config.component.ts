import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'tb-action-node-rpc-reply-config',
  templateUrl: './rpc-reply-config.component.html',
  styleUrls: []
})
export class RpcReplyConfigComponent extends RuleNodeConfigurationComponent {

  rpcReplyConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.rpcReplyConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.rpcReplyConfigForm = this.fb.group({
      serviceIdMetaDataAttribute: [configuration ? configuration.serviceIdMetaDataAttribute : null, []],
      sessionIdMetaDataAttribute: [configuration ? configuration.sessionIdMetaDataAttribute : null, []],
      requestIdMetaDataAttribute: [configuration ? configuration.requestIdMetaDataAttribute : null, []]
    });
  }
}
