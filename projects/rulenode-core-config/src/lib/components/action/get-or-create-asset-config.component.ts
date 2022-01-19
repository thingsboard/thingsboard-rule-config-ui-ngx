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
      name: [configuration ? configuration.name : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      type: [configuration ? configuration.type : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      label: [configuration ? configuration.label : null, []],
      description: [configuration ? configuration.description : null, []],
    });
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.name = configuration.name ? configuration.name.trim() : null;
    configuration.type = configuration.type ? configuration.type.trim() : null;
    configuration.label = configuration.type ? configuration.label.trim() : null;
    configuration.description = configuration.type ? configuration.description.trim() : null;
    return configuration;
  }
}
