import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-transformation-node-json-path-config',
  templateUrl: './node-json-path-config.component.html',
  styleUrls: []
})

export class NodeJsonPathConfigComponent extends RuleNodeConfigurationComponent {

  jsonPathConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.jsonPathConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.jsonPathConfigForm = this.fb.group({
      jsonPath: [configuration ? configuration.jsonPath : null, [Validators.required]],
    });
  }
}
