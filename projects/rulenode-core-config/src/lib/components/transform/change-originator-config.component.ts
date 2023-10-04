import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { EntityType, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  OriginatorSource,
  originatorSourceDescTranslationMap,
  originatorSourceTranslations
} from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-transformation-node-change-originator-config',
  templateUrl: './change-originator-config.component.html',
  styleUrls: ['../../../../style.scss']
})
export class ChangeOriginatorConfigComponent extends RuleNodeConfigurationComponent {

  originatorSource = OriginatorSource;
  originatorSources = Object.keys(OriginatorSource) as OriginatorSource[];
  originatorSourceTranslationMap = originatorSourceTranslations;
  originatorSourceDescTranslationMap = originatorSourceDescTranslationMap;

  changeOriginatorConfigForm: FormGroup;

  allowedEntityTypes = [EntityType.DEVICE, EntityType.ASSET, EntityType.ENTITY_VIEW, EntityType.USER, EntityType.EDGE];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.changeOriginatorConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.changeOriginatorConfigForm = this.fb.group({
      originatorSource: [configuration ? configuration.originatorSource : null, [Validators.required]],
      entityType: [configuration ? configuration.entityType : null, []],
      entityNamePattern: [configuration ? configuration.entityNamePattern : null, []],
      relationsQuery: [configuration ? configuration.relationsQuery : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['originatorSource'];
  }

  protected updateValidators(emitEvent: boolean) {
    const originatorSource: OriginatorSource = this.changeOriginatorConfigForm.get('originatorSource').value;
    if (originatorSource === OriginatorSource.RELATED) {
      this.changeOriginatorConfigForm.get('relationsQuery').setValidators([Validators.required]);
    } else {
      this.changeOriginatorConfigForm.get('relationsQuery').setValidators([]);
    }
    if (originatorSource === OriginatorSource.ENTITY) {
      this.changeOriginatorConfigForm.get('entityType').setValidators([Validators.required]);
      this.changeOriginatorConfigForm.get('entityNamePattern').setValidators([Validators.required, Validators.pattern(/.*\S.*/)]);
    } else {
      this.changeOriginatorConfigForm.get('entityType').patchValue(null, {emitEvent});
      this.changeOriginatorConfigForm.get('entityNamePattern').patchValue(null, {emitEvent});
      this.changeOriginatorConfigForm.get('entityType').setValidators([]);
      this.changeOriginatorConfigForm.get('entityNamePattern').setValidators([]);
    }
    this.changeOriginatorConfigForm.get('relationsQuery').updateValueAndValidity({emitEvent});
    this.changeOriginatorConfigForm.get('entityType').updateValueAndValidity({emitEvent});
    this.changeOriginatorConfigForm.get('entityNamePattern').updateValueAndValidity({emitEvent});
  }
}
