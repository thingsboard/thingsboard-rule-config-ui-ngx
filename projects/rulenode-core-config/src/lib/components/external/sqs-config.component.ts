import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SqsQueueType, sqsQueueTypeTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-external-node-sqs-config',
  templateUrl: './sqs-config.component.html',
  styleUrls: []
})
export class SqsConfigComponent extends RuleNodeConfigurationComponent {

  sqsConfigForm: UntypedFormGroup;

  sqsQueueType = SqsQueueType;
  sqsQueueTypes = Object.keys(SqsQueueType);
  sqsQueueTypeTranslationsMap = sqsQueueTypeTranslations;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.sqsConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.sqsConfigForm = this.fb.group({
      queueType: [configuration ? configuration.queueType : null, [Validators.required]],
      queueUrlPattern: [configuration ? configuration.queueUrlPattern : null, [Validators.required]],
      delaySeconds: [configuration ? configuration.delaySeconds : null, [Validators.min(0), Validators.max(900)]],
      messageAttributes: [configuration ? configuration.messageAttributes : null, []],
      accessKeyId: [configuration ? configuration.accessKeyId : null, [Validators.required]],
      secretAccessKey: [configuration ? configuration.secretAccessKey : null, [Validators.required]],
      region: [configuration ? configuration.region : null, [Validators.required]]
    });
  }
}
