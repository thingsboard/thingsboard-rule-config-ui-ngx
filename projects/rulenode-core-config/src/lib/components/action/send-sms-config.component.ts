import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-send-sms-config',
  templateUrl: './send-sms-config.component.html',
  styleUrls: []
})
export class SendSmsConfigComponent extends RuleNodeConfigurationComponent {

  sendSmsConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.sendSmsConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.sendSmsConfigForm = this.fb.group({
      numbersToTemplate: [configuration ? configuration.numbersToTemplate : null, [Validators.required]],
      smsMessageTemplate: [configuration ? configuration.smsMessageTemplate : null, [Validators.required]],
      useSystemSmsSettings: [configuration ? configuration.useSystemSmsSettings : false, []],
      smsProviderConfiguration: [configuration ? configuration.smsProviderConfiguration : null, []],
    });
  }

  protected validatorTriggers(): string[] {
    return ['useSystemSmsSettings'];
  }

  protected updateValidators(emitEvent: boolean) {
    const useSystemSmsSettings: boolean = this.sendSmsConfigForm.get('useSystemSmsSettings').value;
    if (useSystemSmsSettings) {
      this.sendSmsConfigForm.get('smsProviderConfiguration').setValidators([]);
    } else {
      this.sendSmsConfigForm.get('smsProviderConfiguration').setValidators([Validators.required]);
    }
    this.sendSmsConfigForm.get('smsProviderConfiguration').updateValueAndValidity({emitEvent});
  }

}
