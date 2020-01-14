import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppState, NodeScriptTestService } from '@core/public-api';
import {
  EntitySearchDirection,
  entitySearchDirectionTranslations,
  EntityType,
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-action-node-delete-relation-config',
  templateUrl: './delete-relation-config.component.html',
  styleUrls: []
})
export class DeleteRelationConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  directionTypes = Object.keys(EntitySearchDirection);
  directionTypeTranslations = entitySearchDirectionTranslations;

  entityType = EntityType;

  deleteRelationConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.validateConfig()) {
        this.notifyConfigurationUpdated(null);
      }
    }, 0);
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deleteRelationConfigForm = this.fb.group({
      deleteForSingleEntity: [configuration ? configuration.deleteForSingleEntity : false, []],
      direction: [configuration ? configuration.direction : null, [Validators.required]],
      entityType: [configuration ? configuration.entityType : null, []],
      entityNamePattern: [configuration ? configuration.entityNamePattern : null, []],
      relationType: [configuration ? configuration.relationType : null, [Validators.required]],
      entityCacheExpiration: [configuration ? configuration.entityCacheExpiration : null, [Validators.required, Validators.min(0)]],
    });
    this.updateValidators(false, false);
    this.deleteRelationConfigForm.get('deleteForSingleEntity').valueChanges.subscribe(() => {
      this.updateValidators(true, true);
    });
    this.deleteRelationConfigForm.get('entityType').valueChanges.subscribe(() => {
      this.updateValidators(true, false);
    });
    this.deleteRelationConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.validateConfig()) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private updateValidators(emitEvent: boolean, emitEntityTypeEvent: boolean) {
    const deleteForSingleEntity: boolean = this.deleteRelationConfigForm.get('deleteForSingleEntity').value;
    const entityType: EntityType = this.deleteRelationConfigForm.get('entityType').value;
    if (deleteForSingleEntity) {
      this.deleteRelationConfigForm.get('entityType').setValidators([Validators.required]);
    } else {
      this.deleteRelationConfigForm.get('entityType').setValidators([]);
    }
    if (deleteForSingleEntity && entityType) {
      this.deleteRelationConfigForm.get('entityNamePattern').setValidators([Validators.required]);
    } else {
      this.deleteRelationConfigForm.get('entityNamePattern').setValidators([]);
    }
    this.deleteRelationConfigForm.get('entityType').updateValueAndValidity({emitEvent: emitEntityTypeEvent});
    this.deleteRelationConfigForm.get('entityNamePattern').updateValueAndValidity({emitEvent});
  }

  private validateConfig(): boolean {
    return this.deleteRelationConfigForm.valid;
  }

}
