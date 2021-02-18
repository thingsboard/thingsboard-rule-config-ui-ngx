import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';

@Component({
  selector: 'tb-enrichment-node-calculate-delta-config',
  templateUrl: './calculate-delta-config.component.html',
  styleUrls: []
})
export class CalculateDeltaConfigComponent extends RuleNodeConfigurationComponent {

  calculateDeltaConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.calculateDeltaConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.calculateDeltaConfigForm = this.fb.group({
      inputValueKey: [configuration ? configuration.inputValueKey : null, [Validators.required]],
      outputValueKey: [configuration ? configuration.outputValueKey : null, [Validators.required]],
      useCache: [configuration ? configuration.useCache : null, []],
      addPeriodBetweenMsgs: [configuration ? configuration.addPeriodBetweenMsgs : false, []],
      periodValueKey: [configuration ? configuration.periodValueKey : null, []],
      round: [configuration ? configuration.round : null, [Validators.min(0), Validators.max(15)]],
      tellFailureIfDeltaIsNegative: [configuration ? configuration.tellFailureIfDeltaIsNegative : null, []]
    });
  }

  protected updateValidators(emitEvent: boolean) {
    const addPeriodBetweenMsgs: boolean = this.calculateDeltaConfigForm.get('addPeriodBetweenMsgs').value;
    if (addPeriodBetweenMsgs) {
      this.calculateDeltaConfigForm.get('periodValueKey').setValidators([Validators.required]);
    } else {
      this.calculateDeltaConfigForm.get('periodValueKey').setValidators([]);
    }
    this.calculateDeltaConfigForm.get('periodValueKey').updateValueAndValidity({emitEvent});
  }

  protected validatorTriggers(): string[] {
    return ['addPeriodBetweenMsgs'];
  }
}
