import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull, isObject } from '@core/public-api';
import { Store } from '@ngrx/store';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  Validators,
  FormBuilder
} from '@angular/forms';
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

  getTelemetryFromDatabaseConfigForm: FormGroup;

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
              private fb: FormBuilder) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.getTelemetryFromDatabaseConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.getTelemetryFromDatabaseConfigForm = this.fb.group({
      latestTsKeyNames: [configuration.latestTsKeyNames, []],
      aggregation: [configuration.aggregation, [Validators.required]],
      fetchMode: [configuration.fetchMode, [Validators.required]],
      orderBy: [configuration.orderBy, []],
      limit: [configuration.limit, []],
      useMetadataIntervalPatterns: [configuration.useMetadataIntervalPatterns, []],
      interval: this.fb.group({
        startInterval: [configuration.interval.startInterval, []],
        startIntervalTimeUnit: [configuration.interval.startIntervalTimeUnit, []],
        endInterval: [configuration.interval.endInterval, []],
        endIntervalTimeUnit: [configuration.interval.endIntervalTimeUnit, []],
      }),
      startIntervalPattern: [configuration.startIntervalPattern, []],
      endIntervalPattern: [configuration.endIntervalPattern, []],
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
    configuration.startIntervalPattern =  configuration.startIntervalPattern.trim();
    configuration.endIntervalPattern =  configuration.endIntervalPattern.trim();
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

    return {
      latestTsKeyNames: isDefinedAndNotNull(configuration?.latestTsKeyNames) ? configuration.latestTsKeyNames : null,
      aggregation: isDefinedAndNotNull(configuration?.aggregation) ? configuration.aggregation : AggregationType.NONE,
      fetchMode: isDefinedAndNotNull(configuration?.fetchMode) ? configuration.fetchMode : FetchMode.FIRST,
      orderBy: isDefinedAndNotNull(configuration?.orderBy) ? configuration.orderBy : SamplingOrder.ASC,
      limit: isDefinedAndNotNull(configuration?.limit) ? configuration.limit : 1000,
      useMetadataIntervalPatterns: isDefinedAndNotNull(configuration?.useMetadataIntervalPatterns) ?
        configuration.useMetadataIntervalPatterns : false,
      interval: {
        startInterval: isDefinedAndNotNull(configuration?.interval?.startInterval) ? configuration.interval.startInterval : 2,
        startIntervalTimeUnit: isDefinedAndNotNull(configuration?.interval?.startIntervalTimeUnit) ?
          configuration.interval.startIntervalTimeUnit : TimeUnit.MINUTES,
        endInterval: isDefinedAndNotNull(configuration?.interval?.endInterval) ? configuration.interval.endInterval : 1,
        endIntervalTimeUnit: isDefinedAndNotNull(configuration?.interval?.endIntervalTimeUnit) ?
          configuration.interval.endIntervalTimeUnit : TimeUnit.MINUTES,
      },
      startIntervalPattern: isDefinedAndNotNull(configuration?.startIntervalPattern) ? configuration.startIntervalPattern : null,
      endIntervalPattern: isDefinedAndNotNull(configuration?.endIntervalPattern) ? configuration.endIntervalPattern : null
    };
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
      this.getTelemetryFromDatabaseConfigForm.get('startIntervalPattern').setValidators([Validators.required,
        Validators.pattern(/(?:.|\s)*\S(&:.|\s)*/)]);
      this.getTelemetryFromDatabaseConfigForm.get('endIntervalPattern').setValidators([Validators.required,
        Validators.pattern(/(?:.|\s)*\S(&:.|\s)*/)]);
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
