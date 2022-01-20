import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-get-or-create-device-config',
  templateUrl: './get-or-create-device-config.component.html',
  styleUrls: []
})
export class GetOrCreateDeviceConfigComponent extends RuleNodeConfigurationComponent {

  getOrCreateDeviceConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.getOrCreateDeviceConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.getOrCreateDeviceConfigForm = this.fb.group({
      namePattern: [configuration ? configuration.namePattern : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      typePattern: [configuration ? configuration.typePattern : null, []],
      labelPattern: [configuration ? configuration.labelPattern : null, []],
      isGateway: [configuration ? configuration.isGateway : false, []],
      overwriteActivityTime: [configuration ? configuration.overwriteActivityTime : false, []],
      descriptionPattern: [configuration ? configuration.descriptionPattern : null, []],
    });
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.namePattern = configuration.namePattern ? configuration.namePattern.trim() : null;
    configuration.typePattern = configuration.typePattern ? configuration.typePattern.trim() : null;
    configuration.labelPattern = configuration.labelPattern ? configuration.labelPattern.trim() : null;
    configuration.descriptionPattern = configuration.descriptionPattern ? configuration.descriptionPattern.trim() : null;
    return configuration;
  }
}
