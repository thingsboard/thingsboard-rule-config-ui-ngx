import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FetchTo, FetchToTranslationMap } from '../../rulenode-core-config.models';
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
  @Input() translation: Map<FetchTo, string> = FetchToTranslationMap;

  private propagateChange: (value: any) => void = () => {};
  private destroy$ = new Subject<void>();

  public chipControlGroup: FormGroup;
  public selectOptions = [];

  constructor(private fb: FormBuilder,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.initOptions();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initOptions() {
    for (const key of this.translation.keys()) {
      this.selectOptions.push({
        value: key,
        name: this.translate.instant(this.translation.get(key))
      });
    }
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
}
