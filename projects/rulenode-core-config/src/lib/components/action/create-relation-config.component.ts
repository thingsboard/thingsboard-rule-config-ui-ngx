import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  EntitySearchDirection,
  entitySearchDirectionTranslations,
  EntityType,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-create-relation-config',
  templateUrl: './create-relation-config.component.html',
  styleUrls: []
})
export class CreateRelationConfigComponent extends RuleNodeConfigurationComponent {

  directionTypes = Object.keys(EntitySearchDirection);
  directionTypeTranslations = entitySearchDirectionTranslations;

  entityType = EntityType;

  createRelationConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.createRelationConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.createRelationConfigForm = this.fb.group({
      direction: [configuration ? configuration.direction : null, [Validators.required]],
      entityType: [configuration ? configuration.entityType : null, [Validators.required]],
      entityNamePattern: [configuration ? configuration.entityNamePattern : null, []],
      entityTypePattern: [configuration ? configuration.entityTypePattern : null, []],
      relationType: [configuration ? configuration.relationType : null, [Validators.required]],
      createEntityIfNotExists: [configuration ? configuration.createEntityIfNotExists : false, []],
      removeCurrentRelations: [configuration ? configuration.removeCurrentRelations : false, []],
      changeOriginatorToRelatedEntity: [configuration ? configuration.changeOriginatorToRelatedEntity : false, []],
      entityCacheExpiration: [configuration ? configuration.entityCacheExpiration : null, [Validators.required, Validators.min(0)]],
    });
  }

  protected validatorTriggers(): string[] {
    return ['entityType'];
  }

  protected updateValidators(emitEvent: boolean) {
    const entityType: EntityType = this.createRelationConfigForm.get('entityType').value;
    if (entityType) {
      this.createRelationConfigForm.get('entityNamePattern').setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      this.createRelationConfigForm.get('entityNamePattern').setValidators([]);
    }
    if (entityType && (entityType === EntityType.DEVICE || entityType === EntityType.ASSET)) {
      this.createRelationConfigForm.get('entityTypePattern').setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      this.createRelationConfigForm.get('entityTypePattern').setValidators([]);
    }
    this.createRelationConfigForm.get('entityNamePattern').updateValueAndValidity({emitEvent});
    this.createRelationConfigForm.get('entityTypePattern').updateValueAndValidity({emitEvent});
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.entityNamePattern = configuration.entityNamePattern ? configuration.entityNamePattern.trim() : null;
    configuration.entityTypePattern = configuration.entityTypePattern ? configuration.entityTypePattern.trim() : null;
    return configuration;
  }
}
