import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-rabbit-mq-config',
  templateUrl: './rabbit-mq-config.component.html',
  styleUrls: []
})
export class RabbitMqConfigComponent extends RuleNodeConfigurationComponent {

  rabbitMqConfigForm: FormGroup;

  messageProperties: string[] = [
    null,
    'BASIC',
    'TEXT_PLAIN',
    'MINIMAL_BASIC',
    'MINIMAL_PERSISTENT_BASIC',
    'PERSISTENT_BASIC',
    'PERSISTENT_TEXT_PLAIN'
  ];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.rabbitMqConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.rabbitMqConfigForm = this.fb.group({
      exchangeNamePattern: [configuration ? configuration.exchangeNamePattern : null, []],
      routingKeyPattern: [configuration ? configuration.routingKeyPattern : null, []],
      messageProperties: [configuration ? configuration.messageProperties : null, []],
      host: [configuration ? configuration.host : null, [Validators.required]],
      port: [configuration ? configuration.port : null, [Validators.required, Validators.min(1), Validators.max(65535)]],
      virtualHost: [configuration ? configuration.virtualHost : null, []],
      username: [configuration ? configuration.username : null, []],
      password: [configuration ? configuration.password : null, []],
      automaticRecoveryEnabled: [configuration ? configuration.automaticRecoveryEnabled : false, []],
      connectionTimeout: [configuration ? configuration.connectionTimeout : null, [Validators.min(0)]],
      handshakeTimeout: [configuration ? configuration.handshakeTimeout : null, [Validators.min(0)]],
      clientProperties: [configuration ? configuration.clientProperties : null, []]
    });
  }
}
