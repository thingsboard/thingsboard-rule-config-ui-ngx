import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-filter-node-message-type-config',
  templateUrl: './message-type-config.component.html',
  styleUrls: []
})
export class MessageTypeConfigComponent extends RuleNodeConfigurationComponent {

  messageTypeConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.messageTypeConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      messageTypes: isDefinedAndNotNull(configuration?.messageTypes) ? configuration.messageTypes : null
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.messageTypeConfigForm = this.fb.group({
      messageTypes: [configuration.messageTypes, [Validators.required]]
    });
  }
}
