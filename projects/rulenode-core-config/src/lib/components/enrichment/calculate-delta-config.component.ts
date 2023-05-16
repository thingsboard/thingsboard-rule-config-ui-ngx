import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-enrichment-node-calculate-delta-config',
  templateUrl: './calculate-delta-config.component.html',
  styleUrls: ['./calcaulate-delta-config.component.scss']
})
export class CalculateDeltaConfigComponent extends RuleNodeConfigurationComponent {

  calculateDeltaConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];
  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.calculateDeltaConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.calculateDeltaConfigForm = this.fb.group({
      inputValueKey: [configuration.inputValueKey, [Validators.required, Validators.pattern(/(?:.|\s)*\S(&:.|\s)*/)]],
      outputValueKey: [configuration.outputValueKey, [Validators.required, Validators.pattern(/(?:.|\s)*\S(&:.|\s)*/)]],
      useCache: [configuration.useCache, []],
      addPeriodBetweenMsgs: [configuration.addPeriodBetweenMsgs, []],
      periodValueKey: [configuration.periodValueKey, []],
      round: [configuration.round, [Validators.min(0), Validators.max(15)]],
      tellFailureIfDeltaIsNegative: [configuration.tellFailureIfDeltaIsNegative, []]
    });
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      inputValueKey: isDefinedAndNotNull(configuration?.inputValueKey) ? configuration.inputValueKey : null,
      outputValueKey: isDefinedAndNotNull(configuration?.outputValueKey) ? configuration.outputValueKey : null,
      useCache: isDefinedAndNotNull(configuration?.useCache) ? configuration.useCache : true,
      addPeriodBetweenMsgs: isDefinedAndNotNull(configuration?.addPeriodBetweenMsgs) ? configuration.addPeriodBetweenMsgs : false,
      periodValueKey: isDefinedAndNotNull(configuration?.periodValueKey) ? configuration.periodValueKey : null,
      round: isDefinedAndNotNull(configuration?.round) ? configuration.round : null,
      tellFailureIfDeltaIsNegative: isDefinedAndNotNull(configuration?.tellFailureIfDeltaIsNegative) ?
        configuration.tellFailureIfDeltaIsNegative : true
    };
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.inputValueKey =  configuration.inputValueKey.trim();
    configuration.outputValueKey =  configuration.outputValueKey.trim();
    return configuration;
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
