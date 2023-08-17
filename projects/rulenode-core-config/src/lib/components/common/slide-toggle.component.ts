import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { coerceBoolean } from '@shared/public-api';

@Component({
  selector: 'tb-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SlideToggleComponent),
    multi: true
  }]
})

export class SlideToggleComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @Input() slideToggleName: string;
  @Input() slideToggleTooltip: string;

  private propagateChange = (v: any) => { };
  private destroy$ = new Subject<void>();

  public slideToggleControlGroup: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.slideToggleControlGroup = this.fb.group({
      slideToggleControl: [null, []]
    });

    this.slideToggleControlGroup.get('slideToggleControl').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
        this.propagateChange(value);
      }
    );
  }

  writeValue(value: string | null): void {
    this.slideToggleControlGroup.get('slideToggleControl').patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.slideToggleControlGroup.disable({emitEvent: false});
    } else {
      this.slideToggleControlGroup.enable({emitEvent: false});
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
