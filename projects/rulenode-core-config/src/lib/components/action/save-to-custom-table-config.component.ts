import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-custom-table-config',
  templateUrl: './save-to-custom-table-config.component.html',
  styleUrls: []
})
export class SaveToCustomTableConfigComponent extends RuleNodeConfigurationComponent {

  saveToCustomTableConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.saveToCustomTableConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.saveToCustomTableConfigForm = this.fb.group({
      tableName: [configuration ? configuration.tableName : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      fieldsMapping: [configuration ? configuration.fieldsMapping : null, [Validators.required]],
      defaultTtl: [configuration ? configuration.defaultTtl : 0, [Validators.required, Validators.min(0)]]
    });
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.tableName = configuration.tableName.trim();
    return configuration;
  }
}
