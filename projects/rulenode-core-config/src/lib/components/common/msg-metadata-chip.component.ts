import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { FetchTo } from '../../rulenode-core-config.models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'tb-msg-metadata-chip',
  templateUrl: './msg-metadata-chip.component.html',
  styleUrls: ['./msg-metadata-chip.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MsgMetadataChipComponent),
    multi: true
  }]
})

export class MsgMetadataChipComponent implements  OnInit, ControlValueAccessor, OnDestroy {

  @Input() labelText: string;

  private propagateChange;
  private destroy$ = new Subject<void>();

  public chipControlGroup: FormGroup;
  public fetchTo = FetchTo;

  constructor(private store: Store<AppState>,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.chipControlGroup = this.fb.group({
      chipControl: [null,  []]
    });

    this.chipControlGroup.get('chipControl').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
        if (value) {
          this.propagateChange(value);
        }
      }
    );
  }

  writeValue(value: string | null): void {
    this.chipControlGroup.get('chipControl').patchValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
