import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { MatChipInputEvent } from '@angular/material/chips';
import { FetchMode, SamplingOrder, TimeUnit, timeUnitTranslations } from '../../rulenode-core-config.models';

@Component({
  selector: 'tb-enrichment-node-get-telemetry-from-database',
  templateUrl: './get-telemetry-from-database-config.component.html',
  styleUrls: ['./get-telemetry-from-database-config.component.scss']
})
export class GetTelemetryFromDatabaseConfigComponent extends RuleNodeConfigurationComponent {

  getTelemetryFromDatabaseConfigForm: FormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  fetchMode = FetchMode;
  fetchModes = Object.keys(FetchMode);

  samplingOrders = Object.keys(SamplingOrder);

  timeUnits = Object.values(TimeUnit);
  timeUnitsTranslationMap = timeUnitTranslations;

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.getTelemetryFromDatabaseConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.getTelemetryFromDatabaseConfigForm = this.fb.group({
      latestTsKeyNames: [configuration ? configuration.latestTsKeyNames : null, []],
      fetchMode: [configuration ? configuration.fetchMode : null, [Validators.required]],
      orderBy: [configuration ? configuration.orderBy : null, []],
      limit: [configuration ? configuration.limit : null, []],
      useMetadataIntervalPatterns: [configuration ? configuration.useMetadataIntervalPatterns : false, []],
      startInterval: [configuration ? configuration.startInterval : null, []],
      startIntervalTimeUnit: [configuration ? configuration.startIntervalTimeUnit : null, []],
      endInterval: [configuration ? configuration.endInterval : null, []],
      endIntervalTimeUnit: [configuration ? configuration.endIntervalTimeUnit : null, []],
      startIntervalPattern: [configuration ? configuration.startIntervalPattern : null, []],
      endIntervalPattern: [configuration ? configuration.endIntervalPattern : null, []],
    });
  }

  protected validatorTriggers(): string[] {
    return ['fetchMode', 'useMetadataIntervalPatterns'];
  }

  protected updateValidators(emitEvent: boolean) {
    const fetchMode: FetchMode = this.getTelemetryFromDatabaseConfigForm.get('fetchMode').value;
    const useMetadataIntervalPatterns: boolean = this.getTelemetryFromDatabaseConfigForm.get('useMetadataIntervalPatterns').value;
    if (fetchMode && fetchMode === FetchMode.ALL) {
      this.getTelemetryFromDatabaseConfigForm.get('orderBy').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('limit').setValidators([Validators.required, Validators.min(2), Validators.max(1000)]);
    } else {
      this.getTelemetryFromDatabaseConfigForm.get('orderBy').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('limit').setValidators([]);
    }
    if (useMetadataIntervalPatterns) {
      this.getTelemetryFromDatabaseConfigForm.get('startInterval').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('startIntervalTimeUnit').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('endInterval').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('endIntervalTimeUnit').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('startIntervalPattern').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('endIntervalPattern').setValidators([Validators.required]);
    } else {
      this.getTelemetryFromDatabaseConfigForm.get('startInterval').setValidators([Validators.required,
        Validators.min(1), Validators.max(2147483647)]);
      this.getTelemetryFromDatabaseConfigForm.get('startIntervalTimeUnit').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('endInterval').setValidators([Validators.required,
        Validators.min(1), Validators.max(2147483647)]);
      this.getTelemetryFromDatabaseConfigForm.get('endIntervalTimeUnit').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('startIntervalPattern').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('endIntervalPattern').setValidators([]);
    }
    this.getTelemetryFromDatabaseConfigForm.get('orderBy').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('limit').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('startInterval').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('startIntervalTimeUnit').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('endInterval').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('endIntervalTimeUnit').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('startIntervalPattern').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('endIntervalPattern').updateValueAndValidity({emitEvent});
  }

  removeKey(key: string, keysField: string): void {
    const keys: string[] = this.getTelemetryFromDatabaseConfigForm.get(keysField).value;
    const index = keys.indexOf(key);
    if (index >= 0) {
      keys.splice(index, 1);
      this.getTelemetryFromDatabaseConfigForm.get(keysField).setValue(keys, {emitEvent: true});
    }
  }

  addKey(event: MatChipInputEvent, keysField: string): void {
    const input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      value = value.trim();
      let keys: string[] = this.getTelemetryFromDatabaseConfigForm.get(keysField).value;
      if (!keys || keys.indexOf(value) === -1) {
        if (!keys) {
          keys = [];
        }
        keys.push(value);
        this.getTelemetryFromDatabaseConfigForm.get(keysField).setValue(keys, {emitEvent: true});
      }
    }
    if (input) {
      input.value = '';
    }
  }
}
