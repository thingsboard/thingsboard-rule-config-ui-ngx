import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'tb-action-node-send-rest-api-call-reply-config',
  templateUrl: './send-rest-api-call-reply-config.component.html',
  styleUrls: []
})
export class SendRestApiCallReplyConfigComponent extends RuleNodeConfigurationComponent {

  sendRestApiCallReplyConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.sendRestApiCallReplyConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.sendRestApiCallReplyConfigForm = this.fb.group({
      requestIdMetaDataAttribute: [configuration ? configuration.requestIdMetaDataAttribute : null, []],
      serviceIdMetaDataAttribute: [configuration ? configuration.serviceIdMetaDataAttribute : null, []]
    });
  }
}
