import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-sns-config',
  templateUrl: './sns-config.component.html',
  styleUrls: []
})
export class SnsConfigComponent extends RuleNodeConfigurationComponent {

  snsConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.snsConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.snsConfigForm = this.fb.group({
      topicArnPattern: [configuration ? configuration.topicArnPattern : null, [Validators.required]],
      accessKeyId: [configuration ? configuration.accessKeyId : null, [Validators.required]],
      secretAccessKey: [configuration ? configuration.secretAccessKey : null, [Validators.required]],
      region: [configuration ? configuration.region : null, [Validators.required]]
    });
  }
}
