import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';

@Component({
  selector: 'tb-filter-node-check-message-config',
  templateUrl: './check-message-config.component.html',
  styleUrls: ['../../../../style.scss']
})
export class CheckMessageConfigComponent extends RuleNodeConfigurationComponent {

  checkMessageConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.checkMessageConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      messageNames: isDefinedAndNotNull(configuration?.messageNames) ? configuration.messageNames : null,
      metadataNames: isDefinedAndNotNull(configuration?.metadataNames) ? configuration.metadataNames : null,
      checkAllKeys: isDefinedAndNotNull(configuration?.checkAllKeys) ? configuration.checkAllKeys : false
    };
  }

  private atLeastOne(validator: ValidatorFn, controls: string[] = null) {
    return (group: FormGroup): ValidationErrors | null => {
      if (!controls) {
        controls = Object.keys(group.controls);
      }
      const hasAtLeastOne = group?.controls && controls.some(k => !validator(group.controls[k]));

      return hasAtLeastOne ? null : {atLeastOne: true};
    };
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.checkMessageConfigForm = this.fb.group({
      messageNames: [configuration.messageNames, []],
      metadataNames: [configuration.metadataNames, []],
      checkAllKeys: [configuration.checkAllKeys, []]
    }, {validators: this.atLeastOne(Validators.required, ['messageNames', 'metadataNames'])});
  }

  get touchedValidationControl(): boolean {
    return ['messageNames', 'metadataNames'].some(name => this.checkMessageConfigForm.get(name).touched);
  }
}
