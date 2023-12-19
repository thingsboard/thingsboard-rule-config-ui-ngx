import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'tb-action-node-check-point-config',
  templateUrl: './check-point-config.component.html',
  styleUrls: []
})
export class CheckPointConfigComponent extends RuleNodeConfigurationComponent {

  checkPointConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.checkPointConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.checkPointConfigForm = this.fb.group({});
  }

}
