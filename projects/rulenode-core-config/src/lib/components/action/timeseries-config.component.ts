import { Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-timeseries-config',
  templateUrl: './timeseries-config.component.html',
  styleUrls: []
})
export class TimeseriesConfigComponent extends RuleNodeConfigurationComponent implements OnInit {

  timeseriesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.timeseriesConfigForm = this.fb.group({
      defaultTTL: [configuration ? configuration.defaultTTL : null, [Validators.required, Validators.min(0)]]
    });
    this.timeseriesConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.timeseriesConfigForm.valid) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }
}
