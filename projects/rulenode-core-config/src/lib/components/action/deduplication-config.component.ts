import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent, ServiceType } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { deduplicationStrategiesTranslations, FetchMode } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-msg-deduplication-config',
  templateUrl: './deduplication-config.component.html',
  styleUrls: ['./deduplication-config.component.scss']
})

export class DeduplicationConfigComponent extends RuleNodeConfigurationComponent {

  public serviceType = ServiceType.TB_RULE_ENGINE;
  public deduplicationConfigForm: UntypedFormGroup;
  public deduplicationStrategie = FetchMode;
  public deduplicationStrategies = Object.keys(this.deduplicationStrategie);
  public deduplicationStrategiesTranslations = deduplicationStrategiesTranslations;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.deduplicationConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deduplicationConfigForm = this.fb.group({
      interval: [isDefinedAndNotNull(configuration?.interval) ? configuration.interval : null, [Validators.required,
        Validators.min(1)]],
      strategy: [isDefinedAndNotNull(configuration?.strategy) ? configuration.strategy : null, [Validators.required]],
      outMsgType: [isDefinedAndNotNull(configuration?.outMsgType) ? configuration.outMsgType : null, [Validators.required]],
      queueName: [isDefinedAndNotNull(configuration?.queueName) ? configuration.queueName : null, [Validators.required]],
      maxPendingMsgs: [isDefinedAndNotNull(configuration?.maxPendingMsgs) ? configuration.maxPendingMsgs : null, [Validators.required,
        Validators.min(1), Validators.max(1000)]],
      maxRetries: [isDefinedAndNotNull(configuration?.maxRetries) ? configuration.maxRetries : null,
        [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  protected updateValidators(emitEvent: boolean) {
    if (this.deduplicationConfigForm.get('strategy').value === this.deduplicationStrategie.ALL) {
      this.deduplicationConfigForm.get('outMsgType').enable({emitEvent: false});
      this.deduplicationConfigForm.get('queueName').enable({emitEvent: false});
    } else {
      this.deduplicationConfigForm.get('outMsgType').disable({emitEvent: false});
      this.deduplicationConfigForm.get('queueName').disable({emitEvent: false});
    }
    this.deduplicationConfigForm.get('outMsgType').updateValueAndValidity({emitEvent});
    this.deduplicationConfigForm.get('queueName').updateValueAndValidity({emitEvent});
  }

  protected validatorTriggers(): string[] {
    return ['strategy'];
  }
}
