import { Component, OnDestroy } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent, ServiceType } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tb-action-node-msg-deduplication-config',
  templateUrl: './deduplication-config.component.html',
  styleUrls: ['./deduplication-config.component.scss']
})

export class DeduplicationConfigComponent extends RuleNodeConfigurationComponent implements OnDestroy{
  private destroy$ = new Subject();

  public serviceType = ServiceType.TB_RULE_ENGINE;
  public deduplicationConfigForm: FormGroup;
  public deduplicationStrategies = [
    {name: 'First Message', value: 'FIRST'},
    {name: 'Last Message', value: 'LAST'},
    {name: ' All Messages', value: 'ALL'}
  ]
  public deduplicationIds = [
    {name: 'Originator', value: 'ORIGINATOR'},
    {name: 'Customer', value: 'CUSTOMER'},
    {name: 'Tenant', value: 'TENANT'}
  ]

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
      outMsgType: [isDefinedAndNotNull(configuration?.outMsgType) ? configuration.outMsgType : null, []],
      queueName: [isDefinedAndNotNull(configuration?.queueName) ? configuration.queueName : null, []],
      maxPendingMsgs: [isDefinedAndNotNull(configuration?.maxPendingMsgs) ? configuration.maxPendingMsgs : null, [Validators.required,
        Validators.min(1), Validators.max(1000)]],
      maxRetries: [isDefinedAndNotNull(configuration?.maxRetries) ? configuration.maxRetries : null,
        [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.deduplicationConfigForm.get('strategy').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (value === 'ALL') {
        this.deduplicationConfigForm.get('outMsgType').setValidators([Validators.required]);
        this.deduplicationConfigForm.get('outMsgType').updateValueAndValidity({emitEvent: false});
        this.deduplicationConfigForm.get('queueName').setValidators([Validators.required]);
        this.deduplicationConfigForm.get('queueName').updateValueAndValidity({emitEvent: false});
      } else {
        this.deduplicationConfigForm.get('outMsgType').patchValue('', {emitEvent: false})
        this.deduplicationConfigForm.get('outMsgType').clearValidators();
        this.deduplicationConfigForm.get('outMsgType').updateValueAndValidity({emitEvent: false});
        this.deduplicationConfigForm.get('queueName').patchValue('', {emitEvent: false})
        this.deduplicationConfigForm.get('queueName').clearValidators();
        this.deduplicationConfigForm.get('queueName').updateValueAndValidity({emitEvent: false});
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
