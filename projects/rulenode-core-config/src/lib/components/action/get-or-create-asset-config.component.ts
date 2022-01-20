import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-get-or-create-asset-config',
  templateUrl: './get-or-create-asset-config.component.html',
  styleUrls: []
})
export class GetOrCreateAssetConfigComponent extends RuleNodeConfigurationComponent {

  getOrCreateAssetConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.getOrCreateAssetConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.getOrCreateAssetConfigForm = this.fb.group({
      namePattern: [configuration ? configuration.namePattern : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      typePattern: [configuration ? configuration.typePattern : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      labelPattern: [configuration ? configuration.labelPattern : null, []],
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
