import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-external-node-lambda-config',
  templateUrl: './lambda-config.component.html',
  styleUrls: []
})
export class LambdaConfigComponent extends RuleNodeConfigurationComponent {

  lambdaConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.lambdaConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.lambdaConfigForm = this.fb.group({
      functionName: [configuration ? configuration.functionName : null, [Validators.required]],
      qualifier: [configuration ? configuration.qualifier : null, []],
      accessKey: [configuration ? configuration.accessKey : null, [Validators.required]],
      secretKey: [configuration ? configuration.secretKey : null, [Validators.required]],
      region: [configuration ? configuration.region : null, [Validators.required]],
      connectionTimeout: [configuration ? configuration.connectionTimeout : null, [Validators.required, Validators.min(0)]],
      requestTimeout: [configuration ? configuration.requestTimeout : null, [Validators.required, Validators.min(0)]],
      tellFailureIfFuncThrowsExc: [configuration ? configuration.tellFailureIfFuncThrowsExc : false, []]
    });
  }
}
