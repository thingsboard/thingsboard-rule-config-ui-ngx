import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-filter-node-check-alarm-status-config',
  templateUrl: './check-alarm-status.component.html',
  styleUrls: ['../../../../style.scss']
})
export class CheckAlarmStatusComponent extends RuleNodeConfigurationComponent {
  alarmStatusConfigForm: FormGroup;

  searchText = '';

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.alarmStatusConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      alarmStatusList: isDefinedAndNotNull(configuration?.alarmStatusList) ? configuration.alarmStatusList : null
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.alarmStatusConfigForm = this.fb.group({
      alarmStatusList: [configuration.alarmStatusList, [Validators.required]],
    });
  }
}

