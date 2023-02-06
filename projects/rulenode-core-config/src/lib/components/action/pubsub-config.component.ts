import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-pub-sub-config',
  templateUrl: './pubsub-config.component.html',
  styleUrls: []
})
export class PubSubConfigComponent extends RuleNodeConfigurationComponent {

  pubSubConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.pubSubConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.pubSubConfigForm = this.fb.group({
      projectId: [configuration ? configuration.projectId : null, [Validators.required]],
      topicName: [configuration ? configuration.topicName : null, [Validators.required]],
      serviceAccountKey: [configuration ? configuration.serviceAccountKey : null, [Validators.required]],
      serviceAccountKeyFileName: [configuration ? configuration.serviceAccountKeyFileName : null, [Validators.required]],
      messageAttributes: [configuration ? configuration.messageAttributes : null, []]
    });
  }
}
