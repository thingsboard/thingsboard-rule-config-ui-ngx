import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-sns-config',
  templateUrl: './sns-config.component.html',
  styleUrls: []
})
export class SnsConfigComponent extends RuleNodeConfigurationComponent {

  snsConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
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
