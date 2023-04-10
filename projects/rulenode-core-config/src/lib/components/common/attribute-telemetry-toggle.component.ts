import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR, UntypedFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tb-attribute-telemetry-toggle',
  templateUrl: './attribute-telemetry-toggle.component.html',
  styleUrls: ['./attribute-telemetry-toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AttributeTelemetryToggleComponent),
    multi: true
  }]
})

export class AttributeTelemetryToggleComponent implements  OnInit, ControlValueAccessor, OnDestroy {

  private propagateChange;
  private destroy$ = new Subject();

  public toggleControlGroup: FormGroup;

  constructor(private store: Store<AppState>,
              private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.toggleControlGroup = this.fb.group({
      toggleControl: [null,  [Validators.required, Validators.maxLength(255)]]
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
}
