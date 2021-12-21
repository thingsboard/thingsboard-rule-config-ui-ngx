import { Component, OnDestroy } from '@angular/core';
import { AppState, isNotEmptyStr } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tb-action-node-mqtt-config',
  templateUrl: './mqtt-config.component.html',
  styleUrls: ['./mqtt-config.component.scss']
})
export class MqttConfigComponent extends RuleNodeConfigurationComponent implements OnDestroy {

  mqttConfigForm: FormGroup;

  private subscriptions: Subscription[] = [];

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
      appendClientIdSuffix: [{
        value: configuration ? configuration.appendClientIdSuffix : false,
        disabled: !(configuration && isNotEmptyStr(configuration.clientId))
      }, []],
      cleanSession: [configuration ? configuration.cleanSession : false, []],
      ssl: [configuration ? configuration.ssl : false, []],
      credentials: [configuration ? configuration.credentials : null, []]
    });

    this.subscriptions.push(
      this.mqttConfigForm.get('clientId').valueChanges.subscribe((clientIdValue) => {
        if (isNotEmptyStr(clientIdValue)) {
          this.mqttConfigForm.get('appendClientIdSuffix').enable({emitEvent: false});
        } else {
          this.mqttConfigForm.get('appendClientIdSuffix').disable({emitEvent: false});
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
