import { Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'tb-node-empty-config',
  template: '<div></div>',
  styleUrls: []
})
export class EmptyConfigComponent extends RuleNodeConfigurationComponent {

  emptyConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.emptyConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.emptyConfigForm = this.fb.group({});
  }

}
