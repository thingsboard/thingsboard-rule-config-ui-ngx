import { Component } from '@angular/core';
import { AppState, isObject } from '@core/public-api';
import { Store } from '@ngrx/store';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { aggregationTranslations, AggregationType, RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  deduplicationStrategiesTranslations,
  FetchMode,
  SamplingOrder,
  samplingOrderTranslations,
  TimeUnit,
  timeUnitTranslations
} from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-enrichment-node-get-telemetry-from-database',
  templateUrl: './get-telemetry-from-database-config.component.html',
  styleUrls: ['./get-telemetry-from-database-config.component.scss']
})
export class GetTelemetryFromDatabaseConfigComponent extends RuleNodeConfigurationComponent {

  getTelemetryFromDatabaseConfigForm: UntypedFormGroup;

  separatorKeysCodes = [ENTER, COMMA, SEMICOLON];

  aggregationTypes = AggregationType;
  aggregations = Object.keys(AggregationType);
  aggregationTypesTranslations = aggregationTranslations;

  fetchMode = FetchMode;
  fetchModes = Object.keys(FetchMode);
  deduplicationStrategiesTranslations = deduplicationStrategiesTranslations;

  samplingOrders = Object.keys(SamplingOrder);
  samplingOrdersTranslate = samplingOrderTranslations;

  timeUnits = Object.values(TimeUnit);
  timeUnitsTranslationMap = timeUnitTranslations;

  timeUnitMap = {
    [TimeUnit.MILLISECONDS]: 1,
    [TimeUnit.SECONDS]: 1000,
    [TimeUnit.MINUTES]: 60000,
    [TimeUnit.HOURS]: 3600000,
    [TimeUnit.DAYS]: 86400000,
  };
  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.getTelemetryFromDatabaseConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.getTelemetryFromDatabaseConfigForm = this.fb.group({
      latestTsKeyNames: [configuration ? configuration.latestTsKeyNames : null, []],
      aggregation: [configuration ? configuration.aggregation : null, [Validators.required]],
      fetchMode: [configuration ? configuration.fetchMode : null, [Validators.required]],
      orderBy: [configuration ? configuration.orderBy : null, []],
      limit: [configuration ? configuration.limit : null, []],
      useMetadataIntervalPatterns: [configuration ? configuration.useMetadataIntervalPatterns : false, []],
      interval: this.fb.group({
        startInterval: [configuration?.interval ? configuration.interval.startInterval : null, []],
        startIntervalTimeUnit: [configuration?.interval ? configuration.interval.startIntervalTimeUnit : null, []],
        endInterval: [configuration?.interval ? configuration.interval.endInterval : null, []],
        endIntervalTimeUnit: [configuration?.interval ? configuration.interval.endIntervalTimeUnit : null, []],
      }),
      startIntervalPattern: [configuration ? configuration.startIntervalPattern : null, []],
      endIntervalPattern: [configuration ? configuration.endIntervalPattern : null, []],
    });
  }


  private intervalValidator = () => (control: AbstractControl): ValidationErrors | null => {
      if (control.get('startInterval').value * this.timeUnitMap[control.get('startIntervalTimeUnit').value] <=
        control.get('endInterval').value * this.timeUnitMap[control.get('endIntervalTimeUnit').value]) {
        return {intervalError: true};
      } else {
        return null;
      }
  };


  protected validatorTriggers(): string[] {
    return ['fetchMode', 'useMetadataIntervalPatterns'];
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.startInterval = configuration.interval.startInterval;
    configuration.startInterval = configuration.interval.startIntervalTimeUnit;
    configuration.startInterval = configuration.interval.endInterval;
    configuration.startInterval = configuration.interval.endIntervalTimeUnit;
    delete configuration.interval;
    return configuration;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    if (isObject(configuration)) {
      configuration.interval = {
        startInterval: configuration.startInterval,
        startIntervalTimeUnit: configuration.startIntervalTimeUnit,
        endInterval: configuration.endInterval,
        endIntervalTimeUnit: configuration.endIntervalTimeUnit
      };
    }
    return configuration;
  }

  protected updateValidators(emitEvent: boolean) {
    const fetchMode: FetchMode = this.getTelemetryFromDatabaseConfigForm.get('fetchMode').value;
    const useMetadataIntervalPatterns: boolean = this.getTelemetryFromDatabaseConfigForm.get('useMetadataIntervalPatterns').value;
    if (fetchMode && fetchMode === FetchMode.ALL) {
      this.getTelemetryFromDatabaseConfigForm.get('aggregation').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('orderBy').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('limit').setValidators([Validators.required, Validators.min(2), Validators.max(1000)]);
    } else {
      this.getTelemetryFromDatabaseConfigForm.get('aggregation').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('orderBy').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('limit').setValidators([]);
    }
    if (useMetadataIntervalPatterns) {
      this.getTelemetryFromDatabaseConfigForm.get('interval.startInterval').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('interval.startIntervalTimeUnit').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('interval.endInterval').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('interval.endIntervalTimeUnit').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('interval').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('startIntervalPattern').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('endIntervalPattern').setValidators([Validators.required]);
    } else {
      this.getTelemetryFromDatabaseConfigForm.get('interval.startInterval').setValidators([Validators.required,
        Validators.min(1), Validators.max(2147483647)]);
      this.getTelemetryFromDatabaseConfigForm.get('interval.startIntervalTimeUnit').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('interval.endInterval').setValidators([Validators.required,
        Validators.min(1), Validators.max(2147483647)]);
      this.getTelemetryFromDatabaseConfigForm.get('interval.endIntervalTimeUnit').setValidators([Validators.required]);
      this.getTelemetryFromDatabaseConfigForm.get('interval').setValidators([this.intervalValidator()]);
      this.getTelemetryFromDatabaseConfigForm.get('startIntervalPattern').setValidators([]);
      this.getTelemetryFromDatabaseConfigForm.get('endIntervalPattern').setValidators([]);
    }
    this.getTelemetryFromDatabaseConfigForm.get('aggregation').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('orderBy').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('limit').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('interval.startInterval').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('interval.startIntervalTimeUnit').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('interval.endInterval').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('interval.endIntervalTimeUnit').updateValueAndValidity({emitEvent});
    this.getTelemetryFromDatabaseConfigForm.get('interval').updateValueAndValidity({emitEvent});
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

  clearChipGrid() {
    this.getTelemetryFromDatabaseConfigForm.get('latestTsKeyNames').patchValue([], {emitEvent: true});
  }

  fetchModeHintSelector() {
    let hint;
    switch (this.getTelemetryFromDatabaseConfigForm.get('fetchMode').value) {
      case FetchMode.ALL:
        hint = 'tb.rulenode.all-mode-hint';
        break;
      case FetchMode.LAST:
        hint = 'tb.rulenode.last-mode-hint';
        break;
      case FetchMode.FIRST:
        hint = 'tb.rulenode.first-mode-hint';
        break;
    }
    return hint;
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
