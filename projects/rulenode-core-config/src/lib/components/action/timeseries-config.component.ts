import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-timeseries-config',
  templateUrl: './timeseries-config.component.html',
  styleUrls: []
})
export class TimeseriesConfigComponent extends RuleNodeConfigurationComponent {

  timeseriesConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.timeseriesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.timeseriesConfigForm = this.fb.group({
      defaultTTL: [configuration ? configuration.defaultTTL : null, [Validators.required, Validators.min(0)]],
      skipLatestPersistence: [configuration ? configuration.skipLatestPersistence : false, []],
      useServerTs: [configuration ? configuration.useServerTs : false, []]
    });
  }
}
