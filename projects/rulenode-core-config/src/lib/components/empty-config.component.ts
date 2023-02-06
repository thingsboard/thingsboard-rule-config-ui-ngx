import { Component, OnInit } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'tb-node-empty-config',
  template: '<div></div>',
  styleUrls: []
})
export class EmptyConfigComponent extends RuleNodeConfigurationComponent {

  emptyConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.emptyConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.emptyConfigForm = this.fb.group({});
  }

}
