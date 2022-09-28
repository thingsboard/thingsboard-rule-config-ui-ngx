import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import {
  ArgumentTypeMap,
  ArgumentTypeResult,
  AttributeScopeMap,
  AttributeScopeResult,
  MathFunctionMap
} from '../../rulenode-core-config.models';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'tb-action-node-math-function-config',
  templateUrl: './math-function-config.component.html',
  styleUrls: ['./math-function-config.component.scss']
})
export class MathFunctionConfigComponent extends RuleNodeConfigurationComponent {

  @ViewChild('operationInput', {static: true}) operationInput: ElementRef;

  mathFunctionConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];


  mathFunctionMap = MathFunctionMap;
  argumentTypeResultMap = ArgumentTypeMap;
  attributeScopeMap = AttributeScopeMap;
  mathOperation = [...this.mathFunctionMap.values()];
  argumentsResult = Object.values(ArgumentTypeResult);
  attributeScopeResult = Object.values(AttributeScopeResult);

  searchText = '';

  filteredOptions: Observable<any>;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  displayFn = funcValue => {
    if (funcValue) {
      const funcData = this.mathFunctionMap.get(funcValue)
      return funcData.value + ' | ' + funcData.name;
    }
    return '';
  }

  private _filter(searchText: string) {
    const filterValue = searchText.toLowerCase();

    return this.mathOperation.filter(option => option.name.toLowerCase().includes(filterValue)
      || option.value.toLowerCase().includes(filterValue));
  }

  protected configForm(): FormGroup {
    return this.mathFunctionConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.mathFunctionConfigForm = this.fb.group({
      operation: [configuration ? configuration.operation : null, [Validators.required]],
      arguments: [configuration ? configuration.arguments : null, [Validators.required]],
      customFunction: [configuration ? configuration.customFunction : '', [Validators.required]],
      result: this.fb.group({
        type: [configuration ? configuration.result.type: null, [Validators.required]],
        attributeScope: [configuration ? configuration.result.attributeScope : null],
        key: [configuration ? configuration.result.key : '', [Validators.required]],
        resultValuePrecision: [configuration ? configuration.result.resultValuePrecision : 0],
        addToBody: [configuration ? configuration.result.addToBody : false],
        addToMetadata: [configuration ? configuration.result.addToMetadata : false]
      })
    });

    this.mathFunctionConfigForm.get('operation').valueChanges.subscribe(value => {
      if (value === 'CUSTOM') {
        this.mathFunctionConfigForm.get('customFunction').enable();
      } else {
        this.mathFunctionConfigForm.get('customFunction').disable();
      }
    });

    this.mathFunctionConfigForm.get('result').get('type').valueChanges.subscribe(value => {
      if (value === 'ATTRIBUTE') {
        this.mathFunctionConfigForm.get('result').get('attributeScope').enable();
      } else {
        this.mathFunctionConfigForm.get('result').get('attributeScope').patchValue({value: null}, {emitEvent: false});
        this.mathFunctionConfigForm.get('result').get('attributeScope').disable();
      }
    });

    this.filteredOptions = this.mathFunctionConfigForm.get('operation').valueChanges.pipe(
      startWith(''),
      map(value => {
        this.searchText = value;
        return value ? this._filter(value) : this.mathOperation.slice();
      }),
    );
  }

  textIsNotEmpty(text: string): boolean {
    return (text && text.length > 0);
  }

  clear() {
    this.mathFunctionConfigForm.get('operation').patchValue('', {emitEvent: true});
    setTimeout(() => {
      this.operationInput.nativeElement.blur();
      this.operationInput.nativeElement.focus();
    }, 0);
  }

  protected updateValidators(emitEvent: boolean) {
    this.mathFunctionConfigForm.updateValueAndValidity();
  }

  protected validatorTriggers(): string[] {
    return [];
  }
}
