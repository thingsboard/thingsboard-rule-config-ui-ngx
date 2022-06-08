import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OriginatorSource, originatorSourceTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-transformation-node-change-originator-config',
  templateUrl: './change-originator-config.component.html',
  styleUrls: []
})
export class ChangeOriginatorConfigComponent extends RuleNodeConfigurationComponent {

  originatorSource = OriginatorSource;
  originatorSources = Object.keys(OriginatorSource);
  originatorSourceTranslationMap = originatorSourceTranslations;

  changeOriginatorConfigForm: FormGroup;

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
      relationsQuery: [configuration ? configuration.relationsQuery : null, []],
      entityNamePattern: [configuration ? configuration.entityNamePattern : null, []],
      entityTypePattern: [configuration ? configuration.entityTypePattern : null, []],
      entityLabelPattern: [configuration ? configuration.entityLabelPattern : null, []]
    });
  }

  protected validatorTriggers(): string[] {
    return ['originatorSource'];
  }

  protected updateValidators(emitEvent: boolean) {
    const originatorSource: OriginatorSource = this.changeOriginatorConfigForm.get('originatorSource').value;
    if (originatorSource && originatorSource === OriginatorSource.RELATED) {
      this.changeOriginatorConfigForm.get('relationsQuery').setValidators([Validators.required]);
      this.changeOriginatorConfigForm.get('entityNamePattern').setValidators([]);
      this.changeOriginatorConfigForm.get('entityTypePattern').setValidators([]);
    } else if (originatorSource && (originatorSource === OriginatorSource.DEVICE || originatorSource === OriginatorSource.ASSET)) {
      this.changeOriginatorConfigForm.get('entityNamePattern')
        .setValidators([Validators.required, Validators.pattern('(.|\\s)*\\S(.|\\s)*'), Validators.maxLength(255)]);
      this.changeOriginatorConfigForm.get('entityTypePattern')
        .setValidators([Validators.required, Validators.pattern('(.|\\s)*\\S(.|\\s)*'), Validators.maxLength(255)]);
      this.changeOriginatorConfigForm.get('relationsQuery').setValidators([]);
    } else {
      this.changeOriginatorConfigForm.get('relationsQuery').setValidators([]);
      this.changeOriginatorConfigForm.get('entityNamePattern').setValidators([]);
      this.changeOriginatorConfigForm.get('entityTypePattern').setValidators([]);
    }
    this.changeOriginatorConfigForm.get('relationsQuery').updateValueAndValidity({emitEvent});
    this.changeOriginatorConfigForm.get('entityNamePattern').updateValueAndValidity({emitEvent});
    this.changeOriginatorConfigForm.get('entityTypePattern').updateValueAndValidity({emitEvent});
  }
}
