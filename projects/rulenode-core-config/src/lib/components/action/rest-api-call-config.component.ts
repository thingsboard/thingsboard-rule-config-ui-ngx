import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpRequestType } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-rest-api-call-config',
  templateUrl: './rest-api-call-config.component.html',
  styleUrls: []
})
export class RestApiCallConfigComponent extends RuleNodeConfigurationComponent {

  restApiCallConfigForm: FormGroup;

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
      readTimeoutMs: [configuration ? configuration.readTimeoutMs : null, []],
      maxParallelRequestsCount: [configuration ? configuration.maxParallelRequestsCount : null, [Validators.min(0)]],
      headers: [configuration ? configuration.headers : null, []],
      useRedisQueueForMsgPersistence: [configuration ? configuration.useRedisQueueForMsgPersistence : false, []],
      trimQueue: [configuration ? configuration.trimQueue : false, []],
      maxQueueSize: [configuration ? configuration.maxQueueSize : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['useSimpleClientHttpFactory', 'useRedisQueueForMsgPersistence'];
  }

  protected updateValidators(emitEvent: boolean) {
    const useSimpleClientHttpFactory: boolean = this.restApiCallConfigForm.get('useSimpleClientHttpFactory').value;
    const useRedisQueueForMsgPersistence: boolean = this.restApiCallConfigForm.get('useRedisQueueForMsgPersistence').value;
    if (useSimpleClientHttpFactory) {
      this.restApiCallConfigForm.get('readTimeoutMs').setValidators([]);
    } else {
      this.restApiCallConfigForm.get('readTimeoutMs').setValidators([Validators.min(0)]);
    }
    if (useRedisQueueForMsgPersistence) {
      this.restApiCallConfigForm.get('maxQueueSize').setValidators([Validators.min(0)]);
    } else {
      this.restApiCallConfigForm.get('maxQueueSize').setValidators([]);
    }
    this.restApiCallConfigForm.get('readTimeoutMs').updateValueAndValidity({emitEvent});
    this.restApiCallConfigForm.get('maxQueueSize').updateValueAndValidity({emitEvent});
  }
}
