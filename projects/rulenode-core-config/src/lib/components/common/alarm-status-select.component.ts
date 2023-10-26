import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { AlarmStatus, alarmStatusTranslations, PageComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tb-alarm-status-select',
  templateUrl: './alarm-status-select.component.html',
  styleUrls: ['./alarm-status-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AlarmStatusSelectComponent),
    multi: true
  }]
})

export class AlarmStatusSelectComponent extends PageComponent implements OnInit, ControlValueAccessor, OnDestroy {

  public alarmStatusGroup: FormGroup;

  private propagateChange = null;
  private destroy$ = new Subject<void>();

  readonly alarmStatus = AlarmStatus;
  readonly alarmStatusTranslations = alarmStatusTranslations;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.alarmStatusGroup = this.fb.group({
      alarmStatus: [null, []]
    });

    this.alarmStatusGroup.get('alarmStatus').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.propagateChange(value);
    });
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.alarmStatusGroup.disable({emitEvent: false});
    } else {
      this.alarmStatusGroup.enable({emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: Array<AlarmStatus>): void {
    this.alarmStatusGroup.get('alarmStatus').patchValue(value, {emitEvent: false});
  }
}
