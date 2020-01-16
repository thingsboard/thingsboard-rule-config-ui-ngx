import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  EntitySearchDirection,
  entitySearchDirectionTranslations,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';

@Component({
  selector: 'tb-filter-node-check-relation-config',
  templateUrl: './check-relation-config.component.html',
  styleUrls: []
})
export class CheckRelationConfigComponent extends RuleNodeConfigurationComponent {

  checkRelationConfigForm: FormGroup;

  entitySearchDirection = Object.keys(EntitySearchDirection);
  entitySearchDirectionTranslationsMap = entitySearchDirectionTranslations;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.checkRelationConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.checkRelationConfigForm = this.fb.group({
      checkForSingleEntity: [configuration ? configuration.checkForSingleEntity : false, []],
      direction: [configuration ? configuration.direction : null, []],
      entityType: [configuration ? configuration.entityType : null,
        configuration && configuration.checkForSingleEntity ? [Validators.required] : []],
      entityId: [configuration ? configuration.entityId : null,
        configuration && configuration.checkForSingleEntity ? [Validators.required] : []],
      relationType: [configuration ? configuration.relationType : null, [Validators.required]]
    });
  }

  protected validatorTriggers(): string[] {
    return ['checkForSingleEntity'];
  }

  protected updateValidators(emitEvent: boolean) {
    const checkForSingleEntity: boolean = this.checkRelationConfigForm.get('checkForSingleEntity').value;
    this.checkRelationConfigForm.get('entityType').setValidators(checkForSingleEntity ? [Validators.required] : []);
    this.checkRelationConfigForm.get('entityType').updateValueAndValidity({emitEvent});
    this.checkRelationConfigForm.get('entityId').setValidators(checkForSingleEntity ? [Validators.required] : []);
    this.checkRelationConfigForm.get('entityId').updateValueAndValidity({emitEvent});
  }

}
