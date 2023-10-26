import { Component, forwardRef, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import {
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
      this.setupArgumentsFormGroup(true);
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
  argumentTypeMap = ArgumentTypeMap;
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
    this.argumentsFormGroup = this.fb.group({
      arguments: this.fb.array([])
    });

    this.valueChangeSubscription.push(this.argumentsFormGroup.valueChanges.subscribe(() => {
      this.updateModel();
    }));

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

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.disabled) {
      this.argumentsFormGroup.disable({emitEvent: false});
    } else {
      this.argumentsFormGroup.enable({emitEvent: false});
      (this.argumentsFormGroup.get('arguments') as FormArray).controls
        .forEach((control: FormGroup) => this.updateArgumentControlValidators(control));
    }
  }

  ngOnDestroy() {
    if (this.valueChangeSubscription.length) {
      this.valueChangeSubscription.forEach(sub => sub.unsubscribe());
    }
  }

  writeValue(argumentsList): void {
    const argumentsControls: Array<FormGroup> = [];
    if (argumentsList) {
      argumentsList.forEach((property, index) => {
        argumentsControls.push(this.createArgumentControl(property, index));
      });
    }
    this.argumentsFormGroup.setControl('arguments', this.fb.array(argumentsControls), {emitEvent: false});
    this.setupArgumentsFormGroup();
  }


  public removeArgument(index: number) {
    (this.argumentsFormGroup.get('arguments') as FormArray).removeAt(index);
    this.updateArgumentNames();
  }

  public addArgument(emitEvent = true) {
    const argumentsFormArray = this.argumentsFormGroup.get('arguments') as FormArray;
    const argumentControl = this.createArgumentControl(null, argumentsFormArray.length);
    argumentsFormArray.push(argumentControl, {emitEvent});
  }

  public validate(c: FormControl) {
    if (!this.argumentsFormGroup.valid) {
      return {
        argumentsRequired: true
      };
    }
    return null;
  }

  private setupArgumentsFormGroup(emitEvent = false) {
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
        this.addArgument(emitEvent);
      }
      this.argumentsFormGroup.get('arguments').updateValueAndValidity({emitEvent: false});
    }
  }

  private createArgumentControl(property: any, index: number): FormGroup {
    const argumentControl = this.fb.group({
      type: [property?.type, [Validators.required]],
      key: [property?.key, [Validators.required]],
      name: [ArgumentName[index], [Validators.required]],
      attributeScope: [property?.attributeScope ?? AttributeScope.SERVER_SCOPE, [Validators.required]],
      defaultValue: [property?.defaultValue ? property?.defaultValue : null]
    });
    this.updateArgumentControlValidators(argumentControl);
    this.valueChangeSubscription.push(argumentControl.get('type').valueChanges.subscribe(() => {
      this.updateArgumentControlValidators(argumentControl);
      argumentControl.get('attributeScope').updateValueAndValidity({emitEvent: false});
      argumentControl.get('defaultValue').updateValueAndValidity({emitEvent: false});
    }));
    return argumentControl;
  }

  private updateArgumentControlValidators(control: FormGroup) {
    const argumentType: ArgumentType = control.get('type').value;
    if (argumentType === ArgumentType.ATTRIBUTE) {
      control.get('attributeScope').enable({emitEvent: false});
    } else {
      control.get('attributeScope').disable({emitEvent: false});
    }
    if (argumentType && argumentType !== ArgumentType.CONSTANT) {
      control.get('defaultValue').enable({emitEvent: false});
    } else {
      control.get('defaultValue').disable({emitEvent: false});
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
