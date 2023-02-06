import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-transformation-node-json-path-config',
  templateUrl: './node-json-path-config.component.html',
  styleUrls: []
})

export class NodeJsonPathConfigComponent extends RuleNodeConfigurationComponent {

  jsonPathConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.jsonPathConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.jsonPathConfigForm = this.fb.group({
      jsonPath: [configuration ? configuration.jsonPath : null, [Validators.required]],
    });
  }
}
