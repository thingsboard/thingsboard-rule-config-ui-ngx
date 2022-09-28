import { Component, forwardRef, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validator,
  Validators
} from '@angular/forms';
import { PageComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { AppState } from '@core/public-api';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ArgumentName,
  ArgumentType,
  ArgumentTypeMap,
  AttributeScope,
  AttributeScopeMap,
  MathFunction,
  MathFunctionMap
} from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-arguments-map-config',
  templateUrl: './arguments-map-config.component.html',
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArgumentsMapConfigComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ArgumentsMapConfigComponent),
      multi: true,
    }
  ]
})
export class ArgumentsMapConfigComponent extends PageComponent implements ControlValueAccessor, OnInit, OnDestroy, Validator {

  @Input() disabled: boolean;

  private functionValue: MathFunction;
  get function(): MathFunction {
    return this.functionValue;
  }
  @Input()
  set function(funcName: MathFunction) {
    if (funcName && this.functionValue !== funcName) {
      this.functionValue = funcName;
      if (this.argumentsFormGroup) {
        this.maxArgs = this.mathFunctionMap.get(funcName).maxArgs;
        this.minArgs = this.mathFunctionMap.get(funcName).minArgs;
        this.displayArgumentName = this.functionValue === MathFunction.CUSTOM;
        this.argumentsFormGroup.get('arguments').setValidators([Validators.minLength(this.minArgs), Validators.maxLength(this.maxArgs)]);
        if (this.argumentsFormGroup.get('arguments').value.length > this.maxArgs) {
          (this.argumentsFormGroup.get('arguments') as FormArray).controls.length = this.maxArgs;
        }
        while (this.argumentsFormGroup.get('arguments').value.length < this.minArgs) {
          this.addArgument();
        }
        this.argumentsFormGroup.get('arguments').updateValueAndValidity({emitEvent: true});
      }
    }
  }

  maxArgs = 16;
  minArgs = 1;
  displayArgumentName = false;

  mathFunctionMap = MathFunctionMap;

  argumentsFormGroup: FormGroup;

  ngControl: NgControl;

  attributeScopeMap = AttributeScopeMap;
  argumentTypeResultMap = ArgumentTypeMap;
  arguments = Object.values(ArgumentType);
  attributeScope = Object.values(AttributeScope);

  private propagateChange = null;

  private valueChangeSubscription: Subscription[] = [];

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              public injector: Injector,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit(): void {
    this.ngControl = this.injector.get(NgControl);
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    this.argumentsFormGroup = this.fb.group({});
    this.argumentsFormGroup.addControl('arguments',
      this.fb.array([]));

    if (this.function) {
      this.maxArgs = this.mathFunctionMap.get(this.function).maxArgs;
      this.minArgs = this.mathFunctionMap.get(this.function).minArgs;
    }
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    const columnsFormArray = this.argumentsFormArray();
    const columnForm = columnsFormArray.at(event.previousIndex);
    columnsFormArray.removeAt(event.previousIndex);
    columnsFormArray.insert(event.currentIndex, columnForm);
  }

  argumentsFormArray(): FormArray {
    return this.argumentsFormGroup.get('arguments') as FormArray;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.argumentsFormGroup.disable({emitEvent: false});
    } else {
      this.argumentsFormGroup.enable({emitEvent: false});
    }
  }

  ngOnDestroy() {
    if (this.valueChangeSubscription.length) {
      this.valueChangeSubscription.forEach(sub => sub.unsubscribe());
    }
  }

  writeValue(argumentsList): void {
    if (this.valueChangeSubscription.length) {
      this.valueChangeSubscription.forEach(sub => sub.unsubscribe());
    }
    const argumentsControls: Array<AbstractControl> = [];
    if (argumentsList) {
      argumentsList.forEach((property, index) => {
        argumentsControls.push(this.fb.group({
          type: [property.type, [Validators.required]],
          key: [property.key, [Validators.required]],
          name: [ArgumentName[index], [Validators.required]],
          attributeScope: [property.attributeScope ? property.attributeScope : null],
          defaultValue: [property.defaultValue ? property.defaultValue : null]
        }));
      });
    }
    argumentsControls.forEach(control => this.valueChangeSubscription.push(
      control.get('type').valueChanges.subscribe(argumentType => {
        if (argumentType === 'ATTRIBUTE') {
          control.get('attributeScope').enable();
          control.get('defaultValue').enable();
        } else {
          control.get('attributeScope').disable();
          control.get('defaultValue').disable();
        }
      }))
    );
    this.argumentsFormGroup.setControl('arguments', this.fb.array(argumentsControls));
    this.argumentsFormGroup.get('arguments').setValidators([Validators.minLength(this.minArgs), Validators.maxLength(this.maxArgs)]);
    this.argumentsFormGroup.get('arguments').updateValueAndValidity();
    this.valueChangeSubscription.push(this.argumentsFormGroup.valueChanges.subscribe(() => {
      this.updateModel();
    }));
  }


  public removeArgument(index: number) {
    (this.argumentsFormGroup.get('arguments') as FormArray).removeAt(index);
    const argumentsFormArray = this.argumentsFormGroup.get('arguments') as FormArray;
    argumentsFormArray.controls.forEach((argumentControl, argumentIndex) => {
      argumentControl.get('name').setValue(ArgumentName[argumentIndex]);
    });
  }

  public addArgument() {
    const argumentsFormArray = this.argumentsFormGroup.get('arguments') as FormArray;
    argumentsFormArray.push(this.fb.group({
      type: [null, [Validators.required]],
      key: [null, [Validators.required]],
      name: [ArgumentName[argumentsFormArray.length], [Validators.required]],
      attributeScope: [null],
      defaultValue: [null]
    }));
    this.valueChangeSubscription.push(
      argumentsFormArray.controls[argumentsFormArray.length - 1].get('type').valueChanges.subscribe(argumentType => {
        if (argumentType === 'ATTRIBUTE') {
          argumentsFormArray.controls[argumentsFormArray.length - 1].get('attributeScope').enable();
          argumentsFormArray.controls[argumentsFormArray.length - 1].get('defaultValue').enable();
        } else {
          argumentsFormArray.controls[argumentsFormArray.length - 1].get('attributeScope').disable();
          argumentsFormArray.controls[argumentsFormArray.length - 1].get('defaultValue').disable();
        }
      })
    );
  }

  public validate(c: FormControl) {
    if (!this.argumentsFormGroup.valid) {
      return {
        argumentsRequired: true
      };
    }
    return null;
  }

  private updateModel() {
    const argumentsForm = this.argumentsFormGroup.get('arguments').value;
    if (!argumentsForm.length || !this.argumentsFormGroup.valid) {
      this.propagateChange(null);
    } else {
      this.propagateChange(argumentsForm);
    }
  }
}
