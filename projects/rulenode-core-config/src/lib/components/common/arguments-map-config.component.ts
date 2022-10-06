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
  styleUrls: ['./arguments-map-config.component.scss'],
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
      this.setupArgumentsFormGroup();
    }
  }

  maxArgs = 16;
  minArgs = 1;
  displayArgumentName = false;

  mathFunctionMap = MathFunctionMap;
  ArgumentType = ArgumentType;

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

    this.setupArgumentsFormGroup();
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    const columnsFormArray = this.argumentsFormArray();
    const columnForm = columnsFormArray.at(event.previousIndex);
    columnsFormArray.removeAt(event.previousIndex);
    columnsFormArray.insert(event.currentIndex, columnForm);
    this.updateArgumentNames();
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
        argumentsControls.push(this.createArgumentControl(property, index));
      });
    }
    this.argumentsFormGroup.setControl('arguments', this.fb.array(argumentsControls));
    this.setupArgumentsFormGroup();
    this.valueChangeSubscription.push(this.argumentsFormGroup.valueChanges.subscribe(() => {
      this.updateModel();
    }));
  }


  public removeArgument(index: number) {
    (this.argumentsFormGroup.get('arguments') as FormArray).removeAt(index);
    this.updateArgumentNames();
  }

  public addArgument() {
    const argumentsFormArray = this.argumentsFormGroup.get('arguments') as FormArray;
    const argumentControl = this.createArgumentControl(null, argumentsFormArray.length);
    argumentsFormArray.push(argumentControl);
  }

  public validate(c: FormControl) {
    if (!this.argumentsFormGroup.valid) {
      return {
        argumentsRequired: true
      };
    }
    return null;
  }

  private setupArgumentsFormGroup() {
    if (this.function) {
      this.maxArgs = this.mathFunctionMap.get(this.function).maxArgs;
      this.minArgs = this.mathFunctionMap.get(this.function).minArgs;
      this.displayArgumentName = this.function === MathFunction.CUSTOM;
    }
    if (this.argumentsFormGroup) {
      this.argumentsFormGroup.get('arguments').setValidators([Validators.minLength(this.minArgs), Validators.maxLength(this.maxArgs)]);
      if (this.argumentsFormGroup.get('arguments').value.length > this.maxArgs) {
        (this.argumentsFormGroup.get('arguments') as FormArray).controls.length = this.maxArgs;
      }
      while (this.argumentsFormGroup.get('arguments').value.length < this.minArgs) {
        this.addArgument();
      }
      this.argumentsFormGroup.get('arguments').updateValueAndValidity({emitEvent: false});
    }
  }

  private createArgumentControl(property: any, index: number): AbstractControl {
    const argumentControl = this.fb.group({
      type: [property?.type, [Validators.required]],
      key: [property?.key, [Validators.required]],
      name: [ArgumentName[index], [Validators.required]],
      attributeScope: [property?.attributeScope ? property?.attributeScope : null, [Validators.required]],
      defaultValue: [property?.defaultValue ? property?.defaultValue : null]
    });
    this.updateArgumentControlValidators(argumentControl);
    this.valueChangeSubscription.push(argumentControl.get('type').valueChanges.subscribe(() => {
      this.updateArgumentControlValidators(argumentControl);
      argumentControl.get('attributeScope').updateValueAndValidity({emitEvent: true});
      argumentControl.get('defaultValue').updateValueAndValidity({emitEvent: true});
    }));
    return argumentControl;
  }

  private updateArgumentControlValidators(control: AbstractControl) {
    const argumentType: ArgumentType = control.get('type').value;
    if (argumentType === ArgumentType.ATTRIBUTE) {
      control.get('attributeScope').enable();
    } else {
      control.get('attributeScope').disable();
    }
    if (argumentType && argumentType !== ArgumentType.CONSTANT) {
      control.get('defaultValue').enable();
    } else {
      control.get('defaultValue').disable();
    }
  }

  private updateArgumentNames() {
    const argumentsFormArray = this.argumentsFormGroup.get('arguments') as FormArray;
    argumentsFormArray.controls.forEach((argumentControl, argumentIndex) => {
      argumentControl.get('name').setValue(ArgumentName[argumentIndex]);
    });
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
