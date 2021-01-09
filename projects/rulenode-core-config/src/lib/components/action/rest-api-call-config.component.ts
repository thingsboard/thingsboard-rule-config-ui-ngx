import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpRequestType, credentialsType, credentialsTypes, credentialsTypeTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-rest-api-call-config',
  templateUrl: './rest-api-call-config.component.html',
  styleUrls: []
})
export class RestApiCallConfigComponent extends RuleNodeConfigurationComponent {

  restApiCallConfigForm: FormGroup;

  allCredentialsTypes = credentialsTypes;
  credentialsTypeTranslationsMap = credentialsTypeTranslations;

  proxySchemes: string[] = ['http', 'https'];

  httpRequestTypes = Object.keys(HttpRequestType);

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.restApiCallConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.restApiCallConfigForm = this.fb.group({
      restEndpointUrlPattern: [configuration ? configuration.restEndpointUrlPattern : null, [Validators.required]],
      requestMethod: [configuration ? configuration.requestMethod : null, [Validators.required]],
      useSimpleClientHttpFactory: [configuration ? configuration.useSimpleClientHttpFactory : false, []],
      enableProxy: [configuration ? configuration.enableProxy : false, []],
      useSystemProxyProperties: [configuration ? configuration.enableProxy : false, []],
      proxyScheme: [configuration ? configuration.proxyHost : null, []],
      proxyHost: [configuration ? configuration.proxyHost : null, []],
      proxyPort: [configuration ? configuration.proxyPort : null, []],
      proxyUser: [configuration ? configuration.proxyUser :null, []],
      proxyPassword: [configuration ? configuration.proxyPassword :null, []],
      readTimeoutMs: [configuration ? configuration.readTimeoutMs : null, []],
      maxParallelRequestsCount: [configuration ? configuration.maxParallelRequestsCount : null, [Validators.min(0)]],
      headers: [configuration ? configuration.headers : null, []],
      useRedisQueueForMsgPersistence: [configuration ? configuration.useRedisQueueForMsgPersistence : false, []],
      trimQueue: [configuration ? configuration.trimQueue : false, []],
      maxQueueSize: [configuration ? configuration.maxQueueSize : null, []],
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
    return ['useSimpleClientHttpFactory', 'useRedisQueueForMsgPersistence', 'enableProxy', 'useSystemProxyProperties', 'credentials.type'];
  }

  protected updateValidators(emitEvent: boolean) {
    const useSimpleClientHttpFactory: boolean = this.restApiCallConfigForm.get('useSimpleClientHttpFactory').value;
    const useRedisQueueForMsgPersistence: boolean = this.restApiCallConfigForm.get('useRedisQueueForMsgPersistence').value;
    const enableProxy: boolean = this.restApiCallConfigForm.get('enableProxy').value;
    const useSystemProxyProperties: boolean = this.restApiCallConfigForm.get('useSystemProxyProperties').value;

    if (enableProxy && !useSystemProxyProperties) {
      this.restApiCallConfigForm.get('proxyHost').setValidators(enableProxy ? [Validators.required] : []);
      this.restApiCallConfigForm.get('proxyPort').setValidators(enableProxy ?
        [Validators.required, Validators.min(1), Validators.max(65535)] : []);
    } else {
      this.restApiCallConfigForm.get('proxyHost').setValidators([]);
      this.restApiCallConfigForm.get('proxyPort').setValidators([]);

      if (useSimpleClientHttpFactory) {
        this.restApiCallConfigForm.get('readTimeoutMs').setValidators([]);
      } else {
        this.restApiCallConfigForm.get('readTimeoutMs').setValidators([Validators.min(0)]);
      }
    }

    if (useRedisQueueForMsgPersistence) {
      this.restApiCallConfigForm.get('maxQueueSize').setValidators([Validators.min(0)]);
    } else {
      this.restApiCallConfigForm.get('maxQueueSize').setValidators([]);
    }
    this.restApiCallConfigForm.get('readTimeoutMs').updateValueAndValidity({emitEvent});
    this.restApiCallConfigForm.get('maxQueueSize').updateValueAndValidity({emitEvent});
    this.restApiCallConfigForm.get('proxyHost').updateValueAndValidity({emitEvent});
    this.restApiCallConfigForm.get('proxyPort').updateValueAndValidity({emitEvent});

    const credentialsControl = this.restApiCallConfigForm.get('credentials');
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
        // TODO: Validator should check that or caCert or cert-key pair was specified.
        // credentialsControl.get('caCert').setValidators([Validators.required]);
        // credentialsControl.get('caCertFileName').setValidators([Validators.required]);
        // credentialsControl.get('privateKey').setValidators([Validators.required]);
        // credentialsControl.get('privateKeyFileName').setValidators([Validators.required]);
        // credentialsControl.get('cert').setValidators([Validators.required]);
        // credentialsControl.get('certFileName').setValidators([Validators.required]);
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
