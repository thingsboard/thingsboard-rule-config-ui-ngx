import { Component, OnDestroy } from '@angular/core';
import { AppState } from '@core/public-api';
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
      interval: [configuration ? configuration.interval : null, [Validators.required,
        Validators.min(1)]],
      id: [configuration ? configuration.id : null, [Validators.required]],
      strategy: [configuration ? configuration.strategy : null, [Validators.required]],
      outMsgType: [configuration ? configuration.outMsgType : null, []],
      maxPendingMsgs: [configuration ? configuration.maxPendingMsgs : null, [Validators.required,
        Validators.min(1), Validators.max(1000)]],
      maxRetries: [configuration ? configuration.maxRetries : null, [Validators.required, Validators.min(0), Validators.max(100)]],
      queueName: [configuration ? configuration.queueName : null, [Validators.required]]
    });

    this.deduplicationConfigForm.get('strategy').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (value === 'ALL') {
        this.deduplicationConfigForm.get('outMsgType').setValidators([Validators.required]);
        this.deduplicationConfigForm.get('outMsgType').updateValueAndValidity({emitEvent: false});
      } else {
        this.deduplicationConfigForm.get('outMsgType').patchValue('', {emitEvent: false})
        this.deduplicationConfigForm.get('outMsgType').clearValidators();
        this.deduplicationConfigForm.get('outMsgType').updateValueAndValidity({emitEvent: false});
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
