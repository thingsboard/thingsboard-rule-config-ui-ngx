import { Component } from '@angular/core';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';

@Component({
    selector: 'tb-action-node-device-state-config',
    templateUrl: './device-state-config.component.html',
    styleUrls: []
})

export class DeviceStateConfigComponent extends RuleNodeConfigurationComponent {

  deviceState: FormGroup;

  public events = [
    {name: 'Connect event', value: 'CONNECT_EVENT'},
    {name: 'Disconnect even', value: 'DISCONNECT_EVENT'},
    {name: 'Activity event', value: 'ACTIVITY_EVENT'},
    {name: 'Inactivity event', value: 'INACTIVITY_EVENT'},
  ]

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }
  protected configForm(): FormGroup {
    return this.deviceState;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration): any {
    this.deviceState = this.fb.group({
      event: [configuration ? configuration.event : null, [Validators.required]]
    })
  }

}
