import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  EntitySearchDirection,
  EntityType,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-create-relation-config',
  templateUrl: './create-relation-config.component.html',
  styleUrls: []
})
export class CreateRelationConfigComponent extends RuleNodeConfigurationComponent {

  directionTypes = Object.keys(EntitySearchDirection);
  directionTypeTranslations  = new Map<EntitySearchDirection, string>(
    [
      [EntitySearchDirection.FROM, 'tb.rulenode.search-direction-from'],
      [EntitySearchDirection.TO, 'tb.rulenode.search-direction-to'],
    ]
  );

  entityType = EntityType;

  entityTypeNamePatternTranslation = new Map<EntityType, string>(
    [
      [EntityType.DEVICE, 'tb.rulenode.device-name-pattern'],
      [EntityType.ASSET, 'tb.rulenode.asset-name-pattern'],
      [EntityType.ENTITY_VIEW, 'tb.rulenode.entity-view-name-pattern'],
      [EntityType.CUSTOMER, 'tb.rulenode.customer-title-pattern'],
      [EntityType.USER, 'tb.rulenode.user-name-pattern'],
      [EntityType.DASHBOARD, 'tb.rulenode.dashboard-name-pattern'],
      [EntityType.EDGE, 'tb.rulenode.edge-name-pattern']
    ]
  );

  allowedEntityTypes = [EntityType.DEVICE, EntityType.ASSET, EntityType.ENTITY_VIEW, EntityType.TENANT,
    EntityType.CUSTOMER, EntityType.USER, EntityType.DASHBOARD, EntityType.EDGE];

  createRelationConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
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
      changeOriginatorToRelatedEntity: [configuration ? configuration.changeOriginatorToRelatedEntity : false, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['entityType', 'createEntityIfNotExists'];
  }

  protected updateValidators(emitEvent: boolean) {
    const entityType: EntityType = this.createRelationConfigForm.get('entityType').value;
    if (entityType) {
      this.createRelationConfigForm.get('entityNamePattern').setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      this.createRelationConfigForm.get('entityNamePattern').setValidators([]);
    }
    if (entityType && (entityType === EntityType.DEVICE || entityType === EntityType.ASSET)) {
      const validators = [Validators.pattern(/.*\S.*/)]
      if (this.createRelationConfigForm.get('createEntityIfNotExists').value) {
        validators.push(Validators.required);
      }
      this.createRelationConfigForm.get('entityTypePattern').setValidators(validators);
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
