import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { AttributeScope, RuleNodeConfiguration, RuleNodeConfigurationComponent, telemetryTypeTranslations } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-push-to-edge-config',
  templateUrl: './push-to-edge-config.component.html',
  styleUrls: []
})
export class PushToEdgeConfigComponent extends RuleNodeConfigurationComponent {

  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;

  pushToEdgeConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.pushToEdgeConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.pushToEdgeConfigForm = this.fb.group({
      scope: [configuration ? configuration.scope : null, [Validators.required]]
    });
  }

}
