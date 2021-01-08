import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { credentialsType, credentialsTypes, credentialsTypeTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-mqtt-config',
  templateUrl: './mqtt-config.component.html',
  styleUrls: ['./mqtt-config.component.scss']
})
export class MqttConfigComponent extends RuleNodeConfigurationComponent {

  mqttConfigForm: FormGroup;

  allCredentialsTypes = credentialsTypes;
  credentialsTypeTranslationsMap = credentialsTypeTranslations;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.mqttConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.mqttConfigForm = this.fb.group({
      topicPattern: [configuration ? configuration.topicPattern : null, [Validators.required]],
      host: [configuration ? configuration.host : null, [Validators.required]],
      port: [configuration ? configuration.port : null, [Validators.required, Validators.min(1), Validators.max(65535)]],
      connectTimeoutSec: [configuration ? configuration.connectTimeoutSec : null,
        [Validators.required, Validators.min(1), Validators.max(200)]],
      clientId: [configuration ? configuration.clientId : null, []],
      cleanSession: [configuration ? configuration.cleanSession : false, []],
      ssl: [configuration ? configuration.ssl : false, []],
      credentials: this.fb.group(
        {
          type: [configuration && configuration.credentials ? configuration.credentials.type : null, [Validators.required]],
          username: [configuration && configuration.credentials ? configuration.credentials.username : null, []],
          password: [configuration && configuration.credentials ? configuration.credentials.password : null, []],
          caCert: [configuration && configuration.credentials ? configuration.credentials.caCert : null, []],
          caCertFileName: [configuration && configuration.credentials ? configuration.credentials.caCertFileName : null, []],
          privateKey: [configuration && configuration.credentials ? configuration.credentials.privateKey : null, []],
          privateKeyFileName: [configuration && configuration.credentials ? configuration.credentials.privateKeyFileName : null, []],
          cert: [configuration && configuration.credentials ? configuration.credentials.cert : null, []],
          certFileName: [configuration && configuration.credentials ? configuration.credentials.certFileName : null, []]
        }
      )
    });
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    const credentialsType: credentialsType = configuration.credentials.type;
    switch (credentialsType) {
      case 'anonymous':
        configuration.credentials = {
          type: credentialsType
        };
        break;
      case 'basic':
        configuration.credentials = {
          type: credentialsType,
          username: configuration.credentials.username,
          password: configuration.credentials.password,
        };
        break;
      case 'cert.PEM':
        delete configuration.credentials.username;
        break;
    }
    return configuration;
  }

  protected validatorTriggers(): string[] {
    return ['credentials.type'];
  }

  protected updateValidators(emitEvent: boolean) {
    const credentialsControl = this.mqttConfigForm.get('credentials');
    const credentialsType: credentialsType = credentialsControl.get('type').value;
    if (emitEvent) {
      credentialsControl.reset({ type: credentialsType }, {emitEvent: false});
    }
    credentialsControl.get('username').setValidators([]);
    credentialsControl.get('password').setValidators([]);
    credentialsControl.get('caCert').setValidators([]);
    credentialsControl.get('caCertFileName').setValidators([]);
    credentialsControl.get('privateKey').setValidators([]);
    credentialsControl.get('privateKeyFileName').setValidators([]);
    credentialsControl.get('cert').setValidators([]);
    credentialsControl.get('certFileName').setValidators([]);
    switch (credentialsType) {
      case 'anonymous':
        break;
      case 'basic':
        credentialsControl.get('username').setValidators([Validators.required]);
        credentialsControl.get('password').setValidators([Validators.required]);
        break;
      case 'cert.PEM':
        credentialsControl.get('caCert').setValidators([Validators.required]);
        credentialsControl.get('caCertFileName').setValidators([Validators.required]);
        credentialsControl.get('privateKey').setValidators([Validators.required]);
        credentialsControl.get('privateKeyFileName').setValidators([Validators.required]);
        credentialsControl.get('cert').setValidators([Validators.required]);
        credentialsControl.get('certFileName').setValidators([Validators.required]);
        break;
    }
    credentialsControl.get('username').updateValueAndValidity({emitEvent});
    credentialsControl.get('password').updateValueAndValidity({emitEvent});
    credentialsControl.get('caCert').updateValueAndValidity({emitEvent});
    credentialsControl.get('caCertFileName').updateValueAndValidity({emitEvent});
    credentialsControl.get('privateKey').updateValueAndValidity({emitEvent});
    credentialsControl.get('privateKeyFileName').updateValueAndValidity({emitEvent});
    credentialsControl.get('cert').updateValueAndValidity({emitEvent});
    credentialsControl.get('certFileName').updateValueAndValidity({emitEvent});
  }
}
