import { Component, OnDestroy } from '@angular/core';
import { AppState } from '@core/public-api';
import { EntityType, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tb-flow-node-rule-chain-input-config',
  templateUrl: './rule-chain-input.component.html',
  styleUrls: []
})
export class RuleChainInputComponent extends RuleNodeConfigurationComponent implements OnDestroy {

  entityType = EntityType;

  ruleChainInputConfigForm: FormGroup;

  private destroy$ = new Subject();

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.ruleChainInputConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.ruleChainInputConfigForm = this.fb.group({
      forwardMsgToRootRuleChain: [configuration ? configuration.forwardMsgToRootRuleChain : null,[]],
      ruleChainId: [configuration ? configuration.ruleChainId : false, [Validators.required]]
    });

    this.ruleChainInputConfigForm.get('forwardMsgToRootRuleChain').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      if (value) {
        this.ruleChainInputConfigForm.get('ruleChainId').disable({emitEvent: false});
        this.ruleChainInputConfigForm.get('ruleChainId').patchValue(null, {emitEvent: false});
      } else {
        this.ruleChainInputConfigForm.get('ruleChainId').enable({emitEvent: false});
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
