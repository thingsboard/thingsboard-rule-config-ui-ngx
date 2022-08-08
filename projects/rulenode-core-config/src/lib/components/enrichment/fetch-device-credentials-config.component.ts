import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';

@Component({
  selector: './tb-enrichment-node-fetch-device-credentials-config',
  templateUrl: './fetch-device-credentials-config.component.html'
})

export class FetchDeviceCredentialsConfigComponent extends RuleNodeConfigurationComponent {

  fetchDeviceCredentialsConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.fetchDeviceCredentialsConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.fetchDeviceCredentialsConfigForm = this.fb.group({
        fetchToMetadata: [configuration ? configuration.fetchToMetadata : null, []]
    });
  }
}
