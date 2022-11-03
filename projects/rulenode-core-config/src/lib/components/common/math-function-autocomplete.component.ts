import { Component, ElementRef, forwardRef, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PageComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FunctionData, MathFunction, MathFunctionMap } from '../../rulenode-core-config.models';
import { map, startWith, tap } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'tb-math-function-autocomplete',
  templateUrl: './math-function-autocomplete.component.html',
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MathFunctionAutocompleteComponent),
      multi: true
    }
  ]
})
export class MathFunctionAutocompleteComponent extends PageComponent implements ControlValueAccessor, OnInit {

  private requiredValue: boolean;
  get required(): boolean {
    return this.requiredValue;
  }
  @Input()
  set required(value: boolean) {
    this.requiredValue = coerceBooleanProperty(value);
  }

  @Input() disabled: boolean;

  @ViewChild('operationInput', {static: true}) operationInput: ElementRef;

  mathFunctionForm: FormGroup;

  modelValue: MathFunction | null;

  searchText = '';

  filteredOptions: Observable<FunctionData[]>;

  private dirty = false;

  private mathOperation = [...MathFunctionMap.values()];

  private propagateChange = null;

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              public injector: Injector,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.mathFunctionForm = this.fb.group({
      operation: ['']
    });
    this.filteredOptions = this.mathFunctionForm.get('operation').valueChanges.pipe(
      tap(value => {
        let modelValue;
        if (typeof value === 'string' && MathFunction[value]) {
          modelValue = MathFunction[value];
        } else {
          modelValue = null;
        }
        this.updateView(modelValue);
      }),
      map(value => {
        this.searchText = value || '';
        return value ? this._filter(value) : this.mathOperation.slice();
      }),
    );
  }

  private _filter(searchText: string) {
    const filterValue = searchText.toLowerCase();

    return this.mathOperation.filter(option => option.name.toLowerCase().includes(filterValue)
      || option.value.toLowerCase().includes(filterValue));
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.mathFunctionForm.disable({emitEvent: false});
    } else {
      this.mathFunctionForm.enable({emitEvent: false});
    }
  }

  mathFunctionDisplayFn(value: MathFunction | null) {
    if (value) {
      const funcData = MathFunctionMap.get(value)
      return funcData.value + ' | ' + funcData.name;
    }
    return '';
  }

  writeValue(value: MathFunction | null): void {
    this.modelValue = value;
    this.mathFunctionForm.get('operation').setValue(value, {emitEvent: false});
    this.dirty = true;
  }

  updateView(value: MathFunction | null) {
    if (this.modelValue !== value) {
      this.modelValue = value;
      this.propagateChange(this.modelValue);
    }
  }

  onFocus() {
    if (this.dirty) {
      this.mathFunctionForm.get('operation').updateValueAndValidity({onlySelf: true});
      this.dirty = false;
    }
  }

  clear() {
    this.mathFunctionForm.get('operation').patchValue('');
    setTimeout(() => {
      this.operationInput.nativeElement.blur();
      this.operationInput.nativeElement.focus();
    }, 0);
  }

}
