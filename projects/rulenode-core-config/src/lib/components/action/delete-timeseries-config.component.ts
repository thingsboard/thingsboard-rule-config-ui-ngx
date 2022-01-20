import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import {
  RuleNodeConfiguration,
  RuleNodeConfigurationComponent,
  AttributeScope, telemetryTypeTranslations
} from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { TimeUnit, timeUnitTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-action-node-delete-timeseries-config',
  templateUrl: './delete-timeseries-config.component.html',
  styleUrls: []
})
export class DeleteTimeseriesConfigComponent extends RuleNodeConfigurationComponent {
  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  attributeScopes = Object.keys(AttributeScope);
  telemetryTypeTranslationsMap = telemetryTypeTranslations;

  timeUnits = Object.values(TimeUnit);
  timeUnitsTranslationMap = timeUnitTranslations;

  deleteTimeseriesConfigForm: FormGroup;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.deleteTimeseriesConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.deleteTimeseriesConfigForm = this.fb.group({
      keysPatterns: [configuration ? configuration.keysPatterns : null, Validators.required],
      deleteAllDataForKeys: [configuration ? configuration.deleteAllDataForKeys : false, []],
      rewriteLatestIfDeleted: [configuration ? configuration.rewriteLatestIfDeleted : false, []],
      useMetadataIntervalPatterns: [configuration ? configuration.useMetadataIntervalPatterns : false, []],
      startTs: [configuration ? configuration.startTs : null, []],
      startTsTimeUnit: [configuration ? configuration.startTsTimeUnit : null, []],
      endTs: [configuration ? configuration.endTs : null, []],
      endTsTimeUnit: [configuration ? configuration.endTsTimeUnit : null, []],
      startTsIntervalPattern: [configuration ? configuration.startTsIntervalPattern : null, []],
      endTsIntervalPattern: [configuration ? configuration.endTsIntervalPattern : null, []],
    });
  }

  protected validatorTriggers(): string[] {
    return ['useMetadataIntervalPatterns', 'deleteAllDataForKeys'];
  }

  protected updateValidators(emitEvent: boolean) {
    const useMetadataIntervalPatterns: boolean = this.deleteTimeseriesConfigForm.get('useMetadataIntervalPatterns').value;
    const deleteAllDataForKeys: boolean = this.deleteTimeseriesConfigForm.get('deleteAllDataForKeys').value;
    if (useMetadataIntervalPatterns) {
      this.deleteTimeseriesConfigForm.get('startTs').setValidators([]);
      this.deleteTimeseriesConfigForm.get('startTsTimeUnit').setValidators([]);
      this.deleteTimeseriesConfigForm.get('endTs').setValidators([]);
      this.deleteTimeseriesConfigForm.get('endTsTimeUnit').setValidators([]);
      this.deleteTimeseriesConfigForm.get('startTsIntervalPattern').setValidators([Validators.required]);
      this.deleteTimeseriesConfigForm.get('endTsIntervalPattern').setValidators([Validators.required]);
    } else {
      this.deleteTimeseriesConfigForm.get('startTs').setValidators([Validators.required,
        Validators.min(1), Validators.max(2147483647)]);
      this.deleteTimeseriesConfigForm.get('startTsTimeUnit').setValidators([Validators.required]);
      this.deleteTimeseriesConfigForm.get('endTs').setValidators([Validators.required,
        Validators.min(1), Validators.max(2147483647)]);
      this.deleteTimeseriesConfigForm.get('endTsTimeUnit').setValidators([Validators.required]);
      this.deleteTimeseriesConfigForm.get('startTsIntervalPattern').setValidators([]);
      this.deleteTimeseriesConfigForm.get('endTsIntervalPattern').setValidators([]);
    }
    if (deleteAllDataForKeys) {
      this.deleteTimeseriesConfigForm.get('startTs').setValidators([]);
      this.deleteTimeseriesConfigForm.get('startTsTimeUnit').setValidators([]);
      this.deleteTimeseriesConfigForm.get('endTs').setValidators([]);
      this.deleteTimeseriesConfigForm.get('endTsTimeUnit').setValidators([]);
      this.deleteTimeseriesConfigForm.get('startTsIntervalPattern').setValidators([]);
      this.deleteTimeseriesConfigForm.get('endTsIntervalPattern').setValidators([]);
    }
    this.deleteTimeseriesConfigForm.get('startTs').updateValueAndValidity({emitEvent});
    this.deleteTimeseriesConfigForm.get('startTsTimeUnit').updateValueAndValidity({emitEvent});
    this.deleteTimeseriesConfigForm.get('endTs').updateValueAndValidity({emitEvent});
    this.deleteTimeseriesConfigForm.get('endTsTimeUnit').updateValueAndValidity({emitEvent});
    this.deleteTimeseriesConfigForm.get('startTsIntervalPattern').updateValueAndValidity({emitEvent});
    this.deleteTimeseriesConfigForm.get('endTsIntervalPattern').updateValueAndValidity({emitEvent});
  }

  removeKey(key: string, keysField: string): void {
    const keys: string[] = this.deleteTimeseriesConfigForm.get(keysField).value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.deleteTimeseriesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent, keysField: string): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.deleteTimeseriesConfigForm.get(keysField).value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.deleteTimeseriesConfigForm.get(keysField).setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
