import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import {
  ArgumentTypeMap,
  ArgumentTypeResult,
  AttributeScopeMap,
  AttributeScopeResult,
  MathFunction
} from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-math-function-config',
  templateUrl: './math-function-config.component.html',
  styleUrls: ['./math-function-config.component.scss']
})
export class MathFunctionConfigComponent extends RuleNodeConfigurationComponent {

  mathFunctionConfigForm: FormGroup;

  MathFunction = MathFunction;
  ArgumentTypeResult = ArgumentTypeResult;
  argumentTypeResultMap = ArgumentTypeMap;
  attributeScopeMap = AttributeScopeMap;
  argumentsResult = Object.values(ArgumentTypeResult);
  attributeScopeResult = Object.values(AttributeScopeResult);

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
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
  }

  protected updateValidators(emitEvent: boolean) {
    const operation: MathFunction = this.mathFunctionConfigForm.get('operation').value;
    const resultType: ArgumentTypeResult = this.mathFunctionConfigForm.get('result').get('type').value;
    if (operation === MathFunction.CUSTOM) {
      this.mathFunctionConfigForm.get('customFunction').enable({emitEvent: false});
    } else {
      this.mathFunctionConfigForm.get('customFunction').disable({emitEvent: false});
    }
    if (resultType === ArgumentTypeResult.ATTRIBUTE) {
      this.mathFunctionConfigForm.get('result').get('attributeScope').enable({emitEvent: false});
    } else {
      this.mathFunctionConfigForm.get('result').get('attributeScope').disable({emitEvent: false});
    }
    this.mathFunctionConfigForm.get('customFunction').updateValueAndValidity({emitEvent});
    this.mathFunctionConfigForm.get('result').get('attributeScope').updateValueAndValidity({emitEvent});
  }

  protected validatorTriggers(): string[] {
    return ['operation', 'result.type'];
  }
}
