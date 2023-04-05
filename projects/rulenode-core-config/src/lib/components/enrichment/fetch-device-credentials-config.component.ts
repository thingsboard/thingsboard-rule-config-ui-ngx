import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';

@Component({
  selector: './tb-enrichment-node-fetch-device-credentials-config',
  templateUrl: './fetch-device-credentials-config.component.html'
})

export class FetchDeviceCredentialsConfigComponent extends RuleNodeConfigurationComponent {

  fetchDeviceCredentialsConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.fetchDeviceCredentialsConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.fetchDeviceCredentialsConfigForm = this.fb.group({
      fetchTo: [configuration ? configuration.fetchTo : null, []]
    });
  }
}
