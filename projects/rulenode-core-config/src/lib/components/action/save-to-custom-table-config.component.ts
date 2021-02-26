import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-custom-table-config',
  templateUrl: './save-to-custom-table-config.component.html',
  styleUrls: []
})
export class SaveToCustomTableConfigComponent extends RuleNodeConfigurationComponent {

  saveToCustomTableConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.saveToCustomTableConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.saveToCustomTableConfigForm = this.fb.group({
      tableName: [configuration ? configuration.tableName : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      fieldsMapping: [configuration ? configuration.fieldsMapping : null, [Validators.required]]
    });
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.tableName = configuration.tableName.trim();
    return configuration;
  }
}
