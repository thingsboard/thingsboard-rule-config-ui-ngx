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
  selector: 'tb-action-node-create-relation-config',
  templateUrl: './create-relation-config.component.html',
  styleUrls: []
})
export class CreateRelationConfigComponent extends RuleNodeConfigurationComponent implements OnInit, AfterViewInit {

  directionTypes = Object.keys(EntitySearchDirection);
  directionTypeTranslations = entitySearchDirectionTranslations;

  entityType = EntityType;

  createRelationConfigForm: FormGroup;

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
    this.updateValidators(false);
    this.createRelationConfigForm.get('entityType').valueChanges.subscribe(() => {
      this.updateValidators(true);
    });
    this.createRelationConfigForm.valueChanges.subscribe((updated: RuleNodeConfiguration) => {
      if (this.validateConfig()) {
        this.notifyConfigurationUpdated(updated);
      } else {
        this.notifyConfigurationUpdated(null);
      }
    });
  }

  private updateValidators(emitEvent: boolean) {
    const entityType: EntityType = this.createRelationConfigForm.get('entityType').value;
    if (entityType) {
      this.createRelationConfigForm.get('entityNamePattern').setValidators([Validators.required]);
    } else {
      this.createRelationConfigForm.get('entityNamePattern').setValidators([]);
    }
    if (entityType && (entityType === EntityType.DEVICE || entityType === EntityType.ASSET)) {
      this.createRelationConfigForm.get('entityTypePattern').setValidators([Validators.required]);
    } else {
      this.createRelationConfigForm.get('entityTypePattern').setValidators([]);
    }
    this.createRelationConfigForm.get('entityNamePattern').updateValueAndValidity({emitEvent});
    this.createRelationConfigForm.get('entityTypePattern').updateValueAndValidity({emitEvent});
  }

  private validateConfig(): boolean {
    return this.createRelationConfigForm.valid;
  }

}
