import { Component, OnDestroy } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent, ServiceType } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FetchMode, deduplicationStrategiesTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-msg-deduplication-config',
  templateUrl: './deduplication-config.component.html',
  styleUrls: ['./deduplication-config.component.scss']
})

export class DeduplicationConfigComponent extends RuleNodeConfigurationComponent implements OnDestroy{
  private destroy$ = new Subject();

  public serviceType = ServiceType.TB_RULE_ENGINE;
  public deduplicationConfigForm: FormGroup;
  public deduplicationStrategie = FetchMode;
  public deduplicationStrategies = Object.keys(this.deduplicationStrategie);
  public deduplicationStrategiesTranslations = deduplicationStrategiesTranslations;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
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

    this.deduplicationConfigForm.get('strategy').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.enableControl(value);
    })
  }

  protected updateValidators(emitEvent: boolean) {
    this.enableControl(this.deduplicationConfigForm.get('strategy').value);
  }

  protected validatorTriggers(): string[] {
    return ['strategy'];
  }

  private enableControl(strategy) {
    if (strategy === this.deduplicationStrategie.ALL) {
      this.deduplicationConfigForm.get('outMsgType').enable({emitEvent: false});
      this.deduplicationConfigForm.get('queueName').enable({emitEvent: false});
    } else {
      this.deduplicationConfigForm.get('outMsgType').disable({emitEvent: false});
      this.deduplicationConfigForm.get('queueName').disable({emitEvent: false});
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
