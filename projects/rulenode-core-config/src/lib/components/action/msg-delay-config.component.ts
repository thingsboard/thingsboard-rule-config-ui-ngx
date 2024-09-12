import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TimeUnit } from '../../rulenode-core-config.models';
import { Observable, of } from 'rxjs';
import { map, mergeMap, share, startWith } from 'rxjs/operators';

@Component({
  selector: 'tb-action-node-msg-delay-config',
  templateUrl: './msg-delay-config.component.html',
  styleUrls: []
})
export class MsgDelayConfigComponent extends RuleNodeConfigurationComponent {

  msgDelayConfigForm: UntypedFormGroup;

  timeUnitMap = [TimeUnit.SECONDS, TimeUnit.MINUTES, TimeUnit.HOURS];

  filteredTimeUnits: Observable<Array<TimeUnit>>;
  searchText = '';

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.msgDelayConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.msgDelayConfigForm = this.fb.group({
      period: [configuration ? configuration.period : '60', [Validators.required]],
      timeUnit: [configuration ? configuration.timeUnit : TimeUnit.SECONDS, Validators.required],
      maxPendingMsgs: [configuration ? configuration.maxPendingMsgs : null,
        [Validators.required, Validators.min(1), Validators.max(100000)]],
    });

    this.filteredTimeUnits = this.msgDelayConfigForm.get('timeUnit').valueChanges
      .pipe(
        startWith(''),
        map((value) => value ? value : ''),
        mergeMap(unit => this.fetchMessageTypes(unit)),
        share()
      );
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    return {
      period: isDefinedAndNotNull(configuration?.period) ? configuration.period : '60',
      timeUnit: isDefinedAndNotNull(configuration?.timeUnit) ? configuration.timeUnit : TimeUnit.SECONDS,
      maxPendingMsgs: isDefinedAndNotNull(configuration?.maxPendingMsgs) ? configuration.maxPendingMsgs : 1000,
    };
  }

  private fetchMessageTypes(searchText?: string): Observable<Array<TimeUnit>> {
    this.searchText = searchText;
    if (this.searchText && this.searchText.length) {
      const search = this.searchText.toUpperCase();
      return of(this.timeUnitMap.filter(messageType => messageType.toUpperCase().includes(search)));
    } else {
      return of(this.timeUnitMap);
    }
  }

}
