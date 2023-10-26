import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FetchToTranslation } from '../../rulenode-core-config.models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-msg-metadata-chip',
  templateUrl: './msg-metadata-chip.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MsgMetadataChipComponent),
    multi: true
  }]
})

export class MsgMetadataChipComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @Input() labelText: string;

  private propagateChange = (v: any) => { };
  private destroy$ = new Subject<void>();

  public chipControlGroup: FormGroup;
  public selectOptions = [];

  constructor(private fb: FormBuilder,
              private translate: TranslateService) {
    for (const key of FetchToTranslation.keys()) {
      this.selectOptions.push({
        value: key,
        name: this.translate.instant(FetchToTranslation.get(key))
      });
    }
  }

  ngOnInit(): void {
    this.chipControlGroup = this.fb.group({
      chipControl: [null, []]
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

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.chipControlGroup.disable({emitEvent: false});
    } else {
      this.chipControlGroup.enable({emitEvent: false});
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
