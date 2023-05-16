import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR, UntypedFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DataToFetch } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-fetch-to-data-toggle',
  templateUrl: './fetch-to-data-toggle.component.html',
  styleUrls: ['./fetch-to-data-toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FetchToDataToggleComponent),
    multi: true
  }]
})

export class FetchToDataToggleComponent implements  OnInit, ControlValueAccessor, OnDestroy {

  private propagateChange;
  private destroy$ = new Subject();

  public toggleControlGroup: FormGroup;

  @Input() enableFieldToggle: boolean;

  constructor(private store: Store<AppState>,
              private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.toggleControlGroup = this.fb.group({
      toggleControl: [null,  []]
    });

    this.toggleControlGroup.get('toggleControl').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
        this.propagateChange(value);
      }
    );
  }

  writeValue(value: boolean): void {
    this.toggleControlGroup.get('toggleControl').patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  protected readonly DataToFetch = DataToFetch;
}
