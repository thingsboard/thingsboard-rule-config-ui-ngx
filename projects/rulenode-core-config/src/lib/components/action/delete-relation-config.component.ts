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
  selector: 'tb-action-node-delete-relation-config',
  templateUrl: './delete-relation-config.component.html',
  styleUrls: []
})
export class DeleteRelationConfigComponent extends RuleNodeConfigurationComponent {

  directionTypes = Object.keys(EntitySearchDirection);

  directionTypeTranslations  = new Map<EntitySearchDirection, string>(
    [
      [EntitySearchDirection.FROM, 'tb.rulenode.del-relation-direction-from'],
      [EntitySearchDirection.TO, 'tb.rulenode.del-relation-direction-to'],
    ]
  );

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

  entityType = EntityType;

  allowedEntityTypes = [EntityType.DEVICE, EntityType.ASSET, EntityType.ENTITY_VIEW, EntityType.TENANT,
    EntityType.CUSTOMER, EntityType.USER, EntityType.DASHBOARD, EntityType.EDGE];

  deleteRelationConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.deleteRelationConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deleteRelationConfigForm = this.fb.group({
      deleteForSingleEntity: [configuration ? configuration.deleteForSingleEntity : false, []],
      direction: [configuration ? configuration.direction : null, [Validators.required]],
      entityType: [configuration ? configuration.entityType : null, []],
      entityNamePattern: [configuration ? configuration.entityNamePattern : null, []],
      relationType: [configuration ? configuration.relationType : null, [Validators.required]]
    });
  }

  protected validatorTriggers(): string[] {
    return ['deleteForSingleEntity', 'entityType'];
  }

  protected updateValidators(emitEvent: boolean) {
    const deleteForSingleEntity: boolean = this.deleteRelationConfigForm.get('deleteForSingleEntity').value;
    const entityType: EntityType = this.deleteRelationConfigForm.get('entityType').value;
    if (deleteForSingleEntity) {
      this.deleteRelationConfigForm.get('entityType').setValidators([Validators.required]);
    } else {
      this.deleteRelationConfigForm.get('entityType').setValidators([]);
    }
    if (deleteForSingleEntity && entityType && entityType !== EntityType.TENANT) {
      this.deleteRelationConfigForm.get('entityNamePattern').setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      this.deleteRelationConfigForm.get('entityNamePattern').setValidators([]);
    }
    this.deleteRelationConfigForm.get('entityType').updateValueAndValidity({emitEvent: false});
    this.deleteRelationConfigForm.get('entityNamePattern').updateValueAndValidity({emitEvent});
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.entityNamePattern = configuration.entityNamePattern ? configuration.entityNamePattern.trim() : null;
    return configuration;
  }
}
