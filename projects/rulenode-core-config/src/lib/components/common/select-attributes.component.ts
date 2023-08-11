import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors, ValidatorFn, Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-select-attributes',
  templateUrl: './select-attributes.component.html',
  styleUrls: ['../../../../style.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectAttributesComponent),
    multi: true
  }, {
    provide: NG_VALIDATORS,
    useExisting: SelectAttributesComponent,
    multi: true
  }]
})

export class SelectAttributesComponent implements  OnInit, ControlValueAccessor, OnDestroy {

  private propagateChange;
  private destroy$ = new Subject();

  public attributeControlGroup: FormGroup;
  public separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  @Input() popupHelpLink: string;

  constructor(private store: Store<AppState>,
              public translate: TranslateService,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.attributeControlGroup = this.fb.group({
      clientAttributeNames: [null, []],
      sharedAttributeNames: [null, []],
      serverAttributeNames: [null, []],
      latestTsKeyNames: [null, []],
      getLatestValueWithTs: [false, []]
    }, {validators: this.atLeastOne(Validators.required, ['clientAttributeNames', 'sharedAttributeNames',
        'serverAttributeNames', 'latestTsKeyNames'])});

    this.attributeControlGroup.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.propagateChange(value);
    });
  }

  validate() {
    if(this.attributeControlGroup.valid) {
      return null;
    } else {
      return {atLeastOneRequired: true};
    }
  }

  private atLeastOne(validator: ValidatorFn, controls: string[] = null) {
    return (group: FormGroup): ValidationErrors | null => {
      if (!controls) {
        controls = Object.keys(group.controls);
      }
      const hasAtLeastOne = group?.controls && controls.some(k => !validator(group.controls[k]));

      return hasAtLeastOne ? null : {atLeastOne: true};
    };
  }

  writeValue(value): void {
    this.attributeControlGroup.setValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.attributeControlGroup.disable({emitEvent: false});
    } else {
      this.attributeControlGroup.enable({emitEvent: false});
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
