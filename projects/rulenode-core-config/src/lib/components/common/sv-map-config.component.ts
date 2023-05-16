import { Component, forwardRef, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormBuilder, UntypedFormControl,
  UntypedFormGroup, NG_VALIDATORS,
  NG_VALUE_ACCESSOR, NgControl, Validator,
  Validators, FormArray
} from '@angular/forms';
import { PageComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { Observable, Subject, Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tb-sv-map-config',
  templateUrl: './sv-map-config.component.html',
  styleUrls: ['./sv-map-config.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SvMapConfigComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SvMapConfigComponent),
      multi: true,
    }
  ]
})
export class SvMapConfigComponent extends PageComponent implements ControlValueAccessor, OnInit, Validator, OnDestroy {

  @Input() selectOptions: string[];

  @Input() selectOptionsTranslate;

  @Input() disabled: boolean;

  @Input() labelText: string;

  @Input() requiredText: string;

  @Input() targetKeyPrefix: string;

  @Input() selectText: string;

  @Input() selectRequiredText: string;

  @Input() valText: string;

  @Input() valRequiredText: string;

  @Input() hintText: string;

  private destroy$ = new Subject<void>();
  private requiredValue: boolean;
  private sourceFieldSubcritption: Subscription[] = [];
  get required(): boolean {
    return this.requiredValue;
  }
  @Input()
  set required(value: boolean) {
    this.requiredValue = coerceBooleanProperty(value);
  }

  kvListFormGroup: UntypedFormGroup;

  ngControl: NgControl;

  private propagateChange = null;

  private valueChangeSubscription: Subscription = null;

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              public injector: Injector,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.kvListFormGroup = this.fb.group({});
    this.kvListFormGroup.addControl('keyVals',
      this.fb.array([]));
  }

  keyValsFormArray(): FormArray {
    return this.kvListFormGroup.get('keyVals') as FormArray;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.kvListFormGroup.disable({emitEvent: false});
    } else {
      this.kvListFormGroup.enable({emitEvent: false});
    }
  }

  writeValue(keyValMap: {[key: string]: string}): void {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
    const keyValsControls: Array<AbstractControl> = [];
    if (keyValMap) {
      for (const property of Object.keys(keyValMap)) {
        if (Object.prototype.hasOwnProperty.call(keyValMap, property)) {
          keyValsControls.push(this.fb.group({
            key: [property, [Validators.required]],
            value: [keyValMap[property], [Validators.required, Validators.pattern(/(?:.|\s)*\S(&:.|\s)*/)]]
          }));
        }
      }
    }
    this.kvListFormGroup.setControl('keyVals', this.fb.array(keyValsControls));
    for (const formGroup of this.keyValsFormArray().controls) {
      this.keyChangeSubscribe(formGroup);
    }
    this.valueChangeSubscription = this.kvListFormGroup.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.updateModel();
    });
  }

  public filterSelectOptions(keyValControl?) {
      const deleteIndexArray = [];
      for (const fieldMap of this.kvListFormGroup.get('keyVals').value) {
        deleteIndexArray.push(this.selectOptions.findIndex((selectElement) => selectElement === fieldMap.key));
      }
      const filterSelectOptions = [];
      for (let i = 0; i < this.selectOptions.length; i++) {
        if (!isDefinedAndNotNull(deleteIndexArray.find((deleteElement) => deleteElement === i)) ||
          this.selectOptions[i] === keyValControl?.get('key').value) {
          filterSelectOptions.push(this.selectOptions[i]);
        }
      }

      return filterSelectOptions;
  }

  public removeKeyVal(index: number) {
    (this.kvListFormGroup.get('keyVals') as FormArray).removeAt(index);
    this.sourceFieldSubcritption[index].unsubscribe();
    this.sourceFieldSubcritption.splice(index, 1);
  }

  public addKeyVal() {
    const keyValsFormArray = this.kvListFormGroup.get('keyVals') as FormArray;
    keyValsFormArray.push(this.fb.group({
      key: ['', [Validators.required]],
      value: ['', [Validators.required, Validators.pattern(/(?:.|\s)*\S(&:.|\s)*/)]]
    }));
    this.keyChangeSubscribe(keyValsFormArray.controls[keyValsFormArray.length - 1]);
  }

  private keyChangeSubscribe(formGroup) {
    this.sourceFieldSubcritption.push(formGroup.get('key').valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      formGroup.get('value').patchValue(this.targetKeyPrefix + value[0].toUpperCase() + value.slice(1));
    }));
  }

  public validate(c: UntypedFormControl) {
    const kvList: {key: string; value: string}[] = this.kvListFormGroup.get('keyVals').value;
    if (!kvList.length && this.required) {
      return {
        kvMapRequired: true
      };
    }
    if (!this.kvListFormGroup.valid) {
      return {
        kvFieldsRequired: true
      };
    }
    return null;
  }

  private updateModel() {
    const kvList: {key: string; value: string}[] = this.kvListFormGroup.get('keyVals').value;
    if (this.required && !kvList.length || !this.kvListFormGroup.valid) {
      this.propagateChange(null);
    } else {
      const keyValMap: { [key: string]: string } = {};
      kvList.forEach((entry) => {
        keyValMap[entry.key] = entry.value;
      });
      this.propagateChange(keyValMap);
    }
  }
}
