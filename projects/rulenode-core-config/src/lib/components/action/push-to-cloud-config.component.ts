import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { AttributeScope, RuleNodeConfiguration, RuleNodeConfigurationComponent, telemetryTypeTranslations } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-push-to-cloud-config',
  templateUrl: './push-to-cloud-config.component.html',
  styleUrls: []
})
export class PushToCloudConfigComponent extends RuleNodeConfigurationComponent {

  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;

  pushToCloudConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.pushToCloudConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.pushToCloudConfigForm = this.fb.group({
      scope: [configuration ? configuration.scope : null, [Validators.required]]
    });
  }

}
